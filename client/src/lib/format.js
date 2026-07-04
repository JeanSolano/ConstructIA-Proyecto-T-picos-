/**
 * format.js — Utilidades de formato para la interfaz.
 */

/** Formatea un numero como moneda USD panamena (ej: "$12,500"). */
export function money(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return new Intl.NumberFormat("es-PA", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol", // muestra "$" en lugar de "USD"
    maximumFractionDigits: 0,
  }).format(Number(value));
}

/** Rango "min – max" formateado como moneda. */
export function moneyRange(min, max) {
  return `${money(min)} – ${money(max)}`;
}

/** Etiqueta legible para el nivel de acabados. */
export function acabadoLabel(nivel) {
  const map = { basico: "Básico", estandar: "Estándar", premium: "Premium" };
  return map[nivel] || nivel || "—";
}

/** Fecha corta legible (ej: "4 jul 2026, 3:20 p. m."). */
export function shortDate(iso) {
  try {
    return new Date(iso).toLocaleString("es-PA", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
