import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function EmptyState({ icon = "file-tray-outline", title, message }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={28} color={colors.lightMuted} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#EBECF0",
    borderRadius: 10,
    borderWidth: 1,
    padding: 18,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
    marginTop: 10,
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    textAlign: "center",
  },
});
