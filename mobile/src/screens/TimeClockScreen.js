import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EmptyState from "../components/EmptyState";
import api from "../services/api";
import { colors } from "../theme/colors";

const actions = [
  { id: "entrada", label: "Registrar Entrada", type: "Entrada", icon: "log-in" },
  { id: "intervalo", label: "Intervalo Saida", type: "Intervalo Saida", icon: "cafe" },
  {
    id: "retorno",
    label: "Intervalo Retorno",
    type: "Intervalo Retorno",
    icon: "return-up-back",
  },
  { id: "saida", label: "Registrar Saida", type: "Saida", icon: "log-out" },
];

function formatTime(dateValue) {
  return new Date(dateValue).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString("pt-BR");
}

export default function TimeClockScreen() {
  const [now, setNow] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingType, setSavingType] = useState(null);

  async function loadRecords() {
    const response = await api.get("/ponto");
    setRecords(response.data.registros || []);
  }

  async function fetchRecords() {
    try {
      setLoading(true);
      await loadRecords();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel carregar os registros de ponto.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshRecords() {
    try {
      setRefreshing(true);
      await loadRecords();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel atualizar os registros.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    fetchRecords();
    return () => clearInterval(timer);
  }, []);

  const currentTime = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  async function handleRegister(type) {
    try {
      setSavingType(type);
      const response = await api.post("/ponto/bater", { tipo: type });
      await loadRecords();
      Alert.alert("Ponto registrado", `${response.data.ponto.tipo} as ${formatTime(response.data.ponto.data_hora)}`);
    } catch (error) {
      const message =
        error.response?.data?.error || "Nao foi possivel registrar o ponto.";
      Alert.alert("Erro", message);
    } finally {
      setSavingType(null);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshRecords} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.clockPanel}>
        <Text style={styles.clockLabel}>Horario atual</Text>
        <Text style={styles.clockText}>{currentTime}</Text>
        <Text style={styles.clockHint}>Sincronizado com o backend</Text>
      </View>

      <View style={styles.actionGrid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionButton, savingType && styles.buttonDisabled]}
            onPress={() => handleRegister(action.type)}
            disabled={Boolean(savingType)}
          >
            {savingType === action.type ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons name={action.icon} size={24} color={colors.primary} />
            )}
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Registros</Text>
        <Text style={styles.historyCount}>{records.length}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : records.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="Nenhum ponto registrado"
          message="Use os botoes acima para registrar o primeiro ponto."
        />
      ) : (
        records.map((record) => (
          <View key={record.id} style={styles.recordCard}>
            <View>
              <Text style={styles.recordType}>{record.tipo}</Text>
              <Text style={styles.recordMeta}>{formatDate(record.data_hora)}</Text>
            </View>
            <Text style={styles.recordTime}>{formatTime(record.data_hora)}</Text>
          </View>
        ))
      )}
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
  buttonDisabled: {
    opacity: 0.7,
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
  loader: {
    marginTop: 20,
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
