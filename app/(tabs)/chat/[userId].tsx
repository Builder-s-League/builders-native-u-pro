// app/(tabs)/chat/[friendId].tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useChat } from "@/hooks/useChat";
import { useActiveUser } from "@/contexts/ActiveUserContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

import Avatar from "@/components/Avatar";
import { useUser } from "@/hooks/useUser";
import { StatusDot } from "@/components/StatusDot";

export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const friendId = Number(userId);
  const { activeUser } = useActiveUser();
  const { messages, sendMessage } = useChat(friendId);
  const { user: friend, loading: friendLoading } = useUser(friendId);
  const [draft, setDraft] = useState("");
  const listRef = useRef<FlatList<any>>(null);
  const router = useRouter();

  // Auto‑scroll as new messages arrive
  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (!activeUser) return null;

  const keyboardBehavior = Platform.OS === "ios" ? "padding" : "height";
  const keyboardOffset = Platform.select({ ios: 0, default: 0 });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 pb-3 bg-gray-50">
        <TouchableOpacity
          className="px-3 py-1 rounded-lg"
          onPress={() => router.push({ pathname: `/(tabs)` })}
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>

        {friendLoading ? (
          <ActivityIndicator style={{ marginLeft: 12 }} />
        ) : friend ? (
          <View className="flex-row items-center">
            <View className="relative mr-3">
              <Avatar user={friend} size="sm" />
              <View className="absolute bottom-0 right-0">
                <StatusDot userId={friend.id} sizeClass="w-3 h-3" />
              </View>
            </View>
            <Text className="text-xl font-semibold">{friend.name}</Text>
          </View>
        ) : (
          <Text className="ml-3 text-gray-500">Unknown User</Text>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "white" }}
        behavior={keyboardBehavior}
        keyboardVerticalOffset={keyboardOffset}
      >
        {/* Empty state: tap to dismiss */}
        {messages.length === 0 ? (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View className="flex-1 items-center justify-center px-4">
              <Text>No message yet</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : (
          /* Message list: scroll to dismiss */
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id.toString()}
            onScrollBeginDrag={() => Keyboard.dismiss()}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 12,
              paddingBottom: 80, // space for input row
            }}
            renderItem={({ item }) => {
              const mine = item.sender_id === activeUser.id;
              return (
                <View
                  className={`my-1 p-2 rounded-lg max-h-[80%] ${
                    mine ? "self-end bg-blue-100" : "self-start bg-gray-100"
                  }`}
                >
                  <Text>{item.content}</Text>
                  <Text className="text-xs text-gray-500 mt-1 text-right">
                    {new Date(item.inserted_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              );
            }}
          />
        )}

        {/* Input row */}
        <View className="bottom-0 left-0 right-0 flex-row items-center border-t border-gray-200 bg-white px-4 py-2">
          <TextInput
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 h-14"
            placeholder="Type a message…"
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={() => {
              sendMessage(draft);
              setDraft("");
            }}
            returnKeyType="send"
          />
          <TouchableOpacity
            className="ml-2 bg-blue-500 px-4 py-2 rounded-full h-14 justify-center"
            onPress={() => {
              sendMessage(draft);
              setDraft("");
            }}
          >
            <Text className="text-white">Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
