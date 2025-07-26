import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Date;
  isFromMe: boolean;
}

const ChatScreen: React.FC = () => {
  const { friendId, friendName } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hey! How are you doing?',
        senderId: friendId as string,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isFromMe: false,
      },
      {
        id: '2',
        text: 'Hi! I\'m doing great, thanks for asking!',
        senderId: 'me',
        timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
        isFromMe: true,
      },
      {
        id: '3',
        text: 'That\'s awesome! Want to play some soccer later?',
        senderId: friendId as string,
        timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
        isFromMe: false,
      },
    ];
    setMessages(mockMessages);
  }, [friendId]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        senderId: 'me',
        timestamp: new Date(),
        isFromMe: true,
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      className={`mb-3 mx-4 ${
        item.isFromMe ? 'items-end' : 'items-start'
      }`}
    >
      <View
        className={`max-w-[80%] p-3 rounded-lg ${
          item.isFromMe 
            ? 'bg-blue-600' 
            : 'bg-white shadow-sm'
        }`}
      >
        <Text
          className={`text-base ${
            item.isFromMe ? 'text-white' : 'text-gray-800'
          }`}
        >
          {item.text}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            item.isFromMe ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          {item.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white shadow-sm">
        <TouchableOpacity 
          onPress={handleBackPress}
          className="p-2"
        >
          <Text className="text-blue-600 text-lg font-medium">← Back</Text>
        </TouchableOpacity>
        <View className="flex-1 items-center mr-12">
          <Text className="text-xl font-bold text-gray-800">
            {friendName}
          </Text>
          <Text className="text-sm text-green-600">Online</Text>
        </View>
      </View>

      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          inverted={false}
        />

        {/* Input Area */}
        <View className="flex-row items-center p-4 bg-white border-t border-gray-200">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 mr-3"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            className="bg-blue-600 w-12 h-12 rounded-full items-center justify-center shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text className="text-white font-bold text-lg">→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
