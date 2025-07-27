import { useColorScheme } from "@/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { RegisterProvider } from "../../contexts/RegisterContext";

export default function RegisterLayout() {
  const colorScheme = useColorScheme();
  return (
    <RegisterProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Register" }} />
          <Stack.Screen name="player-info" options={{ title: "Player Info" }} />
          <Stack.Screen name="account" options={{ title: "Create Account" }} />
        </Stack>
      </ThemeProvider>
    </RegisterProvider>
  );
}
