import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme/colors";
import api from "../services/api";
import { saveSession } from "../services/authStorage";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert("Campos obrigatorios", "Informe e-mail e senha para entrar.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      await saveSession({
        token: response.data.token,
        usuario: response.data.usuario,
      });

      onLogin(response.data.usuario);
    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Nao foi possivel entrar. Verifique o e-mail, a senha e o backend.";

      Alert.alert("Erro no login", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>NexTalk</Text>
        <Text style={styles.subtitleText}>Workspaces & Comunicacao Interna</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>E-mail Corporativo</Text>
        <TextInput
          style={styles.input}
          placeholder="nome@empresa.com"
          placeholderTextColor={colors.lightMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor={colors.lightMuted}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <Text style={styles.buttonText}>Entrar no NexTalk</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>Portal de Produtividade do Colaborador</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoText: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: "800",
  },
  subtitleText: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 6,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderColor: "#EBECF0",
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    shadowColor: "#091E42",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FAFBFC",
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 24,
    minHeight: 52,
  },
  buttonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  footerText: {
    color: colors.lightMuted,
    fontSize: 12,
    marginTop: 28,
    textAlign: "center",
  },
});
