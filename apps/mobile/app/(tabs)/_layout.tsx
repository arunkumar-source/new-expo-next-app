import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ProtectedLayout from "@/components/ProtectedLayout";
import LogoutButton from "@/components/LogoutButton";


export default function TabsLayout() {
  return (
    <ProtectedLayout>
      <Tabs
        screenOptions={{
          headerShown: true,
          headerRight: () => <LogoutButton />,
        }}
      >
        <Tabs.Screen
          name="add-work"
          options={{
            title: "Add Work",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="add-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="list-works"
          options={{
            title: "List Works",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ProtectedLayout>
  );
}