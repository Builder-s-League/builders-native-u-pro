import useFetch from "@/hooks/useFetch";
import { Account, User } from "@/interfaces/interfaces";
import { supabase } from "@/lib/supabase";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getInitials } from "@/lib/utils";

async function getFriends(userId: number, requestedCols: string | null = null) {
  // 1) grab all accepted friendships where this user is either requester or addressee
  const { data: friendships, error: fErr } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id")
    .eq("status", "accepted")
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);
  if (fErr) throw fErr;

  // 2) extract the “other” user IDs
  // Note: This need further discussion
  const friendIds = friendships!.map((f) =>
    f.requester_id === userId ? f.addressee_id : f.requester_id
  );

  if (friendIds.length === 0) return [];

  // 3) fetch those users
  const { data: users, error } = await supabase
    .from("users")
    .select(requestedCols || "*")
    .in("id", friendIds);
  if (error) throw error;

  return users as unknown as User[];
}

export default function FriendList({
  account,
  toggleFriendMenu,
}: {
  account: Account;
  toggleFriendMenu: () => void;
}) {
  const {
    data: friends,
    loading,
    error,
    reset,
  } = useFetch(() => getFriends(account.last_active_user_id));
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Friend List Component</Text>

        <Text className="text-lg">Loading friends...</Text>
      </View>
    );
  }

  if (!friends || friends.length === 0) {
    return null;
  }

  return (
    <View className="flex-1 flex-col w-full p-8 pb-16">
      <TouchableOpacity
        className="px-4 py-2 bg-gray-300 rounded-lg mb-4 self-end flex-row items-center justify-between gap-2"
        onPress={toggleFriendMenu}
      >
        <Text className="text-gray-700">Close</Text>
        <AntDesign name="right" size={16} color="black" />
      </TouchableOpacity>

      <Text className="text-xl font-bold mb-4">List of Friends</Text>

      {error && (
        <Text className="text-red-500 px-5 my-3">Error: {error.message}</Text>
      )}

      <FlatList
        data={friends}
        keyExtractor={(item: User) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 w-full min-w-[200px] flex-row items-center pb-2">
            <View className="flex-1 flex-row items-center gap-2">
              {item.profile_picture ? (
                <Image
                  source={{ uri: item.profile_picture }}
                  className="w-14 h-14 rounded-full"
                />
              ) : (
                <View className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
                  <Text className="text-center text-gray-500 text-2xl font-bold">
                    {getInitials(item.name)}
                  </Text>
                </View>
              )}
              <View className="flex-col flex-1 gap-1 h-14">
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text className="text-gray-600 max-w-[200px]" numberOfLines={1}>
                  {`HOLDER FOR LATEST MESSAGE`.slice(0, 40)}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="px-4 py-2 bg-blue-500 rounded-lg ml-2"
              onPress={() => {
                // Handle friend interaction, e.g., view profile or send message
                console.log(`Interacting with ${item.name}`);
              }}
            >
              <Text className="text-white">Message</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
