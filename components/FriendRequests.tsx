import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Friend {
  id: number;
  name: string;
  profile_picture?: string;
}

interface FriendRequest {
  id: number;
  requester: Friend;
  created_at: string;
}

interface Friendship {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  created_at: string;
}

export default function FriendRequests() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Get current user ID
  useEffect(() => {
    getCurrentUserId();
  }, []);

  // Load data when modal opens
  useEffect(() => {
    if (isModalVisible && currentUserId) {
      loadFriendRequests();
      loadFriends();
    }
  }, [isModalVisible, currentUserId]);

  const getCurrentUserId = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get account_id from accounts table, then get user_id from users table
        const { data: accountData } = await supabase
          .from('accounts')
          .select('id')
          .eq('auth_user_id', user.id)
          .single();

        if (accountData) {
          const { data: userData } = await supabase
            .from('users')
            .select('id')
            .eq('account_id', accountData.id)
            .single();

          if (userData) {
            setCurrentUserId(userData.id);
          }
        }
      }
    } catch (error) {
      console.error('Error getting current user ID:', error);
    }
  };

  const loadFriendRequests = async () => {
    if (!currentUserId) return;

    setLoading(true);
    try {
      // Get friend requests sent to current user (status: pending)
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          created_at,
          requester:users!friendships_requester_id_fkey (
            id,
            name,
            profile_picture
          )
        `)
        .eq('addressee_id', currentUserId)
        .eq('status', 'pending');

      if (error) throw error;

      // Transform data format to match interface
      const formattedRequests: FriendRequest[] = (data || []).map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        requester: {
          id: item.requester.id,
          name: item.requester.name,
          profile_picture: item.requester.profile_picture
        }
      }));

      setFriendRequests(formattedRequests);
    } catch (error) {
      console.error('Error loading friend requests:', error);
      Alert.alert('Error', 'Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  const loadFriends = async () => {
    if (!currentUserId) return;

    try {
      // Get accepted friend relationships
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          users!friendships_requester_id_fkey (
            id,
            name,
            profile_picture
          )
        `)
        .eq('addressee_id', currentUserId)
        .eq('status', 'accepted');

      if (error) throw error;

      // Transform data format to match interface
      const friendsList: Friend[] = (data || []).map((item: any) => ({
        id: item.users.id,
        name: item.users.name,
        profile_picture: item.users.profile_picture
      }));
      
      setFriends(friendsList);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;

      Alert.alert('Success', 'Friend request accepted!');
      loadFriendRequests();
      loadFriends();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .update({ status: 'rejected' })
        .eq('id', requestId);

      if (error) throw error;

      Alert.alert('Success', 'Friend request rejected');
      loadFriendRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      Alert.alert('Error', 'Failed to reject friend request');
    }
  };

  const sendFriendRequest = async (targetUserId: number) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: currentUserId,
          addressee_id: targetUserId,
          status: 'pending'
        });

      if (error) throw error;

      Alert.alert('Success', 'Friend request sent!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  return (
    <>
      {/* Friend request button in top right corner */}
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        className="w-10 h-10 bg-white rounded-lg border border-gray-200 justify-center items-center shadow-sm"
      >
        <Ionicons name="people" size={20} color="#3b82f6" />
        {friendRequests.length > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
            <Text className="text-white text-xs font-bold">
              {friendRequests.length}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">Friends</Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              className="w-8 h-8 justify-center items-center"
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-4 py-2">
            {/* Friend requests section */}
            {friendRequests.length > 0 && (
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                  Friend Requests ({friendRequests.length})
                </Text>
                {friendRequests.map((request) => (
                  <View
                    key={request.id}
                    className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-blue-100 rounded-full justify-center items-center mr-3">
                          <Ionicons name="person" size={24} color="#3b82f6" />
                        </View>
                        <View className="flex-1">
                          <Text className="font-medium text-gray-800">
                            {request.requester.name}
                          </Text>
                          <Text className="text-sm text-gray-500">
                            Sent {new Date(request.created_at).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                      <View className="flex-row">
                        <TouchableOpacity
                          onPress={() => handleAcceptRequest(request.id)}
                          className="bg-green-500 px-4 py-2 rounded-lg mr-2"
                        >
                          <Text className="text-white font-medium">Accept</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleRejectRequest(request.id)}
                          className="bg-red-500 px-4 py-2 rounded-lg"
                        >
                          <Text className="text-white font-medium">Reject</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Friends list section */}
            <View>
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Friends ({friends.length})
              </Text>
              {loading ? (
                <View className="py-8">
                  <ActivityIndicator size="large" color="#3b82f6" />
                </View>
              ) : friends.length > 0 ? (
                friends.map((friend) => (
                  <View
                    key={friend.id}
                    className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
                  >
                    <View className="flex-row items-center">
                      <View className="w-12 h-12 bg-blue-100 rounded-full justify-center items-center mr-3">
                        <Ionicons name="person" size={24} color="#3b82f6" />
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium text-gray-800">
                          {friend.name}
                        </Text>
                        <Text className="text-sm text-gray-500">Online</Text>
                      </View>
                      <TouchableOpacity className="w-8 h-8 justify-center items-center">
                        <Ionicons name="chatbubble" size={20} color="#6b7280" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View className="bg-white rounded-lg p-8 items-center">
                  <Ionicons name="people-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 text-center mt-2">
                    No friends yet. Start connecting with other players!
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
} 