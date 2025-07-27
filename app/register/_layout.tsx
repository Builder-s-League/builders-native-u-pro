import { Stack } from "expo-router";
import { RegisterProvider } from "../../contexts/RegisterContext";

export default function RegisterLayout() {
  return (
    <RegisterProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Register" }} />
        <Stack.Screen name="player-info" options={{ title: "Player Info" }} />
        <Stack.Screen name="account" options={{ title: "Create Account" }} />
      </Stack>
    </RegisterProvider>
  );
}
