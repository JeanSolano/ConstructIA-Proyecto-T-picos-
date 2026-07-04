import { HardHat } from "lucide-react";

/**
 * Burbuja de un mensaje del chat. Diferencia usuario (derecha, navy) del
 * asistente (izquierda, superficie clara) y muestra la foto adjunta si existe.
 */
export default function MessageBubble({ role, text, image }) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""} animate-rise`}>
      {/* Avatar del asistente */}
      {!isUser && (
        <span className="mt-0.5 grid h-8 w-8 flex-none place-items-center rounded-lg bg-navy text-white">
          <HardHat className="h-4 w-4" />
        </span>
      )}

      <div className={`max-w-[82%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
        {image && (
          <img
            src={image}
            alt="Foto del espacio enviada por el usuario"
            className="max-h-52 rounded-xl border border-line object-cover"
          />
        )}
        {text && (
          <div
            className={
              isUser
                ? "rounded-2xl rounded-tr-sm bg-navy px-4 py-2.5 text-sm leading-relaxed text-white"
                : "rounded-2xl rounded-tl-sm border border-line bg-surface px-4 py-2.5 text-sm leading-relaxed text-ink shadow-[var(--shadow-card)]"
            }
          >
            {text.split("\n").map((line, i) => (
              <p key={i} className={i > 0 ? "mt-2" : ""}>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
