import apiClient from "./apiClient";

// connexion
export const login = async (username: string, password: string) => {
  const response = await apiClient.post("/users/login", { username, password });
  return response.data;
};

// deconnexion
export const logout = async () => {
  const response = await apiClient.post("/users/logout");
  return response.data;
};
