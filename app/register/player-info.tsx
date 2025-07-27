import LabeledInput from "@/components/LabeledInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useRegister } from "../../contexts/RegisterContext";

const initialPlayer = {
  name: "",
  birthDate: "",
  gender: "",
  ageGroup: "",
  experience: "",
  level: "",
  club: "",
  dominantFoot: "",
};

export default function PlayerInfo() {
  const [player, setPlayer] = useState(initialPlayer);
  const { addPlayer } = useRegister();
  const router = useRouter();

  const handleAdd = () => {
    if (!player.name) return;
    addPlayer(player);
    setPlayer(initialPlayer);
  };

  const handleNext = () => {
    if (player.name) addPlayer(player);
    router.push("/register/account");
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      {/* Title and Step Indicator */}
      <View className="h-12" />
      <View className="mb-8">
        {/* Step Numbers */}
        <View className="flex-row justify-center items-center space-x-8">
          <Text className="text-2xl text-gray-400  mr-8">1</Text>
          <Text className="text-2xl font-bold text-black mr-8">2</Text>
          <Text className="text-2xl text-gray-400">3</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800 text-center mt-4">
          Player information
        </Text>
      </View>

      <LabeledInput
        label="Name"
        placeholder="Enter name"
        value={player.name}
        onChange={(text) => setPlayer((p) => ({ ...p, name: text }))}
      />
      <LabeledInput
        label="Date of Birth"
        type="date"
        value={player.birthDate}
        placeholder="YYYY-MM-DD"
        onChange={(val) => setPlayer((p) => ({ ...p, birthDate: val }))}
      />

      <LabeledInput
        label="Gender"
        type="select"
        value={player.gender}
        options={["Male", "Female", "Not to say"]}
        placeholder="Select gender"
        onChange={(val) => setPlayer((p) => ({ ...p, gender: val }))}
      />

      <LabeledInput
        label="Experience"
        placeholder="Experience description"
        value={player.experience}
        onChange={(text) => setPlayer((p) => ({ ...p, experience: text }))}
      />

      <TextInput
        placeholder="Name"
        onChangeText={(text) => setPlayer((p) => ({ ...p, name: text }))}
      />
      <TextInput
        placeholder="Birth Date"
        onChangeText={(text) => setPlayer((p) => ({ ...p, birthDate: text }))}
      />
      <TextInput
        placeholder="Gender"
        onChangeText={(text) => setPlayer((p) => ({ ...p, gender: text }))}
      />
      <TextInput
        placeholder="Age Group"
        onChangeText={(text) => setPlayer((p) => ({ ...p, ageGroup: text }))}
      />
      <TextInput
        placeholder="Experience"
        onChangeText={(text) => setPlayer((p) => ({ ...p, experience: text }))}
      />
      <TextInput
        placeholder="Level"
        onChangeText={(text) => setPlayer((p) => ({ ...p, level: text }))}
      />
      <TextInput
        placeholder="Club"
        onChangeText={(text) => setPlayer((p) => ({ ...p, club: text }))}
      />
      <TextInput
        placeholder="Dominant Foot"
        onChangeText={(text) =>
          setPlayer((p) => ({ ...p, dominantFoot: text }))
        }
      />

      {/* <Button title="Add Another Player" onPress={handleAdd} />
      <Button title="Next" onPress={handleNext} /> */}
      <View className="mt-4 space-y-4 items-center">
        <Pressable
          onPress={handleAdd}
          className="py-4 rounded-xl bg-blue-300 w-1/2 mb-4"
        >
          <Text className="text-center text-white font-semibold text-lg">
            Add Another Player
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          className="py-4 rounded-xl bg-blue-300 w-1/2"
        >
          <Text className={`text-center text-white font-semibold text-lg `}>
            Next
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
