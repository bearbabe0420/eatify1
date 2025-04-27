"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated } from "react-native"
import { Calendar, ChevronDown, ChevronUp } from "lucide-react-native"

import { useMeal, type MealType } from "../context/meal-context"
import { useTheme } from "../context/theme-context"

// Food icons for each meal type
const mealIcons = {
  breakfast: require("../assets/breakfast.png"),
  lunch: require("../assets/lunch.png"),
  dinner: require("../assets/dinner.png"),
}

export default function HistoryScreen() {
  const { history, menus, categories } = useMeal()
  const { colors, isDark } = useTheme()
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({})
  const [animatedHeight] = useState<Record<string, Animated.Value>>({})

  // Group history by date
  const groupedHistory = history.reduce<Record<string, typeof history>>((acc, item) => {
    const date = new Date(item.date).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(item)
    return acc
  }, {})

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedHistory).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  // Initialize animation values for each date
  useEffect(() => {
    sortedDates.forEach((date) => {
      if (!animatedHeight[date]) {
        animatedHeight[date] = new Animated.Value(0)
      }
    })
  }, [sortedDates])

  const getMenuName = (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId)
    return menu ? menu.name : "Unknown Menu"
  }

  const getCategoryName = (menuId: string) => {
    const menu = menus.find((m) => m.id === menuId)
    if (!menu) return "Unknown Category"

    const category = categories.find((c) => c.id === menu.category)
    return category ? category.name : "Unknown Category"
  }

  const getMealTypeLabel = (mealType: MealType) => {
    switch (mealType) {
      case "breakfast":
        return "Breakfast"
      case "lunch":
        return "Lunch"
      case "dinner":
        return "Dinner"
      default:
        return "Unknown"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      // Format as "Monday, June 10" or similar
      return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    }
  }

  const toggleDateExpansion = (date: string) => {
    const isExpanded = !expandedDates[date]

    // Calculate the height based on number of items
    const itemHeight = 100 // Approximate height of each meal item
    const itemCount = groupedHistory[date].length
    const contentHeight = itemCount * itemHeight

    // Animate the height
    Animated.timing(animatedHeight[date] || new Animated.Value(0), {
      toValue: isExpanded ? contentHeight : 0,
      duration: 300,
      useNativeDriver: false,
    }).start()

    setExpandedDates((prev) => ({
      ...prev,
      [date]: isExpanded,
    }))
  }

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
    dateContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    dateTextContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    calendarIcon: {
      marginRight: 12,
    },
    dateText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
    dateSubtext: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    mealItemsContainer: {
      overflow: "hidden",
    },
    mealItem: {
      flexDirection: "row",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    mealIconContainer: {
      marginRight: 16,
      alignItems: "center",
      justifyContent: "center",
      width: 40,
    },
    mealIcon: {
      width: 32,
      height: 32,
    },
    mealTimeText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: "center",
    },
    mealContent: {
      flex: 1,
    },
    mealTypeText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.primary,
      marginBottom: 4,
    },
    mealNameText: {
      fontSize: 18,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 4,
    },
    categoryText: {
      fontSize: 14,
      color: colors.textSecondary,
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
  })

  if (sortedDates.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Calendar size={64} color={colors.textSecondary} />
          <Text style={styles.emptyStateText}>
            No meal history yet. Start recording your meals from the suggestions screen.
          </Text>
        </View>
      </View>
    )
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Your Meal History</Text>
        <Text style={styles.subHeaderText}>Review all your past meals and eating patterns</Text>
      </View>

      <FlatList
        data={sortedDates}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => {
          // Get the first date from the group to format
          const firstMealDate = groupedHistory[date][0].date

          return (
            <View style={styles.dateContainer}>
              <TouchableOpacity style={styles.dateHeader} onPress={() => toggleDateExpansion(date)}>
                <View style={styles.dateTextContainer}>
                  <Calendar size={20} color={colors.primary} style={styles.calendarIcon} />
                  <View>
                    <Text style={styles.dateText}>{formatDate(firstMealDate)}</Text>
                    <Text style={styles.dateSubtext}>{groupedHistory[date].length} meals recorded</Text>
                  </View>
                </View>
                {expandedDates[date] ? (
                  <ChevronUp size={24} color={colors.text} />
                ) : (
                  <ChevronDown size={24} color={colors.text} />
                )}
              </TouchableOpacity>

              <Animated.View style={[styles.mealItemsContainer, { height: animatedHeight[date] || 0 }]}>
                {groupedHistory[date].map((item) => (
                  <View key={item.id} style={styles.mealItem}>
                    <View style={styles.mealIconContainer}>
                      <Image source={mealIcons[item.mealType]} style={styles.mealIcon} resizeMode="contain" />
                      <Text style={styles.mealTimeText}>{formatTime(item.date)}</Text>
                    </View>
                    <View style={styles.mealContent}>
                      <Text style={styles.mealTypeText}>{getMealTypeLabel(item.mealType)}</Text>
                      <Text style={styles.mealNameText}>{getMenuName(item.menuId)}</Text>
                      <Text style={styles.categoryText}>{getCategoryName(item.menuId)}</Text>
                    </View>
                  </View>
                ))}
              </Animated.View>
            </View>
          )
        }}
      />
    </View>
  )
}
