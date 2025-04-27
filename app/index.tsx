"use client"

import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home, History, PieChart, Settings } from "lucide-react-native"

import { MealProvider } from "../context/meal-context"
import HomeScreen from "../screens/home-screen"
import HistoryScreen from "../screens/history-screen"
import DashboardScreen from "../screens/dashboard-screen"
import SettingsScreen from "../screens/settings-screen"
import AddMenuScreen from "../screens/add-menu-screen"
import AddCategoryScreen from "../screens/add-category-screen"
import { ThemeProvider, useTheme } from "../context/theme-context"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function HomeTabs() {
  const { colors, isDark } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === "Home") {
            return <Home size={size} color={color} />
          } else if (route.name === "History") {
            return <History size={size} color={color} />
          } else if (route.name === "Dashboard") {
            return <PieChart size={size} color={color} />
          } else if (route.name === "Settings") {
            return <Settings size={size} color={color} />
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
          paddingBottom: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Today's Meals" }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: "Meal History" }} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: "Stats" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Settings" }} />
    </Tab.Navigator>
  )
}

function AppWithTheme() {
  const { colors } = useTheme()

  return (
    <MealProvider>
      <SafeAreaProvider>
        <NavigationContainer
          theme={{
            dark: false,
            colors: {
              primary: colors.primary,
              background: colors.background,
              card: colors.card,
              text: colors.text,
              border: colors.border,
              notification: colors.primary,
            },
            fonts: {
              regular: { fontFamily: 'System', fontWeight: '400' },
              medium: { fontFamily: 'System', fontWeight: '500' },
              bold: { fontFamily: 'System', fontWeight: '700' },
              heavy: { fontFamily: 'System', fontWeight: '900' },
            },
          }}
        >
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.card,
              },
              headerTintColor: colors.text,
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen name="Main" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AddMenu" component={AddMenuScreen} options={{ title: "Add New Menu" }} />
            <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={{ title: "Add New Category" }} />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </MealProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  )
}
