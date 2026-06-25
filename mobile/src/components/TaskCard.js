import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

const nextStatus = {
  "A fazer": "Em andamento",
  "Em andamento": "Concluido",
  Concluido: "A fazer",
};

export default function TaskCard({ task, onChangeStatus, onDelete }) {
  const badge = statusStyles[task.status] || statusStyles["A fazer"];
  const title = task.title || task.titulo;
  const description = task.description || task.descricao || "Sem descricao.";
  const createdAt = task.data_criacao
    ? new Date(task.data_criacao).toLocaleDateString("pt-BR")
    : task.due;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.badge, { backgroundColor: badge.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: badge.color }]}>
            {task.status}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.meta}>Criada em {createdAt || "data recente"}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => onChangeStatus?.(task, nextStatus[task.status])}
        >
          <Text style={styles.secondaryButtonText}>Mover status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete?.(task)}>
          <Text style={styles.deleteButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
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
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  secondaryButton: {
    alignItems: "center",
    backgroundColor: "#E9F2FF",
    borderRadius: 8,
    flex: 1,
    minHeight: 40,
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#FFEBE6",
    borderRadius: 8,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  deleteButtonText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "800",
  },
});
