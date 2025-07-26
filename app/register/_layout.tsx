import { Stack } from "expo-router";
import { RegisterProvider } from "../../contexts/RegisterContext";

export default function RegisterLayout() {
  return (
    <RegisterProvider>
      <Stack />
    </RegisterProvider>
  );
}
