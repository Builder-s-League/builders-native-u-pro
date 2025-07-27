import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { useRegister } from "../../contexts/RegisterContext";

export default function SelectUserType() {
  const router = useRouter();
  const { setUserType } = useRegister();
  const [selectedType, setSelectedType] = useState("Guardian");

  const handleNext = () => {
    setUserType(selectedType);
    router.push("/register/player-info");
  };

  const options: { label: string; value: string }[] = [
    { label: "Guardian", value: "Guardian" },
    { label: "Under 13", value: "Under-13" },
    { label: "Over 13", value: "Over-13" },
  ];

  const handleBackToLogin = () => {
    router.push("/");
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View className="mb-6">
        <TouchableOpacity
          onPress={handleBackToLogin}
          className="flex-row items-center self-start"
        >
          <Text className="text-lg text-blue-600 mr-2">←</Text>
          <Text className="text-blue-600 font-medium">Back to Login</Text>
        </TouchableOpacity>
      </View>

      {/* Title and Step Indicator */}
      <View className="mb-8">
        {/* Step Numbers */}
        <View className="flex-row justify-center items-center space-x-8">
          <Text className="text-2xl font-bold text-black mr-8">1</Text>
          <Text className="text-2xl text-gray-400  mr-8">2</Text>
          <Text className="text-2xl text-gray-400">3</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800 text-center mt-4">
          Account type
        </Text>
      </View>

      <View className="space-y-3">
        {options.map((option) => (
          <Pressable
            key={option.value}
            onPress={() => setSelectedType(option.value)}
            className={`p-4 mt-2 rounded-xl 
    ${selectedType === option.value ? "bg-yellow-400" : "bg-gray-200 "}`}
          >
            <Text
              className={`text-center text-base font-medium ${
                selectedType === option.value
                  ? "text-black" // 黄底黑字更清晰
                  : "text-black dark:text-white"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-4 items-center">
        {/* <Button title="Next" onPress={handleNext} disabled={!selectedType} /> */}
        <Pressable
          onPress={handleNext}
          disabled={!selectedType}
          style={{
            backgroundColor: selectedType ? "#93c5fd" : "#dbeafe",
            borderRadius: 20,
            paddingVertical: 16,
            width: "50%",
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "600",
              fontSize: 18,
              opacity: selectedType ? 1 : 0.5,
            }}
          >
            Next
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
