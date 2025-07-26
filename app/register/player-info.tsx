import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, ScrollView, TextInput } from "react-native";
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

      <Button title="Add Another Player" onPress={handleAdd} />
      <Button title="Next" onPress={handleNext} />
    </ScrollView>
  );
}
