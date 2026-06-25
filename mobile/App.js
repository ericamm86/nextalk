import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import { clearSession, getSession } from "./src/services/authStorage";
import { colors } from "./src/theme/colors";

export default function App() {
  const [loadingSession, setLoadingSession] = useState(true);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    async function loadSession() {
      const session = await getSession();

      if (session) {
        setUsuario(session.usuario);
      }

      setLoadingSession(false);
    }

    loadSession();
  }, []);

  const handleLogin = (loggedUser) => {
    setUsuario(loggedUser);
  };

  const handleLogout = async () => {
    await clearSession();
    setUsuario(null);
  };

  if (loadingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <>
      {usuario ? (
        <AppNavigator usuario={usuario} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
  },
});
