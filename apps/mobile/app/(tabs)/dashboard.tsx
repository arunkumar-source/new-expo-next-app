import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { $api } from "@/lib/api-client";
import type { Work } from "@repo/shared";

export default function DashboardScreen() {
  const { data: works = [], isLoading, error } = $api.useQuery("get", "/api");

  // Calculate status counts and percentages
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
        return "#EAB308"; // Yellow
      case "in-progress":
        return "#3B82F6"; // Blue
      case "done":
        return "#10B981"; // Green
      case "backlog":
        return "#6B7280"; // Gray
      case "cancelled":
        return "#EF4444"; // Red
      default:
        return "#000000"; // Black
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
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Work Status Overview</Text>

      {/* Total Tasks */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Tasks</Text>
        <Text style={styles.totalNumber}>{works.length}</Text>
      </View>

      {/* Status Cards */}
      <View style={styles.statusGrid}>
        {Object.entries(statusData).map(([status, data]) => (
          <View key={status} style={[styles.statusCard, { borderLeftColor: getStatusColor(status) }]}>
            <Text style={styles.statusTitle}>{getStatusTitle(status)}</Text>
            <Text style={styles.statusCount}>{data.count}</Text>
            <Text style={styles.statusPercentage}>{data.percentage.toFixed(1)}%</Text>
            
            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${data.percentage}%`,
                    backgroundColor: getStatusColor(status)
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>

      {/* Recent Tasks */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Tasks</Text>
        {works.slice(0, 5).map((work) => (
          <View key={work.id} style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>{work.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(work.status) }]}>
                <Text style={styles.statusBadgeText}>{getStatusTitle(work.status)}</Text>
              </View>
            </View>
            <Text style={styles.taskDescription} numberOfLines={2}>
              {work.description}
            </Text>
            <Text style={styles.taskDate}>
              {work.endDate
                ? `Due: ${new Date(work.endDate).toLocaleDateString()}`
                : work.createdAt
                ? `Created: ${new Date(work.createdAt).toLocaleDateString()}`
                : "No date"
              }
            </Text>
          </View>
        ))}
        {works.length === 0 && (
          <Text style={styles.noTasksText}>No tasks found</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 24,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "#ef4444",
  },
  totalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 8,
  },
  totalNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statusGrid: {
    flexDirection: "column",
    gap: 12,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  statusCount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  statusPercentage: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  taskItem: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#ffffff",
  },
  taskDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 20,
  },
  taskDate: {
    fontSize: 12,
    color: "#9ca3af",
  },
  noTasksText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    fontStyle: "italic",
  },
});
