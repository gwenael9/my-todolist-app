import axios from 'axios';

const API_URL = "http://localhost:8080";

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true, // cookies
})

export default apiClient;