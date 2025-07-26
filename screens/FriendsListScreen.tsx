import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Friend {
  id: string;
  username: string;
  avatar_url?: string;
  email: string;
}

const FriendsListScreen: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchFriends = async () => {
    try {
      // Mock data for now - you can replace this with actual Supabase query
      const mockFriends: Friend[] = [
        {
          id: '1',
          username: 'Alex Johnson',
          email: 'alex@example.com',
          avatar_url: undefined,
        },
        {
          id: '2', 
          username: 'Maria Garcia',
          email: 'maria@example.com',
          avatar_url: undefined,
        },
        {
          id: '3',
          username: 'David Smith', 
          email: 'david@example.com',
          avatar_url: undefined,
        },
        {
          id: '4',
          username: 'Sarah Wilson',
          email: 'sarah@example.com',
          avatar_url: undefined,
        },
        {
          id: '5',
          username: 'Michael Brown',
          email: 'michael@example.com',
          avatar_url: undefined,
        },
        {
          id: '6',
          username: 'Emily Davis',
          email: 'emily@example.com',
          avatar_url: undefined,
        },
        {
          id: '7',
          username: 'James Miller',
          email: 'james@example.com',
          avatar_url: undefined,
        },
        {
          id: '8',
          username: 'Jessica Moore',
          email: 'jessica@example.com',
          avatar_url: undefined,
        },
        {
          id: '9',
          username: 'Robert Taylor',
          email: 'robert@example.com',
          avatar_url: undefined,
        },
        {
          id: '10',
          username: 'Amanda Anderson',
          email: 'amanda@example.com',
          avatar_url: undefined,
        },
        {
          id: '11',
          username: 'Christopher Lee',
          email: 'chris@example.com',
          avatar_url: undefined,
        },
        {
          id: '12',
          username: 'Lisa Thompson',
          email: 'lisa@example.com',
          avatar_url: undefined,
        },
      ];
      
      setFriends(mockFriends);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFriends();
  };

  const handleChatPress = (friend: Friend) => {
    router.push({
      pathname: '/chat',
      params: { 
        friendId: friend.id,
        friendName: friend.username 
      },
    } as any); // Type assertion to fix navigation issue
  };

  const renderFriendItem = ({ item, index }: { item: Friend; index: number }) => (
    <View 
      className="flex-row items-center shadow-sm"
      style={{ 
        backgroundColor: '#E9E9E9',
        borderRadius: 16,
        marginBottom: index === friends.length - 1 ? 0 : 10,
        marginTop: index === 0 ? 0 : 0,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 4,
      }}
    >
      {/* Avatar */}
      <View 
        className="items-center justify-center" 
        style={{ 
          width: 45, 
          height: 45, 
          borderRadius: 22.5, 
          backgroundColor: '#D1D5DB',
          marginRight: 12,
        }}
      >
        {item.avatar_url ? (
          <Image 
            source={{ uri: item.avatar_url }} 
            style={{ 
              width: 45, 
              height: 45, 
              borderRadius: 22.5 
            }}
            resizeMode="cover"
          />
        ) : (
          <Text className="text-gray-800 font-bold" style={{ fontSize: 18 }}>
            {item.username.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      {/* Username */}
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {item.username}
        </Text>
      </View>

      {/* Chat Button */}
      <TouchableOpacity
        onPress={() => handleChatPress(item)}
        className="rounded-full shadow-lg"
        style={{
          backgroundColor: '#4EDE00',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 5,
          paddingVertical: 10,
          paddingHorizontal: 20,
        }}
      >
        <Text className="text-white font-semibold" style={{ fontSize: 16 }}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View 
      className="flex-1" 
      style={{ 
        backgroundColor: '#F9F9F9',
        paddingTop: 16,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Friends List Container */}
      <View className="flex-1 px-4">
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 0, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Text className="text-gray-500 text-lg">No friends yet</Text>
              <Text className="text-gray-400 text-sm mt-2">Pull to refresh</Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default FriendsListScreen;
