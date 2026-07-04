import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { acabadoLabel } from "../lib/format.js";

const FIELDS = [
  ["tipoObra", "Tipo de obra"],
  ["areaM2", "Área (m²)"],
  ["cuartos", "Cuartos"],
  ["banos", "Baños"],
  ["acabados", "Nivel de acabados"],
  ["ubicacion", "Ubicación"],
];

/** Muestra un valor legible para cada dato recopilado. */
function display(key, value) {
  if (value == null || value === "") return null;
  if (key === "acabados") return acabadoLabel(value);
  if (key === "areaM2") return `${value} m²`;
  return String(value);
}

/**
 * Estado inicial del panel derecho: explica el producto y muestra el progreso
 * de datos recopilados por el chatbot (checklist).
 */
export default function EmptyState({ collected = {} }) {
  const done = FIELDS.filter(([k]) => display(k, collected[k])).length;

  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-line bg-surface p-6 shadow-[var(--shadow-card)]">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-green-50 text-brand-green">
        <Sparkles className="h-6 w-6" />
      </span>
      <h2 className="text-xl font-bold text-navy">Tu estimado aparecerá aquí</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        Conversa con el asistente y responde sus preguntas. Cuando tengamos los
        datos de tu proyecto, generaremos un presupuesto detallado y ajustado al
        mercado panameño.
      </p>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Datos recopilados
          </span>
          <span className="text-xs font-bold text-navy tabular-nums">{done}/6</span>
        </div>
        <ul className="space-y-2">
          {FIELDS.map(([key, label]) => {
            const val = display(key, collected[key]);
            const ok = Boolean(val);
            return (
              <li key={key} className="flex items-center gap-2.5 text-sm">
                {ok ? (
                  <CheckCircle2 className="h-4 w-4 flex-none text-brand-green" />
                ) : (
                  <Circle className="h-4 w-4 flex-none text-line" />
                )}
                <span className={ok ? "font-medium text-ink" : "text-ink-soft"}>{label}</span>
                {val && <span className="ml-auto truncate text-ink-soft">{val}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
