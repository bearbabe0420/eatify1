"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { PieChart } from "lucide-react-native"

import { useMeal, type MealType } from "../context/meal-context"
import { useTheme } from "../context/theme-context"

export default function DashboardScreen() {
  const { history, menus, categories, getMostFrequentMenus } = useMeal()
  const { colors, isDark } = useTheme()
  const [activeTab, setActiveTab] = useState<"frequent" | "categories">("frequent")

  const frequentMenus = getMostFrequentMenus().slice(0, 10) // Top 10

  // Calculate category distribution
  const categoryDistribution = categories
    .map((category) => {
      const count = history.filter((item) => {
        const menu = menus.find((m) => m.id === item.menuId)
        return menu && menu.category === category.id
      }).length

      return {
        category,
        count,
      }
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)

  // Calculate meal type distribution
  const mealTypeDistribution: Record<MealType, number> = {
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  }

  history.forEach((item) => {
    mealTypeDistribution[item.mealType]++
  })

  const mealTypeData = [
    { label: "Breakfast", count: mealTypeDistribution.breakfast },
    { label: "Lunch", count: mealTypeDistribution.lunch },
    { label: "Dinner", count: mealTypeDistribution.dinner },
  ].filter((item) => item.count > 0)

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background,
    },
    header: {
      marginBottom: 20,
    },
    headerText: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subHeaderText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    tabContainer: {
      flexDirection: "row",
      marginBottom: 16,
      backgroundColor: colors.muted,
      borderRadius: 12,
      padding: 4,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 8,
    },
    activeTab: {
      backgroundColor: colors.card,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    inactiveTab: {
      backgroundColor: "transparent",
    },
    tabText: {
      fontWeight: "500",
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.text,
      fontWeight: "600",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemName: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    itemCount: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
      marginLeft: 8,
    },
    barContainer: {
      height: 12,
      backgroundColor: colors.muted,
      borderRadius: 6,
      flex: 1,
      marginHorizontal: 12,
      overflow: "hidden",
    },
    bar: {
      height: "100%",
      backgroundColor: colors.primary,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 16,
    },
    mealTypeContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 16,
      marginBottom: 24,
    },
    mealTypeItem: {
      alignItems: "center",
      backgroundColor: colors.accent,
      padding: 16,
      borderRadius: 12,
      minWidth: 100,
    },
    mealTypeCount: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 4,
    },
    mealTypeLabel: {
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
  })

  if (history.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <PieChart size={64} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            No meal data yet. Start recording your meals to see statistics here.
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Meal Stats</Text>
        <Text style={styles.subHeaderText}>Track your eating patterns and favorite meals</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meal Type Distribution</Text>
        <View style={styles.mealTypeContainer}>
          {mealTypeData.map((item) => (
            <View key={item.label} style={styles.mealTypeItem}>
              <Text style={styles.mealTypeCount}>{item.count}</Text>
              <Text style={styles.mealTypeLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "frequent" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("frequent")}
        >
          <Text style={[styles.tabText, activeTab === "frequent" && styles.activeTabText]}>Frequent Meals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "categories" ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab("categories")}
        >
          <Text style={[styles.tabText, activeTab === "categories" && styles.activeTabText]}>Categories</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {activeTab === "frequent" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Most Frequently Eaten</Text>
            {frequentMenus.map(({ menu, count }, index) => {
              const maxCount = frequentMenus[0].count
              const percentage = (count / maxCount) * 100

              return (
                <View key={menu.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>{menu.name}</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.itemCount}>{count}</Text>
                </View>
              )
            })}
          </View>
        )}

        {activeTab === "categories" && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Category Distribution</Text>
            {categoryDistribution.map(({ category, count }, index) => {
              const maxCount = categoryDistribution[0].count
              const percentage = (count / maxCount) * 100

              return (
                <View key={category.id} style={styles.itemRow}>
                  <Text style={styles.itemName}>{category.name}</Text>
                  <View style={styles.barContainer}>
                    <View style={[styles.bar, { width: `${percentage}%` }]} />
                  </View>
                  <Text style={styles.itemCount}>{count}</Text>
                </View>
              )
            })}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
