import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

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

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      Alert.alert("Success", "Check your email for the reset link!");
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="absolute top-12 left-6 z-10">
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
          <Text className="mb-6 text-center text-2xl font-bold text-gray-900">
            Reset your password
          </Text>

          <TextInput
            className="px-4 py-3 rounded-xl bg-gray-100 border border-gray-200 text-gray-900 mb-6"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            className={`py-4 rounded-full mb-3 ${loading ? "opacity-60" : ""}`}
            onPress={handleResetPassword}
            disabled={loading}
            style={{ backgroundColor: BRAND_PURPLE }}
          >
            <Text className="text-base font-semibold text-center text-white">
              {loading ? "Sending..." : "Send Reset Link"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-center text-gray-600">Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
