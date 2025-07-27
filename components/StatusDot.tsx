// src/components/StatusDot.tsx
import React from "react";
import { View } from "react-native";
import { useFriendStatusContext } from "@/contexts/FriendStatusContext";

export const COLOR_CLASSES: Record<string, string> = {
  online: "bg-green-500",
  "recently active": "bg-yellow-400",
  offline: "bg-gray-400",
};

interface StatusDotProps {
  userId: number;
  /** Tailwind size key: 'w-2 h-2', 'w-3 h-3', 'w-4 h-4', etc. */
  sizeClass?: string;
}

export function StatusDot({ userId, sizeClass = "w-3 h-3" }: StatusDotProps) {
  const { getStatus } = useFriendStatusContext();
  const status = getStatus(userId);
  const colorClass = COLOR_CLASSES[status] || COLOR_CLASSES.offline;

  return (
    <View
      className={`${colorClass} ${sizeClass} rounded-full border border-white`}
    />
  );
}
