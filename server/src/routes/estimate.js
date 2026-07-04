/**
 * routes/estimate.js
 * ---------------------------------------------------------------------------
 * Endpoint de estimacion estructurada de costos.
 *
 * POST /api/estimate
 * body: {
 *   project: { tipoObra, areaM2, cuartos, banos, acabados, ubicacion },
 *   images?: string[]   // data URLs opcionales
 * }
 * respuesta: presupuesto desglosado (ver ESTIMATE_SYSTEM_PROMPT)
 */

import { Router } from "express";
import { generateJSON, buildImagePart } from "../gemini.js";
import { ESTIMATE_SYSTEM_PROMPT } from "../prompts.js";

const router = Router();

const REQUIRED = ["tipoObra", "areaM2", "cuartos", "banos", "acabados", "ubicacion"];

router.post("/", async (req, res) => {
  try {
    const { project, images } = req.body || {};
    if (!project || typeof project !== "object") {
      return res.status(400).json({ error: "Se requiere el objeto 'project'." });
    }

    const missing = REQUIRED.filter((k) => project[k] === undefined || project[k] === null || project[k] === "");
    if (missing.length) {
      return res.status(400).json({ error: `Faltan datos del proyecto: ${missing.join(", ")}` });
    }

    // Un unico turno de usuario con los datos + imagenes opcionales.
    const parts = [
      {
        text:
          "Genera el estimado de costos para el siguiente proyecto:\n" +
          JSON.stringify(project, null, 2),
      },
    ];
    if (Array.isArray(images)) {
      for (const img of images) parts.push(buildImagePart(img));
    }

    const data = await generateJSON({
      systemPrompt: ESTIMATE_SYSTEM_PROMPT,
      contents: [{ role: "user", parts }],
      temperature: 0.3,
    });

    res.json(data);
  } catch (err) {
    console.error("[/api/estimate] Error:", err.message);
    res.status(502).json({ error: "No se pudo generar el estimado.", detail: err.message });
  }
});

export default router;
