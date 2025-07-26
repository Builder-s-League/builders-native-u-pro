import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";

type AuthMode = "signin" | "signup";

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const { signIn, signUp, resetPassword } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password, firstName, lastName);
        if (error) throw error;
        Alert.alert("Success", "Check your email for the confirmation link!");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      Alert.alert("Success", "Check your email for the reset link!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 justify-center px-6 bg-gray-50"
    >
      <View className="p-8 bg-white rounded-lg shadow-lg">
        <Text className="mb-8 text-3xl font-bold text-center text-gray-800">
          {mode === "signin" ? "Welcome" : "Create Account"}
        </Text>

        <View className="mb-4">
          <Text className="mb-2 font-medium text-gray-700">Email</Text>
          <TextInput
            className="px-4 py-3 text-gray-800 rounded-lg border border-gray-300"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {mode === "signup" && (
          <>
            <View className="mb-6">
              <Text className="mb-2 font-medium text-gray-700">First Name</Text>
              <TextInput
                className="px-4 py-3 text-gray-800 rounded-lg border border-gray-300"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View className="mb-6">
              <Text className="mb-2 font-medium text-gray-700">Last Name</Text>
              <TextInput
                className="px-4 py-3 text-gray-800 rounded-lg border border-gray-300"
                placeholder="First Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </>
        )}

        <View className="mb-6">
          <Text className="mb-2 font-medium text-gray-700">Password</Text>
          <TextInput
            className="px-4 py-3 text-gray-800 rounded-lg border border-gray-300"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          className={`py-4 rounded-lg mb-4 ${
            loading ? "bg-gray-400" : "bg-blue-600"
          }`}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text className="text-lg font-semibold text-center text-white">
            {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        {mode === "signin" ? (
          <TouchableOpacity
            className="py-3 mb-4"
            onPress={() => router.push("/register" as const)}
          >
            <Text className="font-medium text-center text-blue-600">
              Don&#39;t have an account? Sign up
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="py-3 mb-4"
            onPress={() => setMode("signin")}
          >
            <Text className="font-medium text-center text-blue-600">
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>
        )}

        {mode === "signin" && (
          <TouchableOpacity className="py-2" onPress={handleResetPassword}>
            <Text className="text-center text-gray-600">
              Forgot your password?
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
