import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import type { WorkStatus } from "@repo/shared";
import { $api } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";

type FormValues = {
  title: string;
  description: string;
  status: WorkStatus;
  endDate: Date | null;
  endTime: Date | null;
};

export default function AddWorkScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{
    editMode: string;
    workId: string;
    title: string;
    description: string;
    status: WorkStatus;
    endDate: string;
  }>();
  
  const isEditMode = params.editMode === "true";
  const workId = params.workId;
  
  const createWork = $api.useMutation("post", "/api/add");
  const updateWork = $api.useMutation("patch", "/api/update/{id}");

  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: {
      title: isEditMode ? params.title || "" : "",
      description: isEditMode ? params.description || "" : "",
      status: isEditMode ? params.status || "todo" : "todo",
      endDate: isEditMode && params.endDate ? new Date(params.endDate) : null,
      endTime: null,
    },
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      let endDateTime: string | undefined;
      if (data.endDate && data.endTime) {
        const date = new Date(data.endDate);
        const time = new Date(data.endTime);
        date.setHours(time.getHours(), time.getMinutes());
        endDateTime = date.toISOString();
      }

      if (isEditMode && workId) {
        // Update existing work
        await updateWork.mutateAsync({
          params: { path: { id: workId } },
          body: {
            title: data.title,
            description: data.description,
            status: data.status,
            endDate: endDateTime,
          },
        });
        
        // Invalidate the cache to refresh the list
        queryClient.invalidateQueries({ queryKey: ["get", "/api"] });
        
        reset();
        alert("Work updated successfully!");
                setTimeout(() => {
          router.push('/(tabs)/list-works');
        }, 1000);
      } else {
        // Create new work
        await createWork.mutateAsync({
          body: {
            title: data.title,
            description: data.description,
            status: data.status,
            endDate: endDateTime,
          },
        });

        
        queryClient.invalidateQueries({ queryKey: ["get", "/api"] });
        
        reset();
        alert("Work added successfully!");
        
        setTimeout(() => {
          router.back();
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to ${isEditMode ? "update" : "add"} work`);
    }
  });

  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-6">{isEditMode ? "Edit Work" : "Add Work"}</Text>

      {/* Title */}
      <Controller
        control={control}
        name="title"
        rules={{ required: "Title is required", minLength: { value: 3, message: "Min 3 chars" } }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4">
            <Text className="mb-1 font-medium">Title</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter title"
              className="border border-gray-300 rounded-md p-2"
            />
            {error && <Text className="text-red-500 mt-1">{error.message}</Text>}
          </View>
        )}
      />

      {/* Description */}
      <Controller
        control={control}
        name="description"
        rules={{ required: "Description is required", minLength: { value: 10, message: "Min 10 chars" } }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4">
            <Text className="mb-1 font-medium">Description</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Enter description"
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-md p-2 h-24 text-top"
            />
            {error && <Text className="text-red-500 mt-1">{error.message}</Text>}
          </View>
        )}
      />

      {/* End Date */}
      <Controller
        control={control}
        name="endDate"
        render={({ field: { value, onChange } }) => (
          <View className="mb-4">
            <Text className="mb-1 font-medium">End Date (Optional)</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="border border-gray-300 rounded-md p-2"
            >
              <Text>{value ? value.toDateString() : "Select Date"}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selectedDate) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) onChange(selectedDate);
                }}
              />
            )}
          </View>
        )}
      />

      {/* End Time */}
      <Controller
        control={control}
        name="endTime"
        render={({ field: { value, onChange } }) => (
          <View className="mb-4">
            <Text className="mb-1 font-medium">End Time (Optional)</Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="border border-gray-300 rounded-md p-2"
            >
              <Text>
                {value
                  ? `${value.getHours().toString().padStart(2, "0")}:${value.getMinutes().toString().padStart(2, "0")}`
                  : "Select Time"}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={value || new Date()}
                mode="time"
                is24Hour
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, selectedTime) => {
                  setShowTimePicker(Platform.OS === "ios");
                  if (selectedTime) onChange(selectedTime);
                }}
              />
            )}
          </View>
        )}
      />

      {/* Status */}
      <Controller
        control={control}
        name="status"
        render={({ field: { value, onChange } }) => (
          <View className="mb-6">
            <Text className="mb-1 font-medium">Status</Text>
            <View className="border border-gray-300 rounded-md overflow-hidden">
              <Picker selectedValue={value} onValueChange={onChange}>
                <Picker.Item label="Backlog" value="backlog" />
                <Picker.Item label="Todo" value="todo" />
                <Picker.Item label="In Progress" value="in-progress" />
                <Picker.Item label="Done" value="done" />
                <Picker.Item label="Cancelled" value="cancelled" />
              </Picker>
            </View>
          </View>
        )}
      />

      {/* Submit */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={createWork.isPending || updateWork.isPending}
        className={`bg-black p-3 rounded-md items-center ${createWork.isPending || updateWork.isPending ? "opacity-50" : ""}`}
      >
        <Text className="text-white font-bold">
          {createWork.isPending || updateWork.isPending 
            ? (isEditMode ? "Updating..." : "Adding...") 
            : (isEditMode ? "Update Work" : "Add Work")
          }
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}