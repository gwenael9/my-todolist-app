import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const getTasks = async () => {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
}

// nouvelle tâche
export const addTask = async (taskData: { title: string; description: string; }) => {
    const response = await axios.post(`${API_URL}/tasks`, taskData);
    return response.data;
}

// modifie une tâche
export const updateTask = async (taskId: number, updatedTaskData: { title?: string; description?: string; completed?: boolean; }) => {
    const response = await axios.put(`${API_URL}/tasks/${taskId}`, updatedTaskData);
    return response.data;
}

// supprime une tâche
export const deleteTask = async (taskId: number) => {
    const response = await axios.delete(`${API_URL}/tasks/${taskId}`);
    return response.data;
}