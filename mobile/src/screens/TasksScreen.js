import { ScrollView, StyleSheet, Text, View } from "react-native";
import TaskCard from "../components/TaskCard";
import { colors } from "../theme/colors";

const tasks = [
  {
    id: "1",
    title: "Revisar relatorio semanal",
    description: "Validar indicadores de produtividade antes da reuniao.",
    status: "A fazer",
    owner: "Administrativo",
    due: "Hoje, 16:00",
  },
  {
    id: "2",
    title: "Atualizar cadastro de colaboradores",
    description: "Conferir dados pendentes no modulo de funcionarios.",
    status: "Em andamento",
    owner: "RH",
    due: "Amanha",
  },
  {
    id: "3",
    title: "Publicar comunicado interno",
    description: "Enviar aviso sobre ajustes no fluxo de ponto eletronico.",
    status: "Concluido",
    owner: "Comunicacao",
    due: "Ontem",
  },
];

const columns = ["A fazer", "Em andamento", "Concluido"];

export default function TasksScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Painel de tarefas</Text>
        <Text style={styles.summaryText}>
          Acompanhe prioridades, andamento e entregas do time.
        </Text>
      </View>

      {columns.map((status) => {
        const statusTasks = tasks.filter((task) => task.status === status);

        return (
          <View key={status} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{status}</Text>
              <Text style={styles.counter}>{statusTasks.length}</Text>
            </View>
            {statusTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </View>
        );
      })}
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
    marginBottom: 22,
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
});
