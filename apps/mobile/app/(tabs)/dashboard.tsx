import React from "react";
import { View, Text, ScrollView } from "react-native";
import { $api } from "@/lib/api-client";

export default function DashboardScreen() {
  const { data: works = [], isLoading, error } = $api.useQuery("get", "/api");

  const getStatusData = () => {
    const total = works.length;
    if (total === 0) {
      return {
        todo: { count: 0, percentage: 0 },
        "in-progress": { count: 0, percentage: 0 },
        done: { count: 0, percentage: 0 },
        backlog: { count: 0, percentage: 0 },
        cancelled: { count: 0, percentage: 0 },
      };
    }

    const todoCount = works.filter((w) => w.status === "todo").length;
    const inProgressCount = works.filter((w) => w.status === "in-progress").length;
    const doneCount = works.filter((w) => w.status === "done").length;
    const backlogCount = works.filter((w) => w.status === "backlog").length;
    const cancelledCount = works.filter((w) => w.status === "cancelled").length;

    return {
      todo: { count: todoCount, percentage: (todoCount / total) * 100 },
      "in-progress": { count: inProgressCount, percentage: (inProgressCount / total) * 100 },
      done: { count: doneCount, percentage: (doneCount / total) * 100 },
      backlog: { count: backlogCount, percentage: (backlogCount / total) * 100 },
      cancelled: { count: cancelledCount, percentage: (cancelledCount / total) * 100 },
    };
  };

  const statusData = getStatusData();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-yellow-500";
      case "in-progress":
        return "bg-blue-500";
      case "done":
        return "bg-green-500";
      case "backlog":
        return "bg-gray-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-black";
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case "todo":
        return "border-yellow-500";
      case "in-progress":
        return "border-blue-500";
      case "done":
        return "border-green-500";
      case "backlog":
        return "border-gray-500";
      case "cancelled":
        return "border-red-500";
      default:
        return "border-black";
    }
  };

  const getStatusTitle = (status: string) => {
    switch (status) {
      case "todo":
        return "Todo";
      case "in-progress":
        return "In Progress";
      case "done":
        return "Done";
      case "backlog":
        return "Backlog";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-100 justify-center">
        <Text className="text-center text-gray-500 text-base">
          Loading dashboard...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-100 justify-center">
        <Text className="text-center text-red-500 text-base">
          Error loading data
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ padding: 16 }}
    >
      <Text className="text-3xl font-bold text-gray-800 mb-2">
        Dashboard
      </Text>
      <Text className="text-gray-500 text-base mb-6">
        Work Status Overview
      </Text>

      {/* Total Tasks */}
      <View className="bg-white rounded-xl p-5 mb-6 items-center shadow-md">
        <Text className="text-gray-500 text-base mb-2">
          Total Tasks
        </Text>
        <Text className="text-4xl font-bold text-gray-800">
          {works.length}
        </Text>
      </View>

      {/* Status Cards */}
      <View className="space-y-3 mb-6">
        {Object.entries(statusData).map(([status, data]) => (
          <View
            key={status}
            className={`bg-white rounded-xl p-4 border-l-4 shadow-md ${getBorderColor(
              status
            )}`}
          >
            <Text className="text-sm font-semibold text-gray-800 mb-1">
              {getStatusTitle(status)}
            </Text>

            <Text className="text-2xl font-bold text-gray-800">
              {data.count}
            </Text>

            <Text className="text-xs text-gray-500 mb-2">
              {data.percentage.toFixed(1)}%
            </Text>

            {/* Progress Bar */}
            <View className="h-1.5 bg-gray-200 rounded overflow-hidden">
              <View
                className={`h-full rounded ${getStatusColor(status)}`}
                style={{ width: `${data.percentage}%` }}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Recent Tasks */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          Recent Tasks
        </Text>

        {works.slice(0, 5).map((work) => (
          <View
            key={work.id}
            className="bg-white rounded-xl p-4 mb-3 shadow-md"
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-base font-semibold text-gray-800 flex-1 mr-3">
                {work.title}
              </Text>

              <View
                className={`px-2 py-1 rounded-full ${getStatusColor(
                  work.status
                )}`}
              >
                <Text className="text-[10px] font-medium text-white">
                  {getStatusTitle(work.status)}
                </Text>
              </View>
            </View>

            <Text
              className="text-sm text-gray-500 mb-2 leading-5"
              numberOfLines={2}
            >
              {work.description}
            </Text>

            <Text className="text-xs text-gray-400">
              {work.endDate
                ? `Due: ${new Date(work.endDate).toLocaleDateString()}`
                : work.createdAt
                ? `Created: ${new Date(work.createdAt).toLocaleDateString()}`
                : "No date"}
            </Text>
          </View>
        ))}

        {works.length === 0 && (
          <Text className="text-center text-base text-gray-500 italic">
            No tasks found
          </Text>
        )}
      </View>
    </ScrollView>
  );
}