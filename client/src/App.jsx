import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Header from "./components/Header.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import EstimatePanel from "./components/EstimatePanel.jsx";
import EmptyState from "./components/EmptyState.jsx";
import HistoryDrawer from "./components/HistoryDrawer.jsx";
import { sendChat, requestEstimate } from "./lib/api.js";
import { getHistory, saveEstimate, removeEstimate, clearHistory } from "./lib/storage.js";

// Mensaje inicial del asistente.
const GREETING = {
  role: "assistant",
  text:
    "¡Hola! Soy Construct-IA 👷. Te ayudo a estimar el costo de tu proyecto de " +
    "construcción o remodelación en Panamá.\n\nPara empezar, cuéntame: ¿qué " +
    "tienes en mente? Por ejemplo, una casa nueva, una remodelación o una ampliación.",
};

export default function App() {
  const [messages, setMessages] = useState([GREETING]);
  const [collected, setCollected] = useState({});
  const [ready, setReady] = useState(false);
  const [images, setImages] = useState([]); // fotos acumuladas para la estimacion

  const [loading, setLoading] = useState(false); // chat esperando respuesta
  const [estimating, setEstimating] = useState(false); // generando estimado
  const [estimate, setEstimate] = useState(null);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  /** Envia un mensaje del usuario al chatbot. */
  async function handleSend(text, image) {
    setError("");
    const userMsg = { role: "user", text, image };
    const next = [...messages, userMsg];
    setMessages(next);
    if (image) setImages((prev) => [...prev, image]);
    setLoading(true);

    try {
      // El backend espera {role, text}; enviamos el historial sin imagenes previas.
      const payload = next.map((m) => ({ role: m.role, text: m.text }));
      const res = await sendChat(payload, image);
      setMessages((prev) => [...prev, { role: "assistant", text: res.reply }]);
      setCollected(res.collected || {});
      setReady(Boolean(res.ready));
    } catch (e) {
      setError(e?.response?.data?.error || "No se pudo contactar al asistente. Revisa que el servidor esté encendido.");
    } finally {
      setLoading(false);
    }
  }

  /** Genera el estimado estructurado con los datos recopilados. */
  async function handleGenerate() {
    setError("");
    setEstimating(true);
    try {
      const est = await requestEstimate(collected, images);
      setEstimate(est);
      setHistory(saveEstimate(est));
    } catch (e) {
      setError(e?.response?.data?.error || "No se pudo generar el estimado. Inténtalo de nuevo.");
    } finally {
      setEstimating(false);
    }
  }

  /** Reinicia la conversacion para un proyecto nuevo. */
  function handleNewProject() {
    setMessages([GREETING]);
    setCollected({});
    setReady(false);
    setImages([]);
    setEstimate(null);
    setError("");
  }

  // Handlers del historial
  function handleSelectHistory(item) {
    setEstimate(item.estimate);
    setHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function handleDeleteHistory(id) {
    setHistory(removeEstimate(id));
  }
  function handleClearHistory() {
    setHistory(clearHistory());
  }

  const rightPanel = useMemo(() => {
    if (estimate) return <EstimatePanel estimate={estimate} />;
    return <EmptyState collected={collected} />;
  }, [estimate, collected]);

  return (
    <div className="min-h-dvh bg-canvas">
      <Header
        onOpenHistory={() => setHistoryOpen(true)}
        onNewProject={handleNewProject}
        historyCount={history.length}
      />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Chat */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 lg:h-[calc(100dvh-8rem)]">
              <ChatPanel
                messages={messages}
                loading={loading}
                ready={ready}
                estimating={estimating}
                hasEstimate={Boolean(estimate)}
                onSend={handleSend}
                onGenerate={handleGenerate}
              />
            </div>
          </div>

          {/* Resultados / estado inicial */}
          <div className="lg:col-span-7">{rightPanel}</div>
        </div>
      </main>

      <HistoryDrawer
        open={historyOpen}
        items={history}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleSelectHistory}
        onDelete={handleDeleteHistory}
        onClear={handleClearHistory}
      />
    </div>
  );
}
