import { useRef, useState } from "react";
import { Send, ImagePlus, X } from "lucide-react";

/**
 * Caja de entrada del chat: texto multilinea + adjuntar una foto opcional.
 * Convierte la imagen a data URL antes de enviarla.
 */
export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // data URL
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
    e.target.value = ""; // permite volver a elegir la misma imagen
  }

  function submit() {
    const trimmed = text.trim();
    if ((!trimmed && !image) || disabled) return;
    onSend(trimmed, image);
    setText("");
    setImage(null);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-line bg-surface p-3">
      {image && (
        <div className="mb-2 flex items-center gap-2">
          <div className="relative">
            <img src={image} alt="Vista previa" className="h-16 w-16 rounded-lg border border-line object-cover" />
            <button
              type="button"
              onClick={() => setImage(null)}
              aria-label="Quitar imagen"
              className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-white shadow"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-xs text-ink-soft">Foto lista para enviar</span>
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          aria-label="Adjuntar foto del espacio"
          className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-line text-ink-soft transition-colors hover:bg-canvas hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-navy disabled:opacity-50"
        >
          <ImagePlus className="h-5 w-5" />
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="Describe tu proyecto o responde al asistente…"
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:border-navy focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/30 disabled:opacity-60"
        />

        <button
          type="button"
          onClick={submit}
          disabled={disabled || (!text.trim() && !image)}
          aria-label="Enviar mensaje"
          className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-brand-green text-white transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
