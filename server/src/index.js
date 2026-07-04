/**
 * index.js
 * ---------------------------------------------------------------------------
 * Punto de entrada del backend de Construct-IA.
 *
 * Servidor Express que actua como proxy seguro hacia la API de Gemini:
 * mantiene la clave del lado del servidor y expone una API REST simple al
 * frontend. No usa base de datos; el historial vive en el navegador del
 * usuario (localStorage).
 */

import "dotenv/config";
import express from "express";
import cors from "cors";

import chatRouter from "./routes/chat.js";
import estimateRouter from "./routes/estimate.js";
import { geminiModel } from "./gemini.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
// Limite alto porque las fotos viajan como data URL en base64.
app.use(express.json({ limit: "12mb" }));

// Rutas de la API
app.use("/api/chat", chatRouter);
app.use("/api/estimate", estimateRouter);

// Healthcheck: util para verificar que el servidor y el modelo estan listos.
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", model: geminiModel, hasKey: Boolean(process.env.GEMINI_API_KEY) });
});

app.listen(PORT, () => {
  console.log(`\n  Construct-IA API escuchando en http://localhost:${PORT}`);
  console.log(`  Modelo: ${geminiModel}`);
  console.log(`  Clave configurada: ${process.env.GEMINI_API_KEY ? "si" : "NO (revisa server/.env)"}\n`);
});
