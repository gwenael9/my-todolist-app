import apiClient from "./apiClient";

// connexion
export const login = async (username: string, password: string) => {
  const response = await apiClient.post("/auth/login", { username, password });
  return response.data;
};

// deconnexion
export const logout = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

// recup les infos de l'utilisateur connecté
export const getUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response.data;
}