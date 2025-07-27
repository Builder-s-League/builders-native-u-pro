import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface LabeledInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (text: string) => void;
  type?: "text" | "date" | "select";
  options?: string[];
}

export default function LabeledInput({
  label,
  value,
  placeholder,
  onChange,
  type = "text",
  options = [],
}: LabeledInputProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const renderInput = () => {
    switch (type) {
      case "date":
        return (
          <>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="px-4 py-3 bg-gray-200 rounded-md"
            >
              <Text className="text-gray-800">
                {value || placeholder || "Select date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const formatted = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD
                    onChange(formatted);
                  }
                }}
              />
            )}
          </>
        );

      case "select":
        return (
          <View className="rounded-md bg-gray-200">
            <Picker
              mode="dropdown"
              selectedValue={value}
              onValueChange={(itemValue) => onChange(itemValue)}
              style={{ color: "#1f2937" }} // text-gray-800
            >
              <Picker.Item label={placeholder || "Select..."} value="" />
              {options.map((opt) => (
                <Picker.Item key={opt} label={opt} value={opt} />
              ))}
            </Picker>
          </View>
        );

      case "text":
      default:
        return (
          <TextInput
            className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md"
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={value}
            onChangeText={onChange}
          />
        );
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm text-gray-700 mb-1">{label}</Text>
      {renderInput()}
    </View>
  );
}
