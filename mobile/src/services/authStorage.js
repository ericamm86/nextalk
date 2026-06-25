import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@nextalk:token";
const USER_KEY = "@nextalk:usuario";

export async function saveSession({ token, usuario }) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(usuario)],
  ]);
}

export async function getSession() {
  const [[, token], [, userJson]] = await AsyncStorage.multiGet([
    TOKEN_KEY,
    USER_KEY,
  ]);

  if (!token || !userJson) {
    return null;
  }

  return {
    token,
    usuario: JSON.parse(userJson),
  };
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}
