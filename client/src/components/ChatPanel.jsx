import { useEffect, useRef } from "react";
import { HardHat, Calculator, Loader2 } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import ChatInput from "./ChatInput.jsx";

/** Indicador "escribiendo…" mientras el asistente responde. */
function Typing() {
  return (
    <div className="flex gap-2.5 animate-rise">
      <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg bg-navy text-white">
        <HardHat className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-line bg-surface px-4 py-3 shadow-[var(--shadow-card)]">
        <span className="dot h-2 w-2 rounded-full bg-ink-soft" />
        <span className="dot h-2 w-2 rounded-full bg-ink-soft" />
        <span className="dot h-2 w-2 rounded-full bg-ink-soft" />
      </div>
    </div>
  );
}

/**
 * Panel de chat: lista de mensajes con autoscroll, indicador de escritura,
 * boton para generar el estimado (cuando hay datos completos) y la entrada.
 */
export default function ChatPanel({
  messages,
  loading,
  ready,
  estimating,
  hasEstimate,
  onSend,
  onGenerate,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-canvas shadow-[var(--shadow-card)]">
      {/* Mensajes */}
      <div className="scroll-slim flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} text={m.text} image={m.image} />
        ))}
        {loading && <Typing />}
        <div ref={endRef} />
      </div>

      {/* CTA para generar el estimado cuando ya hay datos suficientes */}
      {ready && !hasEstimate && (
        <div className="border-t border-line bg-brand-green-50 p-3">
          <button
            type="button"
            onClick={onGenerate}
            disabled={estimating}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green disabled:opacity-70"
          >
            {estimating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Generando estimado…
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4" /> Generar estimado de costos
              </>
            )}
          </button>
        </div>
      )}

      <ChatInput onSend={onSend} disabled={loading || estimating} />
    </section>
  );
}
