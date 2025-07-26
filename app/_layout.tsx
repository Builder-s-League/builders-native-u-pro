import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform, Text, TouchableOpacity } from "react-native";

import "react-native-reanimated";
import "./globals.css";

import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
          <Stack.Screen 
            name="friends" 
            options={{
              title: 'Friends',
              headerBackTitle: '',
              headerLeft: Platform.OS === 'ios' ? () => (
                <TouchableOpacity 
                  onPress={() => router.back()}
                  style={{ paddingLeft: 16, paddingRight: 8, paddingVertical: 8 }}
                >
                  <Text style={{ fontSize: 28, color: '#000', fontWeight: '300' }}>←</Text>
                </TouchableOpacity>
              ) : undefined,
              headerStyle: {
                backgroundColor: '#F9F9F9',
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen 
            name="chat" 
            options={{
              title: 'Chat',
              headerBackTitle: '',
              headerLeft: Platform.OS === 'ios' ? () => (
                <TouchableOpacity 
                  onPress={() => router.back()}
                  style={{ paddingLeft: 16, paddingRight: 8, paddingVertical: 8 }}
                >
                  <Text style={{ fontSize: 28, color: '#000', fontWeight: '300' }}>←</Text>
                </TouchableOpacity>
              ) : undefined,
              headerStyle: {
                backgroundColor: '#F9F9F9',
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }} 
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
