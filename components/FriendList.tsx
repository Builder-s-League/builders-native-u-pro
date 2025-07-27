import useFetch from "@/hooks/useFetch";
import { Account, User } from "@/interfaces/interfaces";
import { supabase } from "@/lib/supabase";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getInitials } from "@/lib/utils";
import { COLOR_CLASSES, StatusDot } from "./StatusDot";
import { FontAwesome5 } from "@expo/vector-icons";
import { useFriendStatusContext } from "@/contexts/FriendStatusContext";
import { useMemo, useState } from "react";
import { useActiveUser } from "@/contexts/ActiveUserContext";

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
  const { data: friends, loading } = useFetch(() =>
    getFriends(account.last_active_user_id)
  );

  const { getStatus } = useFriendStatusContext();
  const { activeUser } = useActiveUser();

  // local state for search + filter
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "online" | "recently active" | "offline"
  >("all");

  // derive filtered list
  const filtered = useMemo(() => {
    if (!friends) return;
    return friends.filter((f) => {
      // name match
      if (
        searchText.length > 0 &&
        !f.name.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return false;
      }
      // status match
      if (statusFilter !== "all" && getStatus(f.id) !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [friends, searchText, statusFilter, getStatus]);

  const clearFilters = () => {
    setSearchText("");
    setStatusFilter("all");
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Friend List Component</Text>

        <Text className="text-lg">Loading friends...</Text>
      </View>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <View className="flex-1 flex-col w-full p-8 pb-16">
        <TouchableOpacity
          className="px-4 py-2 bg-gray-300 rounded-lg mb-4 self-end flex-row items-center justify-between gap-1"
          onPress={toggleFriendMenu}
        >
          <Text className="text-gray-700">Close</Text>
          <AntDesign name="right" size={16} color="black" />
        </TouchableOpacity>

        <Text className="text-xl font-bold mb-4">List of Friends</Text>
        <View className="w-full items-center rounded-2xl bg-gray-100 p-8">
          <FontAwesome5 name="user-friends" size={24} color="black" />
          <Text className="mt-3 text-center text-lg">
            There is no friend yet, Let make some friends 👋
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 w-full p-4 pb-8">
      {/* Close button */}
      <View className="flex-row items-center justify-between mb-4">
        {activeUser && (
          <View className="flex-row items-center">
            <View className="mr-2">
              {activeUser.profile_picture ? (
                <Image
                  source={{ uri: activeUser.profile_picture }}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <View className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <Text className="text-xl font-bold text-gray-500">
                    {getInitials(activeUser.name)}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-lg">
              Hi, <Text className="font-bold text-xl">{activeUser.name}! </Text>
              👋
            </Text>
          </View>
        )}
        <TouchableOpacity
          className="px-4 py-2 bg-gray-300 rounded-lg mb-4 flex-row items-center gap-1"
          onPress={toggleFriendMenu}
        >
          <Text className="text-gray-700">Close</Text>
          <AntDesign name="right" size={16} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search & clear */}
      <View className="flex-row items-center mb-3 gap-2">
        <View className="flex-1 flex-row items-center rounded-full h-10 bg-gray-200 px-3">
          <AntDesign name="search1" size={24} color="gray" />
          <TextInput
            className="flex-1 py-2 h-10 ml-1"
            placeholder="Search friends…"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <TouchableOpacity
          onPress={clearFilters}
          className="h-10 justify-center"
        >
          <Text>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Status filter buttons */}
      <View className="flex-row mb-4 gap-1">
        {(["all", "online", "recently active", "offline"] as const).map(
          (status) => {
            let colorClass = COLOR_CLASSES[status];
            return (
              <TouchableOpacity
                key={status}
                onPress={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full border flex-row items-center ${
                  statusFilter === status
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-300"
                }`}
              >
                {status !== "all" && (
                  <View
                    className={`${colorClass} w-3 h-3 rounded-full mr-1`}
                  ></View>
                )}
                <Text
                  className={`text-sm ${
                    statusFilter === status ? "text-white" : "text-gray-700"
                  }`}
                >
                  {status === "all"
                    ? "All"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          }
        )}
      </View>

      {/* No results */}
      {filtered && filtered.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <AntDesign name="frowno" size={36} color="gray" />
          <Text className="mt-2 text-gray-600 text-lg">
            No friends match your filters.
          </Text>
        </View>
      )}

      {/* Friend list */}
      {filtered && filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="flex-row items-center py-2 border-b border-gray-200">
              {/* avatar + status */}
              <View className="relative mr-3">
                {item.profile_picture ? (
                  <Image
                    source={{ uri: item.profile_picture }}
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <View className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
                    <Text className="text-2xl font-bold text-gray-500">
                      {getInitials(item.name)}
                    </Text>
                  </View>
                )}
                <View className="absolute bottom-0 right-0">
                  <StatusDot userId={item.id} sizeClass="w-3 h-3" />
                </View>
              </View>

              {/* name & latest msg */}
              <View className="flex-1">
                <Text className="text-lg font-semibold">{item.name}</Text>
                <Text className="text-gray-600" numberOfLines={1}>
                  {`(latest message)…`}
                </Text>
              </View>

              {/* message button */}
              <TouchableOpacity className="px-3 py-1 bg-blue-500 rounded-lg ml-2">
                <Text className="text-white">Message</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
