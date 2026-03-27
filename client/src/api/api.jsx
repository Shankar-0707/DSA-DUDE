import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true,
});

export default API;

export const sendChatMessage = (message, history) =>
  API.post("/chatbot/message", { message, history });
