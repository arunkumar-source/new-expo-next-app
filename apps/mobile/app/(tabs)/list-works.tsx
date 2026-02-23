import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { $api } from "@/lib/api-client";
import type { Work } from "@repo/shared";

export default function WorkListScreen() {
  const router = useRouter();
  

  const worksQuery = $api.useQuery("get", "/api");

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      worksQuery.refetch();
    }, [])
  );

  // Delete work - use the generated type signature
  const deleteWork = $api.useMutation("delete", "/api/delete/{id}");

  const handleDelete = (id: string) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Pass id as path parameter
            await deleteWork.mutateAsync({ params: { path: { id } } });
            worksQuery.refetch();
          } catch (err) {
            console.error("Delete error:", err);
            Alert.alert("Error", "Failed to delete work");
          }
        },
      },
    ]);
  };

  const handleEdit = (work: Work) => {
    // Navigate to add-work screen with work data for editing
    router.push({
      pathname: "/(tabs)/add-work",
      params: { 
        editMode: "true",
        workId: work.id,
        title: work.title,
        description: work.description,
        status: work.status,
        endDate: work.endDate ? new Date(work.endDate).toISOString().split('T')[0] : ""
      }
    });
  };

  if (worksQuery.isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-700">Loading...</Text>
      </View>
    );
  }

  const works = worksQuery.data || [];

  if (works.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-700">No works found.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Work }) => (
    <View className="bg-white p-4 mb-4 rounded-md shadow">
      <Text className="text-lg font-bold mb-1">{item.title}</Text>
      <Text className="text-gray-700 mb-2">{item.description}</Text>
      <Text className="text-sm text-gray-500 mb-2">Status: {item.status}</Text>
      {item.endDate && (
        <Text className="text-sm text-gray-500 mb-2">
          Ends: {new Date(item.endDate).toLocaleString()}
        </Text>
      )}
      <View className="flex-row justify-end space-x-2">
        <TouchableOpacity
          onPress={() => handleEdit(item)}
          className="bg-blue-500 px-3 py-1 rounded-md"
        >
          <Text className="text-white">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          className="bg-red-500 px-3 py-1 rounded-md"
        >
          <Text className="text-white">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      className="bg-gray-100 p-4"
      data={works}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
}