/**
 * gemini.js
 * ---------------------------------------------------------------------------
 * Envoltura delgada sobre el SDK oficial @google/genai.
 *
 * Centraliza la comunicacion con la API de Gemini para que el resto del
 * servidor no dependa de los detalles del SDK. Expone dos utilidades:
 *   - generateJSON(): pide una respuesta en JSON y la parsea de forma robusta.
 *   - buildImagePart(): convierte una imagen base64 en el formato que Gemini espera.
 */

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-flash-latest";

if (!apiKey) {
  console.warn(
    "[Construct-IA] ADVERTENCIA: GEMINI_API_KEY no esta definida. " +
      "Copia server/.env.example a server/.env y agrega tu clave."
  );
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Extrae un objeto JSON de la respuesta del modelo, tolerando que a veces
 * venga envuelto en bloques de codigo ```json ... ``` o con texto alrededor.
 */
function parseJSONLoose(text) {
  if (!text) throw new Error("Respuesta vacia del modelo.");
  let clean = text.trim();

  // Quita cercas de codigo si el modelo las agrego.
  clean = clean.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    // Ultimo recurso: extrae desde la primera { hasta la ultima }.
    const first = clean.indexOf("{");
    const last = clean.lastIndexOf("}");
    if (first !== -1 && last !== -1) {
      return JSON.parse(clean.slice(first, last + 1));
    }
    throw new Error("No se pudo interpretar la respuesta del modelo como JSON.");
  }
}

/**
 * Genera contenido con Gemini forzando salida JSON y lo devuelve ya parseado.
 *
 * @param {object}  opts
 * @param {string}  opts.systemPrompt   Instruccion de sistema.
 * @param {Array}   opts.contents       Historial de contenidos (roles user/model).
 * @param {number} [opts.temperature]   Creatividad (0-1).
 * @returns {Promise<object>} JSON parseado.
 */
export async function generateJSON({ systemPrompt, contents, temperature = 0.4 }) {
  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      temperature,
    },
  });

  return parseJSONLoose(response.text);
}

/**
 * Construye una "part" de imagen a partir de un data URL o base64 crudo.
 * @param {string} dataUrl  Ej: "data:image/jpeg;base64,...."
 */
export function buildImagePart(dataUrl) {
  const match = /^data:(.+?);base64,(.*)$/.exec(dataUrl || "");
  const mimeType = match ? match[1] : "image/jpeg";
  const data = match ? match[2] : dataUrl;
  return { inlineData: { mimeType, data } };
}

export const geminiModel = model;
