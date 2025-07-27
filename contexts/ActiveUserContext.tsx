import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/interfaces/interfaces";

interface ActiveUserContextType {
  /** The currently active DB user */
  activeUser: User | null;
  /** Manually switch active user (and persist to account) */
  setActiveUser: (user: User) => Promise<void>;
}

const ActiveUserContext = createContext<ActiveUserContextType | null>(null);

export function useActiveUser() {
  const ctx = useContext(ActiveUserContext);
  if (!ctx)
    throw new Error("useActiveUser must be used within ActiveUserProvider");
  return ctx;
}

/**
 * ActiveUserProvider:
 * - Reads account.last_active_user_id
 * - If null, picks the first user of the account and writes it back
 * - Exposes that user as activeUser, plus setter to switch and persist
 */
export const ActiveUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user: authUser } = useAuth();
  const [activeUser, setActive] = useState<User | null>(null);

  useEffect(() => {
    if (!authUser) {
      setActive(null);
      return;
    }

    async function loadActive() {
      // 1) fetch the account row, including last_active_user_id
      const { data: account, error: accErr } = await supabase
        .from("accounts")
        .select("id, last_active_user_id")
        .eq("auth_user_id", authUser?.id)
        .single();
      if (accErr || !account) {
        console.error("Error loading account", accErr);
        return;
      }

      let userId = account.last_active_user_id;

      if (!userId) {
        // 2) no active set: fetch first child user of account
        const { data: users, error: uErr } = await supabase
          .from("users")
          .select("id")
          .eq("account_id", account.id)
          .order("id", { ascending: true })
          .limit(1);
        if (uErr || !users || users.length === 0) {
          console.error("No users found for account", uErr);
          return;
        }
        userId = users[0].id;
        // 3) persist back to account
        await supabase
          .from("accounts")
          .update({ last_active_user_id: userId })
          .eq("id", account.id);
      }

      // 4) load the active user's full record
      const { data: userRec, error: uRecErr } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (uRecErr) console.error("Error loading active user", uRecErr);
      setActive(userRec ?? null);
    }

    loadActive();
  }, [authUser]);

  /**
   * Switch active user and persist on accounts table
   */
  const setActiveUser = async (user: User) => {
    const { data: account, error: accErr } = await supabase
      .from("accounts")
      .select("id")
      .eq("auth_user_id", authUser?.id)
      .single();
    if (accErr || !account) {
      console.error("Error finding account for switch", accErr);
      return;
    }
    // persist
    const { error: updErr } = await supabase
      .from("accounts")
      .update({ last_active_user_id: user.id })
      .eq("id", account.id);
    if (updErr) console.error("Error updating last_active_user_id", updErr);
    setActive(user);
  };

  return (
    <ActiveUserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </ActiveUserContext.Provider>
  );
};
