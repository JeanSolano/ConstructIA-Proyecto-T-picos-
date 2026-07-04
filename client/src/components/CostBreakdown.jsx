import { money } from "../lib/format.js";

/**
 * Desglose de costos por categoria con barras proporcionales al costo maximo.
 */
export default function CostBreakdown({ categorias = [], totalMin, totalMax }) {
  const topMax = Math.max(...categorias.map((c) => Number(c.max) || 0), 1);

  return (
    <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
      <h3 className="mb-4 text-base font-bold text-navy">Desglose por categoría</h3>

      <ul className="space-y-4">
        {categorias.map((c) => (
          <li key={c.nombre}>
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-ink">{c.nombre}</span>
              <span className="font-body text-sm tabular-nums text-ink-soft">
                {money(c.min)} – {money(c.max)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-canvas">
              <div
                className="h-full rounded-full bg-navy"
                style={{ width: `${((Number(c.max) || 0) / topMax) * 100}%` }}
              />
            </div>
            {c.detalle && <p className="mt-1 text-xs text-ink-soft">{c.detalle}</p>}
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <span className="text-sm font-bold text-navy">Total estimado</span>
        <span className="font-heading text-lg font-bold tabular-nums text-brand-green">
          {money(totalMin)} – {money(totalMax)}
        </span>
      </div>
    </div>
  );
}
