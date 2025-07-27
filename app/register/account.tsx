import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useRegister } from "../../contexts/RegisterContext";

export default function AccountPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const { setAccountInfo, data } = useRegister();

  const handleCreateAccount = () => {
    setAccountInfo({ email, firstName, lastName, password });

    console.log("🚀 Final Register Data:", {
      ...data,
      email,
      firstName,
      lastName,
      password,
    });

    Alert.alert("Account Created", "You can now log in!");
  };

  return (
    <View style={{ padding: 20 }}>
      <View className="h-12" />
      {/* Title and Step Indicator */}
      <View className="mb-8">
        {/* Step Numbers */}
        <View className="flex-row justify-center items-center space-x-8">
          <Text className="text-2xl text-gray-400  mr-8">1</Text>
          <Text className="text-2xl text-gray-400  mr-8">2</Text>
          <Text className="text-2xl font-bold text-black">3</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800 text-center mt-4">
          Guardian information
        </Text>
      </View>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="First Name" onChangeText={setFirstName} />
      <TextInput placeholder="Last Name" onChangeText={setLastName} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      {/* <Button title="Create Account" onPress={handleCreateAccount} /> */}
      <View className="mt-4 space-y-4 items-center">
        <Pressable
          onPress={handleCreateAccount}
          className="py-4 rounded-xl bg-blue-800 w-1/2 mb-4"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Create Account
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
