"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useMeal } from "../context/meal-context"
import { useTheme } from "../context/theme-context"

export default function AddCategoryScreen() {
  const navigation = useNavigation()
  const { categories, addCategory } = useMeal()
  const { isDark } = useTheme()

  const [name, setName] = useState("")

  const handleAddCategory = async () => {
    // Validate input
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a category name")
      return
    }

    // Check if category already exists
    const categoryExists = categories.some((category) => category.name.toLowerCase() === name.trim().toLowerCase())

    if (categoryExists) {
      Alert.alert("Error", "A category with this name already exists")
      return
    }

    try {
      await addCategory({
        name: name.trim(),
      })

      Alert.alert("Success", "Category added successfully!", [{ text: "OK", onPress: () => navigation.goBack() }])
    } catch (error) {
      Alert.alert("Error", "Failed to add category")
    }
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
  })

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter category name"
          placeholderTextColor={isDark ? "#888888" : "#999999"}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
        <Text style={styles.addButtonText}>Add Category</Text>
      </TouchableOpacity>
    </View>
  )
}
