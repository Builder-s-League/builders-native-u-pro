import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { router } from "expo-router";

type AuthMode = "signin" | "signup";

const BRAND_PURPLE = "#5B3DF8";
const cardShadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 8 },
});

const AuthScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white px-6"
    >
      <View className="absolute top-12 left-6 z-10">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center pb-6">
        <View className="items-center mb-6">
          <Image
            source={require("../assets/images/logo.png")}
            className="w-36 h-36"
            resizeMode="contain"
          />
        </View>

        <View
          className="w-full rounded-3xl bg-white p-6"
          style={cardShadow as any}
        >
          <View className="mb-4">
            <Text className="mb-2 text-gray-700">Email</Text>
            <TextInput
              className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-900"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-gray-700">Password</Text>
            <TextInput
              className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-900"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            className={`py-4 rounded-full mb-3 ${loading ? "opacity-60" : ""}`}
            onPress={handleAuth}
            disabled={loading}
            style={{ backgroundColor: BRAND_PURPLE }}
          >
            <Text className="text-base font-semibold text-center text-white">
              {loading ? "Loading..." : "sign in"}
            </Text>
          </TouchableOpacity>

          {mode === "signin" && (
            <TouchableOpacity
              className="py-2"
              onPress={() => router.push("/forgot-password")}
            >
              <Text className="text-center text-gray-600">Forgot password</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className="py-2"
            onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            <Text className="text-center text-gray-500">
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
        {mode === "signup" && (
          <View className="mt-4">
            <View className="mb-4">
              <Text className="mb-2 text-gray-700">First Name</Text>
              <TextInput
                className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-900"
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            <View className="mb-2">
              <Text className="mb-2 text-gray-700">Last Name</Text>
              <TextInput
                className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-900"
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              className={`py-4 rounded-full mt-4 ${loading ? "opacity-60" : ""}`}
              onPress={handleAuth}
              disabled={loading}
              style={{ backgroundColor: BRAND_PURPLE }}
            >
              <Text className="text-base font-semibold text-center text-white">
                {loading ? "Loading..." : "sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;
