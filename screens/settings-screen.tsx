"use client"
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Moon, Sun, Trash2, Settings as SettingsIcon } from "lucide-react-native"

import { useMeal } from "../context/meal-context"
import { useTheme } from "../context/theme-context"

export default function SettingsScreen() {
  const navigation = useNavigation()
  const { repetitionDays, setRepetitionDays, categories, menus, deleteCategory } = useMeal()
  const { mode, isDark, setMode, colors } = useTheme()

  const handleDeleteCategory = (categoryId: string) => {
    Alert.alert("Delete Category", "Are you sure you want to delete this category? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCategory(categoryId)
            Alert.alert("Success", "Category deleted successfully!")
          } catch (error) {
            Alert.alert("Error", (error as Error).message)
          }
        },
      },
    ])
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
    section: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
    },
    settingValue: {
      fontSize: 16,
      color: colors.primary,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: {
      color: "#ffffff",
      fontWeight: "600",
      fontSize: 16,
    },
    categoryItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    categoryName: {
      fontSize: 16,
      color: colors.text,
    },
    categoryCount: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    deleteButton: {
      padding: 8,
    },
    themeRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    themeOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "transparent",
      marginRight: 8,
      backgroundColor: colors.muted,
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.accent,
    },
    themeLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: colors.text,
      fontWeight: "500",
    },
    repetitionOption: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: "transparent",
      marginRight: 8,
      alignItems: "center",
      backgroundColor: colors.muted,
    },
    repetitionOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.accent,
    },
    repetitionText: {
      fontSize: 14,
      color: colors.text,
    },
    repetitionTextActive: {
      color: colors.primary,
      fontWeight: "600",
    },
    repetitionOptions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    sectionIcon: {
      marginBottom: 12,
    },
  })

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Settings</Text>
        <Text style={styles.subHeaderText}>Customize your app experience</Text>
      </View>

      <View style={styles.section}>
        <SettingsIcon size={24} color={colors.primary} style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.themeRow}>
          <TouchableOpacity
            style={[styles.themeOption, mode === "light" && styles.themeOptionActive]}
            onPress={() => setMode("light")}
          >
            <Sun size={20} color={colors.text} />
            <Text style={styles.themeLabel}>Light</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeOption, mode === "dark" && styles.themeOptionActive]}
            onPress={() => setMode("dark")}
          >
            <Moon size={20} color={colors.text} />
            <Text style={styles.themeLabel}>Dark</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.themeOption, mode === "system" && styles.themeOptionActive]}
            onPress={() => setMode("system")}
          >
            <Sun size={16} color={colors.text} />
            <Moon size={16} color={colors.text} style={{ marginLeft: 4 }} />
            <Text style={styles.themeLabel}>System</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Suggestions</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Prevent repetition within</Text>
        </View>

        <View style={styles.repetitionOptions}>
          {[1, 2, 3, 5].map((days) => (
            <TouchableOpacity
              key={days}
              style={[styles.repetitionOption, repetitionDays === days && styles.repetitionOptionActive]}
              onPress={() => setRepetitionDays(days)}
            >
              <Text style={[styles.repetitionText, repetitionDays === days && styles.repetitionTextActive]}>
                {days} {days === 1 ? "day" : "days"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {categories.map((category) => {
          const menuCount = menus.filter((menu) => menu.category === category.id).length

          return (
            <View key={category.id} style={styles.categoryItem}>
              <View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>
                  {menuCount} {menuCount === 1 ? "menu" : "menus"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCategory(category.id)}
                disabled={menuCount > 0}
              >
                <Trash2
                  size={20}
                  color={menuCount > 0 ? colors.textSecondary : "#ef4444"}
                  opacity={menuCount > 0 ? 0.5 : 1}
                />
              </TouchableOpacity>
            </View>
          )
        })}

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("AddCategory" as never)}>
          <Text style={styles.buttonText}>Add New Category</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
