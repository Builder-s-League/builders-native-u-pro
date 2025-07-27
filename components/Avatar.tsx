import { User } from "@/interfaces/interfaces";
import { getInitials } from "@/lib/utils";
import { Image, Text, View } from "react-native";

export default function Avatar({
  user,
  size,
  containerClass,
}: {
  user: User;
  size: "sm" | "md" | "lg";
  containerClass?: string;
}) {
  const sizeMap = {
    sm: { container: "w-10 h-10", text: "text-xl" },
    md: { container: "w-14 h-14", text: "text-2xl" },
    lg: { container: "w-20 h-20", text: "text-3xl" },
  } as const;

  const { container, text } = sizeMap[size];

  return (
    <View className={`${container} ${containerClass}`}>
      {user.profile_picture ? (
        <Image
          source={{ uri: user.profile_picture }}
          className={`${container} rounded-full`}
        />
      ) : (
        <View
          className={`${container} bg-gray-300 rounded-full flex items-center justify-center`}
        >
          <Text className={`font-bold text-gray-500 ${text}`}>
            {getInitials(user.name)}
          </Text>
        </View>
      )}
    </View>
  );
}
