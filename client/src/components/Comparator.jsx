import { Check } from "lucide-react";
import { money, acabadoLabel } from "../lib/format.js";

/**
 * Comparador de niveles de acabados (basico / estandar / premium).
 * Resalta el nivel elegido en el proyecto actual.
 */
export default function Comparator({ comparativa = [], seleccionado }) {
  if (!comparativa.length) return null;

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-1 text-base font-bold text-navy">Comparador de acabados</h3>
      <p className="mb-4 text-xs text-ink-soft">
        Compara el costo total según el nivel de acabados elegido.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {comparativa.map((c) => {
          const active = c.nivel === seleccionado;
          return (
            <div
              key={c.nivel}
              className={
                "rounded-xl border p-4 transition " +
                (active
                  ? "border-brand-green bg-brand-green-50 ring-1 ring-brand-green"
                  : "border-line bg-canvas")
              }
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{acabadoLabel(c.nivel)}</span>
                {active && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    <Check className="h-3 w-3" /> Tu elección
                  </span>
                )}
              </div>
              <p className="font-heading text-base font-bold tabular-nums text-navy">
                {money(c.totalMin)}
              </p>
              <p className="text-xs text-ink-soft">hasta {money(c.totalMax)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
