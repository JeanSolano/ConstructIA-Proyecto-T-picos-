import { X, Trash2, FileDown, Inbox } from "lucide-react";
import { money, acabadoLabel, shortDate } from "../lib/format.js";
import { downloadEstimatePDF } from "../lib/pdf.js";

/**
 * Panel lateral (slide-over) con el historial de proyectos guardado en
 * localStorage. Permite ver un estimado anterior, descargar su PDF o borrarlo.
 */
export default function HistoryDrawer({ open, items, onClose, onSelect, onDelete, onClear }) {
  return (
    <>
      {/* Scrim */}
      <div
        className={
          "fixed inset-0 z-30 bg-ink/50 transition-opacity " +
          (open ? "opacity-100" : "pointer-events-none opacity-0")
        }
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Historial de proyectos"
        className={
          "fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col bg-canvas shadow-2xl transition-transform duration-300 " +
          (open ? "translate-x-0" : "translate-x-full")
        }
      >
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-4">
          <h2 className="text-base font-bold text-navy">Historial de proyectos</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar historial"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft transition hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="scroll-slim flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center">
              <Inbox className="h-10 w-10 text-line" />
              <p className="mt-3 text-sm font-semibold text-ink">Aún no hay proyectos</p>
              <p className="mt-1 text-xs text-ink-soft">
                Los estimados que generes se guardarán aquí automáticamente.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const est = item.estimate || {};
                const p = est.proyecto || {};
                return (
                  <li
                    key={item.id}
                    className="rounded-xl border border-line bg-surface p-3 shadow-[var(--shadow-card)]"
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(item)}
                      className="w-full text-left focus:outline-none"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold capitalize text-ink">
                          {p.tipoObra || "Proyecto"}
                        </span>
                        <span className="text-sm font-bold tabular-nums text-brand-green">
                          {money(est.totalMin)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {p.areaM2 ? `${p.areaM2} m² · ` : ""}
                        {acabadoLabel(p.acabados)}
                        {p.ubicacion ? ` · ${p.ubicacion}` : ""}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-soft/80">{shortDate(item.createdAt)}</p>
                    </button>

                    <div className="mt-2 flex items-center gap-2 border-t border-line pt-2">
                      <button
                        type="button"
                        onClick={() => downloadEstimatePDF(est)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-navy transition hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
                      >
                        <FileDown className="h-3.5 w-3.5" /> PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-danger transition hover:bg-danger/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Borrar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-line bg-surface p-3">
            <button
              type="button"
              onClick={onClear}
              className="w-full rounded-lg border border-line py-2 text-sm font-semibold text-danger transition hover:bg-danger/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger"
            >
              Vaciar historial
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
