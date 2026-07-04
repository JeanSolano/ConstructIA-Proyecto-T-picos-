import { FileDown, Ruler, MapPin, Home, Bath, Layers } from "lucide-react";
import { money, moneyRange, acabadoLabel } from "../lib/format.js";
import { downloadEstimatePDF } from "../lib/pdf.js";
import CostBreakdown from "./CostBreakdown.jsx";
import Comparator from "./Comparator.jsx";

/** Ficha compacta de un dato del proyecto. */
function Fact({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
      <Icon className="h-4 w-4 flex-none text-navy-600" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-ink-soft">{label}</p>
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

/**
 * Panel de resultados: resumen, total destacado, datos del proyecto,
 * desglose, comparador, supuestos y descarga de PDF.
 */
export default function EstimatePanel({ estimate }) {
  const p = estimate.proyecto || {};

  return (
    <div className="space-y-4">
      {/* Cabecera con total destacado */}
      <div className="overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-navy to-navy-800 p-5 text-white shadow-[var(--shadow-card)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-white/70">
              Estimado total
            </p>
            <p className="mt-1 font-heading text-3xl font-bold tabular-nums">
              {moneyRange(estimate.totalMin, estimate.totalMax)}
            </p>
            {estimate.costoM2Min != null && (
              <p className="mt-1 text-sm text-white/80">
                {money(estimate.costoM2Min)} – {money(estimate.costoM2Max)} por m²
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => downloadEstimatePDF(estimate)}
            className="inline-flex flex-none items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-navy transition hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
          >
            <FileDown className="h-4 w-4" /> PDF
          </button>
        </div>
        {estimate.resumen && (
          <p className="mt-3 border-t border-white/15 pt-3 text-sm leading-relaxed text-white/90">
            {estimate.resumen}
          </p>
        )}
      </div>

      {/* Datos del proyecto */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Fact icon={Home} label="Tipo de obra" value={p.tipoObra || "—"} />
        <Fact icon={Ruler} label="Área" value={p.areaM2 ? `${p.areaM2} m²` : "—"} />
        <Fact icon={Layers} label="Acabados" value={acabadoLabel(p.acabados)} />
        <Fact icon={Home} label="Cuartos" value={p.cuartos ?? "—"} />
        <Fact icon={Bath} label="Baños" value={p.banos ?? "—"} />
        <Fact icon={MapPin} label="Ubicación" value={p.ubicacion || "—"} />
      </div>

      <CostBreakdown
        categorias={estimate.categorias}
        totalMin={estimate.totalMin}
        totalMax={estimate.totalMax}
      />

      <Comparator comparativa={estimate.comparativa} seleccionado={p.acabados} />

      {/* Supuestos */}
      {Array.isArray(estimate.supuestos) && estimate.supuestos.length > 0 && (
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-2 text-sm font-bold text-navy">Supuestos del estimado</h3>
          <ul className="space-y-1.5">
            {estimate.supuestos.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-amber" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="px-1 text-xs leading-relaxed text-ink-soft">
        {estimate.disclaimer ||
          "Estimado preliminar generado por IA. No sustituye una cotización profesional."}
      </p>
    </div>
  );
}
