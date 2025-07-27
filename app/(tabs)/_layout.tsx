import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import AuthScreen from "@/components/AuthScreen";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ActiveUserProvider } from "@/contexts/ActiveUserContext";
import { FriendStatusProvider } from "@/contexts/FriendStatusContext";

type IconName = React.ComponentProps<typeof IconSymbol>["name"];

interface NavItem {
  name: string;
  title: string;
  icon: IconName;
}

const navigations: NavItem[] = [
  { name: "index", title: "Home", icon: "house.fill" },
  { name: "training", title: "Training", icon: "figure.walk" },
  { name: "multiPlayer", title: "Multiplayer", icon: "person.3.fill" },
  { name: "lockerRoom", title: "Locker Room", icon: "lock.fill" },
  { name: "shop", title: "Shop", icon: "cart.fill" },
];

export default function TabLayout() {
  const { user: authUser } = useAuth();
  const colorScheme = useColorScheme();

  if (!authUser) return <AuthScreen />;

  return (
    <ActiveUserProvider>
      <FriendStatusProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"]?.tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: { position: "absolute" },
              default: {},
            }),
          }}
        >
          {navigations.map(({ name, title, icon }) => (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title,
                tabBarIcon: ({ color }) => (
                  <IconSymbol size={28} name={icon} color={color} />
                ),
              }}
            />
          ))}
        </Tabs>
      </FriendStatusProvider>
    </ActiveUserProvider>
  );
}
