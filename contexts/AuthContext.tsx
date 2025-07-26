import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type AuthContextType = {
	user: User | null;
	session: Session | null;
	loading: boolean;
	signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<any>;
	signIn: (email: string, password: string) => Promise<any>;
	signOut: () => Promise<any>;
	resetPassword: (email: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const signUp = async (
		email: string,
		password: string,
		firstName: string,
		lastName: string
	) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name: firstName,
					last_name: lastName,
				},
			},
		});
		return { error };
	};

	const signIn = async (email: string, password: string) => {
		setLoading(true);
		const result = await supabase.auth.signInWithPassword({
			email,
			password,
		});
		setLoading(false);
		return result;
	};

	const signOut = async () => {
		setLoading(true);
		const result = await supabase.auth.signOut();
		setLoading(false);
		return result;
	};

	const resetPassword = async (email: string) => {
		try {
			const { data: accountData, error: accountError } = await supabase
				.from('accounts')
				.select('id')
				.eq('email', email.toLowerCase())
				.single();

			if (accountError || !accountData) {
				return {
					error: {
						message: 'Email not found',
					}
				};
			}

			const result = await supabase.auth.resetPasswordForEmail(email);

			return result;
		} catch (error) {
			return {
				error: {
					message: 'An error occurred. Please try again.',
				}
			};
		}
	};

	const value = {
		user,
		session,
		loading,
		signUp,
		signIn,
		signOut,
		resetPassword,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};