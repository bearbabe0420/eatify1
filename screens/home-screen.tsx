"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated, Dimensions, ScrollView, Image } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { RefreshCw, Check, PlusCircle, Utensils } from "lucide-react-native"

import { useMeal, type MealType, type FoodMenu } from "../context/meal-context"
import { useTheme } from "../context/theme-context"

const { width } = Dimensions.get("window")

// Food icons for each meal type
const mealIcons = {
  breakfast: require("../assets/breakfast.png"),
  lunch: require("../assets/lunch.png"),
  dinner: require("../assets/dinner.png"),
}

export default function HomeScreen() {
  const navigation = useNavigation()
  const { menus, categories, getSuggestions, recordMeal } = useMeal()
  const { colors, isDark } = useTheme()

  const [mealSuggestions, setMealSuggestions] = useState<Record<MealType, FoodMenu[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
  })
  const [currentIndex, setCurrentIndex] = useState<Record<MealType, number>>({
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  })

  // Animation values
  const slideAnim = useRef({
    breakfast: new Animated.Value(0),
    lunch: new Animated.Value(0),
    dinner: new Animated.Value(0),
  }).current

  // Get current time to determine which meal to focus
  const [focusedMeal, setFocusedMeal] = useState<MealType>("breakfast")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 11) {
      setFocusedMeal("breakfast")
    } else if (hour < 16) {
      setFocusedMeal("lunch")
    } else {
      setFocusedMeal("dinner")
    }
  }, [])

  // Initialize suggestions for all meal types
  useEffect(() => {
    refreshAllSuggestions()
  }, [])

  const refreshAllSuggestions = () => {
    const newSuggestions = {
      breakfast: getSuggestions("breakfast"),
      lunch: getSuggestions("lunch"),
      dinner: getSuggestions("dinner"),
    }

    setMealSuggestions(newSuggestions)
    setCurrentIndex({
      breakfast: 0,
      lunch: 0,
      dinner: 0,
    })

    // Reset animations
    slideAnim.breakfast.setValue(0)
    slideAnim.lunch.setValue(0)
    slideAnim.dinner.setValue(0)
  }

  const handleSkip = (mealType: MealType) => {
    // If we're at the last suggestion, get new suggestions
    if (currentIndex[mealType] >= mealSuggestions[mealType].length - 1) {
      const newSuggestions = [...mealSuggestions[mealType], ...getSuggestions(mealType)]
      setMealSuggestions((prev) => ({
        ...prev,
        [mealType]: newSuggestions,
      }))
    }

    // Animate slide out to left
    Animated.timing(slideAnim[mealType], {
      toValue: -width,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Update index
      setCurrentIndex((prev) => ({
        ...prev,
        [mealType]: prev[mealType] + 1,
      }))

      // Reset animation
      slideAnim[mealType].setValue(width)

      // Animate slide in from right
      Animated.timing(slideAnim[mealType], {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start()
    })
  }

  const handleEatMeal = (mealType: MealType, menuId: string) => {
    Alert.alert("Record Meal", "Do you want to record this as your meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await recordMeal(mealType, menuId)
          Alert.alert("Success", "Meal recorded successfully!")
        },
      },
    ])
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Unknown"
  }

  const getCurrentSuggestion = (mealType: MealType): FoodMenu | undefined => {
    const suggestions = mealSuggestions[mealType]
    const index = Math.floor(Math.random() * suggestions.length)
    return suggestions && suggestions.length > index ? suggestions[index] : undefined
  }

  const renderMealCard = (mealType: MealType, title: string) => {
    const suggestion = getCurrentSuggestion(mealType)
    const isFocused = focusedMeal === mealType

    return (
      <View
        style={[
          styles.mealCard,
          {
            backgroundColor: colors.card,
            borderColor: isFocused ? colors.primary : colors.border,
            borderWidth: isFocused ? 2 : 1,
          },
        ]}
      >
        <View style={styles.mealHeader}>
          <View style={styles.mealTitleContainer}>
            <Image source={mealIcons[mealType]} style={styles.mealIcon} resizeMode="contain" />
            <Text style={[styles.mealTitle, { color: colors.text }]}>{title}</Text>
          </View>
          {isFocused && (
            <View style={[styles.focusedBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.focusedBadgeText}>Now</Text>
            </View>
          )}
        </View>

        <View style={styles.suggestionContainer}>
          {suggestion ? (
            <Animated.View style={[styles.suggestionContent, { transform: [{ translateX: slideAnim[mealType] }] }]}>
              <Text style={[styles.suggestionTitle, { color: colors.text }]}>{suggestion.name}</Text>
              <Text style={[styles.suggestionCategory, { color: colors.textSecondary }]}>
                {getCategoryName(suggestion.category)}
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.emptyState}>
              <Utensils size={32} color={colors.textSecondary} style={{ marginBottom: 8 }} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>No suggestions available</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { backgroundColor: colors.muted }]}
            onPress={() => handleSkip(mealType)}
            disabled={!suggestion}
          >
            <RefreshCw size={16} color={colors.text} />
            <Text style={[styles.buttonText, { color: colors.text }]}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => suggestion && handleEatMeal(mealType, suggestion.id)}
            disabled={!suggestion}
          >
            <Check size={16} color="#ffffff" />
            <Text style={[styles.buttonText, { color: "#ffffff" }]}>Eat This</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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
    mealCard: {
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      overflow: "hidden",
    },
    mealHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    mealTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    mealIcon: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    mealTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    focusedBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    focusedBadgeText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "600",
    },
    suggestionContainer: {
      padding: 16,
      minHeight: 120,
      justifyContent: "center",
    },
    suggestionContent: {
      width: "100%",
    },
    suggestionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8,
    },
    suggestionCategory: {
      fontSize: 16,
      marginBottom: 12,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    button: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginLeft: 12,
    },
    primaryButton: {
      minWidth: 100,
      justifyContent: "center",
    },
    secondaryButton: {
      minWidth: 80,
      justifyContent: "center",
    },
    buttonText: {
      marginLeft: 8,
      fontWeight: "600",
      fontSize: 14,
    },
    addButton: {
      position: "absolute",
      right: 16,
      bottom: 16,
      backgroundColor: colors.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
    },
    emptyStateText: {
      fontSize: 16,
      textAlign: "center",
    },
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>What's on the menu today?</Text>
        <Text style={styles.subHeaderText}>
          Here are your meal suggestions for today. Tap "Skip" to see more options.
        </Text>
      </View>

      {renderMealCard("breakfast", "Breakfast")}
      {renderMealCard("lunch", "Lunch")}
      {renderMealCard("dinner", "Dinner")}

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate("AddMenu" as never)}
      >
        <PlusCircle size={24} color="#ffffff" />
      </TouchableOpacity>
    </ScrollView>
  )
}
