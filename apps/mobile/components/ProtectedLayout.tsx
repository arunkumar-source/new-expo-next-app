import { useSession } from "@/lib/auth-client";
import { useRouter, Stack } from "expo-router";
import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function giProtectedLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/(auth)/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {children}
    </>
  );
}
