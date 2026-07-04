import { HardHat, History, Plus } from "lucide-react";

/**
 * Barra superior de la aplicacion: marca + acciones globales.
 */
export default function Header({ onOpenHistory, onNewProject, historyCount }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Marca */}
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-white">
            <HardHat className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-navy">Construct-IA</h1>
            <p className="hidden text-xs text-ink-soft sm:block">
              Estimador de costos de construcción · Panamá
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-canvas focus:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            <History className="h-4 w-4" />
            <span className="hidden sm:inline">Historial</span>
            {historyCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-green px-1 text-xs font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onNewProject}
            className="inline-flex items-center gap-2 rounded-lg bg-navy px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-navy"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo proyecto</span>
          </button>
        </div>
      </div>
    </header>
  );
}
