import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Pressable, StyleSheet, Text } from "react-native";
import TasksScreen from "../screens/TasksScreen";
import TimeClockScreen from "../screens/TimeClockScreen";
import { colors } from "../theme/colors";

const Tab = createBottomTabNavigator();

export default function AppNavigator({ onLogout }) {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitle: "NexTalk",
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable style={styles.logoutButton} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={21} color={colors.primary} />
            </Pressable>
          ),
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.lightMuted,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color, size }) => {
            const iconName = route.name === "Tarefas" ? "checkbox" : "time";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Tarefas" component={TasksScreen} />
        <Tab.Screen name="Ponto" component={TimeClockScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: "800",
  },
  logoutButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    marginRight: 16,
    width: 40,
  },
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: "#EBECF0",
    height: 68,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
});
