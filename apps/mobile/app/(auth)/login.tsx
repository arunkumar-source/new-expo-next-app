import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { Stack } from "expo-router";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import * as SecureStore from 'expo-secure-store';


type LoginForm = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const route = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
       const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      // Check if authentication actually succeeded
      if (result.error) {
        console.error('Login error:', result.error);
        alert(result.error.message || "Login failed");
        return;
      }
    
      // Manually store session token to SecureStore for API calls
      if (result.data?.token) {
        try {
          await SecureStore.setItemAsync('better-auth.session_token', result.data.token);
   
          // Verify it was stored
          const verify = await SecureStore.getItemAsync('better-auth.session_token');
        } catch (e) {
          console.error('Failed to store session token:', e);
        }
      } else {
        console.warn('No token in login result to store');
      }
      // Only proceed if authentication was successful
      route.push("/(tabs)/list-works");
      alert("Logged in!");
    } catch (err) {
      console.error('Login exception:', err);
      alert(err || "Login failed");
    }
  };


  return (
    <View className="flex-1 bg-white justify-center px-6">
        <Stack.Screen options={{ title: "Login" }} />
      <Text className="text-3xl font-bold mb-6 text-center">
        Welcome Back
      </Text>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{ required: "Email is required" }}
        render={({ field }) => (
          <>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-2"
              placeholder="Email"
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
            />
            {errors.email && (
              <Text className="text-red-500 mb-2">
                {errors.email.message}
              </Text>
            )}
          </>
        )}
      />

      {/* Password */}
      <Controller
        control={control}
        name="password"
        rules={{ required: "Password required" }}
        render={({ field }) => (
          <>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-2"
              placeholder="Password"
              secureTextEntry
              value={field.value}
              onChangeText={field.onChange}
            />
            {errors.password && (
              <Text className="text-red-500 mb-2">
                {errors.password.message}
              </Text>
            )}
          </>
        )}
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        className="bg-black p-4 rounded-xl mt-4 items-center"
      >
        <Text className="text-white font-semibold">
          {isSubmitting ? "Logging in..." : "Login"}
        </Text>
      </Pressable>
      <Link href="/(auth)/register" asChild>
  <Pressable className="mt-6 items-center">
    <Text className="text-blue-500 font-medium">
      Don't have an account? Register
    </Text>
  </Pressable>
</Link>
    </View>
  );
}