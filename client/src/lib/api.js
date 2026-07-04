/**
 * api.js — Cliente HTTP hacia el backend de Construct-IA.
 * Usa rutas relativas (/api/...) que Vite redirige al servidor Express.
 */
import axios from "axios";

const http = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

/**
 * Envia el historial de conversacion al chatbot.
 * @param {Array<{role:string,text:string}>} messages
 * @param {string} [image] data URL de una foto opcional
 * @returns {Promise<{reply:string, collected:object, ready:boolean}>}
 */
export async function sendChat(messages, image) {
  const { data } = await http.post("/chat", { messages, image });
  return data;
}

/**
 * Solicita el estimado estructurado de costos.
 * @param {object} project datos recopilados del proyecto
 * @param {string[]} [images] fotos opcionales (data URLs)
 */
export async function requestEstimate(project, images) {
  const { data } = await http.post("/estimate", { project, images });
  return data;
}
