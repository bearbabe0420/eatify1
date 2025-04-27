"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Switch, ScrollView, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ChevronDown, Plus } from "lucide-react-native"

import { useMeal, type MealType } from "../context/meal-context"
import { useTheme } from "../context/theme-context"

export default function AddMenuScreen() {
  const navigation = useNavigation()
  const { categories, addMenu } = useMeal()
  const { isDark } = useTheme()

  const [name, setName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [mealTypes, setMealTypes] = useState<Record<MealType, boolean>>({
    breakfast: false,
    lunch: false,
    dinner: false,
  })

  const handleAddMenu = async () => {
    // Validate inputs
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a menu name")
      return
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category")
      return
    }

    const selectedMealTypes = Object.entries(mealTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type]) => type as MealType)

    if (selectedMealTypes.length === 0) {
      Alert.alert("Error", "Please select at least one meal type")
      return
    }

    try {
      await addMenu({
        name: name.trim(),
        category: selectedCategory,
        mealTypes: selectedMealTypes,
      })

      Alert.alert("Success", "Menu added successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      Alert.alert("Error", "Failed to add menu")
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : ""
  }

  const toggleMealType = (type: MealType) => {
    setMealTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 8,
      color: isDark ? "#ffffff" : "#333333",
    },
    input: {
      backgroundColor: isDark ? "#333333" : "#ffffff",
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: isDark ? "#ffffff" : "#333333",
    },
    categorySelector: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 8,
      backgroundColor: isDark ? "#333333" : "#ffffff",
    },
    categoryText: {
      fontSize: 16,
      color: isDark ? "#ffffff" : "#333333",
    },
    placeholderText: {
      color: isDark ? "#888888" : "#999999",
    },
    dropdownContainer: {
      backgroundColor: isDark ? "#333333" : "#ffffff",
      borderRadius: 8,
      marginTop: 4,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      maxHeight: 200,
    },
    dropdownItem: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#444444" : "#f0f0f0",
    },
    dropdownItemText: {
      fontSize: 16,
      color: isDark ? "#ffffff" : "#333333",
    },
    mealTypesContainer: {
      marginTop: 8,
    },
    mealTypeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? "#444444" : "#f0f0f0",
    },
    mealTypeText: {
      fontSize: 16,
      color: isDark ? "#ffffff" : "#333333",
    },
    addButton: {
      backgroundColor: "#6366f1",
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginTop: 20,
    },
    addButtonText: {
      color: "#ffffff",
      fontWeight: "600",
      fontSize: 16,
    },
    addCategoryButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderRadius: 8,
      backgroundColor: isDark ? "#444444" : "#e5e5e5",
      marginTop: 8,
    },
    addCategoryText: {
      marginLeft: 8,
      fontSize: 16,
      color: isDark ? "#ffffff" : "#333333",
    },
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Menu Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter menu name"
          placeholderTextColor={isDark ? "#888888" : "#999999"}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity
          style={styles.categorySelector}
          onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
        >
          <Text style={[styles.categoryText, !selectedCategory && styles.placeholderText]}>
            {selectedCategory ? getCategoryName(selectedCategory) : "Select a category"}
          </Text>
          <ChevronDown size={20} color={isDark ? "#ffffff" : "#333333"} />
        </TouchableOpacity>

        {showCategoryDropdown && (
          <ScrollView style={styles.dropdownContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedCategory(category.id)
                  setShowCategoryDropdown(false)
                }}
              >
                <Text style={styles.dropdownItemText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.addCategoryButton} onPress={() => navigation.navigate("AddCategory" as never)}>
          <Plus size={20} color={isDark ? "#ffffff" : "#333333"} />
          <Text style={styles.addCategoryText}>Add New Category</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Meal Types</Text>
        <View style={[styles.mealTypesContainer, { backgroundColor: isDark ? "#333333" : "#ffffff", borderRadius: 8 }]}>
          <View style={styles.mealTypeRow}>
            <Text style={styles.mealTypeText}>Breakfast</Text>
            <Switch
              value={mealTypes.breakfast}
              onValueChange={() => toggleMealType("breakfast")}
              trackColor={{ false: isDark ? "#555555" : "#dddddd", true: "#818cf8" }}
              thumbColor={mealTypes.breakfast ? "#6366f1" : isDark ? "#888888" : "#f4f3f4"}
            />
          </View>

          <View style={styles.mealTypeRow}>
            <Text style={styles.mealTypeText}>Lunch</Text>
            <Switch
              value={mealTypes.lunch}
              onValueChange={() => toggleMealType("lunch")}
              trackColor={{ false: isDark ? "#555555" : "#dddddd", true: "#818cf8" }}
              thumbColor={mealTypes.lunch ? "#6366f1" : isDark ? "#888888" : "#f4f3f4"}
            />
          </View>

          <View style={styles.mealTypeRow}>
            <Text style={styles.mealTypeText}>Dinner</Text>
            <Switch
              value={mealTypes.dinner}
              onValueChange={() => toggleMealType("dinner")}
              trackColor={{ false: isDark ? "#555555" : "#dddddd", true: "#818cf8" }}
              thumbColor={mealTypes.dinner ? "#6366f1" : isDark ? "#888888" : "#f4f3f4"}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddMenu}>
        <Text style={styles.addButtonText}>Add Menu</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
