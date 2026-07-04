/**
 * routes/chat.js
 * ---------------------------------------------------------------------------
 * Endpoint del chatbot conversacional.
 *
 * POST /api/chat
 * body: {
 *   messages: [{ role: "user"|"assistant", text: string }],
 *   image?: string   // data URL opcional para analisis por foto
 * }
 * respuesta: { reply, collected, ready }
 */

import { Router } from "express";
import { generateJSON, buildImagePart } from "../gemini.js";
import { CHAT_SYSTEM_PROMPT } from "../prompts.js";

const router = Router();

/** Convierte el historial del frontend al formato de "contents" de Gemini. */
function toGeminiContents(messages = [], image) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text ?? "" }],
  }));

  // Adjunta la imagen (si existe) al ultimo turno del usuario.
  if (image && contents.length > 0) {
    const last = contents[contents.length - 1];
    if (last.role === "user") last.parts.push(buildImagePart(image));
  }
  return contents;
}

router.post("/", async (req, res) => {
  try {
    const { messages, image } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Se requiere 'messages' con al menos un mensaje." });
    }

    const data = await generateJSON({
      systemPrompt: CHAT_SYSTEM_PROMPT,
      contents: toGeminiContents(messages, image),
      temperature: 0.6,
    });

    // Blindaje: garantiza la forma esperada aunque el modelo se desvie.
    res.json({
      reply: data.reply ?? "Disculpa, no entendi. Puedes repetirlo?",
      collected: data.collected ?? {},
      ready: Boolean(data.ready),
    });
  } catch (err) {
    console.error("[/api/chat] Error:", err.message);
    res.status(502).json({ error: "No se pudo contactar al asistente de IA.", detail: err.message });
  }
});

export default router;
