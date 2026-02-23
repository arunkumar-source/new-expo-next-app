import React from "react";
import { View, Text, Pressable } from "react-native";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Pressable
      onPress={handleLogout}
      className="bg-black px-4 py-2 rounded-lg"
    >
      <Text className="text-white font-medium">Logout</Text>
    </Pressable>
  );
}
