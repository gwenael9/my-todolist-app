import apiClient from "./apiClient";

// voir nos tâches
export const getTasks = async (page: number = 0) => {
  try {
    const response = await apiClient.get(`/tasks?page=${page}&size=5`);
    return {
      tasks: response.data.content,
      totalPages: response.data.totalPages,
      totalElements: response.data.totalElements,
    };
  } catch (err) {
    console.error("Failed to fetch tasks");
    throw err;
  }
};

// nouvelle tâche
export const addTask = async (taskData: {
  title: string;
  description: string;
  categorie: { name: string };
}) => {
  try {
    const response = await apiClient.post("/tasks", taskData);
    return response.data;
  } catch (err) {
    console.error("Failed to add task");
    throw err;
  }
};

// modifier une tâche
export const updateTask = async (
  taskId: number,
  updateData: {
    title: string;
    description: string;
    categorie: { id: number };
  }
) => {
  try {
    const response = await apiClient.put(`/tasks/${taskId}`, updateData);
    return response.data;
  } catch (err) {
    console.error("Failed to update task");
    throw err;
  }
};

// modifier l'avancement de la tâche (en cours/terminée)
export const updateProgressTask = async (
  taskId: number,
  updateData: {
    completed: boolean;
  }
) => {
  try {
    const response = await apiClient.patch(`/tasks/${taskId}/completed`, updateData);
    return response.data;
  } catch (err) {
    console.error("Erreur lors de la modification de la tâches.");
    throw err;
  }
};

// supprime une tâche
export const deleteTask = async (taskId: number) => {
  try {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (err) {
    console.error("Failed to delete task");
    throw err;
  }
};
