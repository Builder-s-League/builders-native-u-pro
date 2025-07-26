import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import { useRegister } from "../../contexts/RegisterContext";

export default function SelectUserType() {
  const router = useRouter();
  const { setUserType } = useRegister();

  const onSelect = (type: string) => {
    setUserType(type);
    router.push("/register/player-info");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Select User Type:</Text>
      <Button title="Guardian" onPress={() => onSelect("parent")} />
      <Button title="Under 13" onPress={() => onSelect("coach")} />
      <Button title="Over 13" onPress={() => onSelect("coach")} />
    </View>
  );
}
