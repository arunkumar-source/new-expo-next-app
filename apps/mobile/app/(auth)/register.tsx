import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import { router, Stack } from "expo-router";
import { Link } from "expo-router";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });
     if ('error' in result && result.error) {
        alert("Failed to create account: " + (result.error.message ?? String(result.error)));
        return;
      }
      alert("Account created successfully!");
      router.push("/(auth)/login");
      
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Registration failed");
    }
  };



  return (
    <View className="flex-1 bg-white justify-center px-6">
      <Stack.Screen options={{ title: "Register" }} />
      <Text className="text-3xl font-bold mb-6 text-center">
        Create Account
      </Text>

      {/* Name */}
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field }) => (
          <>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-2"
              placeholder="Full Name"
              value={field.value}
              onChangeText={field.onChange}
            />
            {errors.name && (
              <Text className="text-red-500 mb-2">
                {errors.name.message}
              </Text>
            )}
          </>
        )}
      />

      {/* Email */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email",
          },
        }}
        render={({ field }) => (
          <>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 mb-2"
              placeholder="Email"
              keyboardType="email-address"
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
        rules={{
          required: "Password required",
          minLength: { value: 6, message: "Min 6 characters" },
        }}
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
          {isSubmitting ? "Creating..." : "Register"}
        </Text>
      </Pressable>
      <Link href="/(auth)/login" asChild>
  <Pressable className="mt-6 items-center">
    <Text className="text-blue-500 font-medium">
      Already have an account? Login
    </Text>
  </Pressable>
</Link>
    </View>
  );
}