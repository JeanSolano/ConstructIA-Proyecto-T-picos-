/**
 * storage.js — Historial de proyectos en localStorage.
 * No hay backend de datos ni login: el historial vive en el navegador.
 */

const KEY = "constructia:historial";

/** Devuelve el arreglo de proyectos guardados (mas reciente primero). */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Guarda un estimado en el historial y devuelve la lista actualizada.
 * @param {object} estimate respuesta del endpoint /estimate
 */
export function saveEstimate(estimate) {
  const history = getHistory();
  const entry = {
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    estimate,
  };
  const next = [entry, ...history].slice(0, 50); // limita a 50 registros
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Elimina un proyecto por id y devuelve la lista actualizada. */
export function removeEstimate(id) {
  const next = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Vacia todo el historial. */
export function clearHistory() {
  localStorage.removeItem(KEY);
  return [];
}
