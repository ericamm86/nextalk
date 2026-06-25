import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const statusStyles = {
  "A fazer": {
    backgroundColor: "#E9F2FF",
    color: colors.primary,
  },
  "Em andamento": {
    backgroundColor: "#FFF0B3",
    color: "#7A4D00",
  },
  Concluido: {
    backgroundColor: "#E3FCEF",
    color: colors.success,
  },
};

export default function TaskCard({ task }) {
  const badge = statusStyles[task.status] || statusStyles["A fazer"];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>
            {task.status}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>{task.description}</Text>
      <Text style={styles.meta}>{task.owner} · {task.due}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EBECF0",
    padding: 16,
    marginBottom: 12,
    shadowColor: "#091E42",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    gap: 10,
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    color: colors.lightMuted,
    fontSize: 12,
    fontWeight: "600",
    marginTop: 12,
  },
});
