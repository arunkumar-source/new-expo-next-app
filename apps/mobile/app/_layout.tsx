import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a query client instance
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" backgroundColor="#000000" />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}