import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

const actions = [
  { id: "entrada", label: "Registrar Entrada", type: "Entrada", icon: "log-in" },
  { id: "intervalo", label: "Intervalo Saida", type: "Intervalo Saida", icon: "cafe" },
  { id: "retorno", label: "Intervalo Retorno", type: "Intervalo Retorno", icon: "return-up-back" },
  { id: "saida", label: "Registrar Saida", type: "Saida", icon: "log-out" },
];

export default function TimeClockScreen() {
  const [now, setNow] = useState(new Date());
  const [records, setRecords] = useState([
    { id: "1", type: "Entrada", time: "08:02" },
    { id: "2", type: "Intervalo Saida", time: "12:05" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentTime = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleRegister = (type) => {
    const time = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setRecords((current) => [
      { id: String(Date.now()), type, time },
      ...current,
    ]);
    Alert.alert("Ponto registrado", `${type} as ${time}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.clockPanel}>
        <Text style={styles.clockLabel}>Horario atual</Text>
        <Text style={styles.clockText}>{currentTime}</Text>
        <Text style={styles.clockHint}>Registro local simulado</Text>
      </View>

      <View style={styles.actionGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionButton}
            onPress={() => handleRegister(action.type)}
          >
            <Ionicons name={action.icon} size={24} color={colors.primary} />
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Registros de hoje</Text>
        <Text style={styles.historyCount}>{records.length}</Text>
      </View>

      {records.map((record) => (
        <View key={record.id} style={styles.recordCard}>
          <View>
            <Text style={styles.recordType}>{record.type}</Text>
            <Text style={styles.recordMeta}>Ponto local</Text>
          </View>
          <Text style={styles.recordTime}>{record.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  clockPanel: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#EBECF0",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 18,
    padding: 24,
  },
  clockLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  clockText: {
    color: colors.text,
    fontSize: 46,
    fontWeight: "800",
    marginTop: 8,
  },
  clockHint: {
    color: colors.lightMuted,
    fontSize: 12,
    marginTop: 6,
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#EBECF0",
    borderRadius: 12,
    borderWidth: 1,
    flexBasis: "47%",
    flexGrow: 1,
    gap: 8,
    justifyContent: "center",
    minHeight: 112,
    padding: 14,
  },
  actionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  historyHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  historyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  historyCount: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
  },
  recordCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: "#EBECF0",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 16,
  },
  recordType: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800",
  },
  recordMeta: {
    color: colors.lightMuted,
    fontSize: 12,
    marginTop: 3,
  },
  recordTime: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
});
