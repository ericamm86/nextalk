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
import EmptyState from "../components/EmptyState";
import FormInput from "../components/FormInput";
import TaskCard from "../components/TaskCard";
import api from "../services/api";
import { colors } from "../theme/colors";

const columns = ["A fazer", "Em andamento", "Concluido"];

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadTasks() {
    const response = await api.get("/tarefas");
    setTasks(response.data.tarefas || []);
  }

  async function fetchTasks() {
    try {
      setLoading(true);
      await loadTasks();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel carregar as tarefas.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshTasks() {
    try {
      setRefreshing(true);
      await loadTasks();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel atualizar as tarefas.");
    } finally {
      setRefreshing(false);
    }
  }

  async function createTask() {
    if (!titulo.trim()) {
      Alert.alert("Campo obrigatorio", "Informe o titulo da tarefa.");
      return;
    }

    try {
      setSaving(true);
      await api.post("/tarefas/criar", {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        status: "A fazer",
      });
      setTitulo("");
      setDescricao("");
      await loadTasks();
    } catch (error) {
      const message = error.response?.data?.error || "Nao foi possivel criar a tarefa.";
      Alert.alert("Erro", message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(task, status) {
    try {
      await api.patch(`/tarefas/${task.id}/status`, { status });
      await loadTasks();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel atualizar o status.");
    }
  }

  async function deleteTask(task) {
    try {
      await api.delete(`/tarefas/${task.id}`);
      await loadTasks();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel excluir a tarefa.");
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refreshTasks} />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Painel de tarefas</Text>
        <Text style={styles.summaryText}>
          Gerencie prioridades reais do usuario autenticado.
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Nova tarefa</Text>
        <FormInput
          label="Titulo"
          placeholder="Ex: Validar relatorio"
          value={titulo}
          onChangeText={setTitulo}
          style={styles.inputGroup}
        />
        <FormInput
          label="Descricao"
          placeholder="Detalhe rapidamente a atividade"
          value={descricao}
          onChangeText={setDescricao}
          multiline
          style={styles.inputGroup}
        />
        <TouchableOpacity
          style={[styles.primaryButton, saving && styles.buttonDisabled]}
          onPress={createTask}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.primaryButtonText}>Criar tarefa</Text>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="checkbox-outline"
          title="Nenhuma tarefa cadastrada"
          message="Crie a primeira tarefa para iniciar o quadro."
        />
      ) : (
        columns.map((status) => {
          const statusTasks = tasks.filter((task) => task.status === status);

          return (
            <View key={status} style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{status}</Text>
                <Text style={styles.counter}>{statusTasks.length}</Text>
              </View>
              {statusTasks.length === 0 ? (
                <Text style={styles.emptyColumn}>Sem tarefas neste status.</Text>
              ) : (
                statusTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onChangeStatus={changeStatus}
                    onDelete={deleteTask}
                  />
                ))
              )}
            </View>
          );
        })
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
  summary: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginBottom: 16,
    padding: 18,
  },
  summaryTitle: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: "800",
  },
  summaryText: {
    color: "#DEEBFF",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderColor: "#EBECF0",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 22,
    padding: 16,
  },
  formTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "800",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loader: {
    marginTop: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800",
  },
  counter: {
    backgroundColor: "#E9F2FF",
    borderRadius: 999,
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  emptyColumn: {
    color: colors.lightMuted,
    fontSize: 13,
    marginBottom: 10,
  },
});
