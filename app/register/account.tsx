import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
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
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="First Name" onChangeText={setFirstName} />
      <TextInput placeholder="Last Name" onChangeText={setLastName} />
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title="Create Account" onPress={handleCreateAccount} />
    </View>
  );
}
