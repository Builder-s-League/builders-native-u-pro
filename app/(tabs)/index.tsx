import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const { user, loading } = useAuth();

  const handleFriendsPress = () => {
    router.push('/friends');
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <Text className="text-2xl font-bold text-center mb-4 text-gray-800">
            Welcome! 🌿
          </Text>
          <Text className="text-center text-gray-600 mb-4">
            You are successfully signed in!
          </Text>
          <Text className="text-center text-blue-600 font-medium">
            {user.email}
          </Text>
        </View>
        
        {/* Friends Button */}
        <TouchableOpacity
          onPress={handleFriendsPress}
          className="w-full bg-green-500 py-4 rounded-full mb-6 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <Text className="text-white text-lg font-semibold text-center">
            Friends Menu
          </Text>
        </TouchableOpacity>
        
        <Text className="text-center text-gray-500 text-sm">
          Check out the Profile tab to manage your account
        </Text>
      </View>
    </View>
  );
}
