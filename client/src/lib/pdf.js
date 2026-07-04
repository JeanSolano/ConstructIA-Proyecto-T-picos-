/**
 * pdf.js — Generacion del reporte PDF del presupuesto con jsPDF.
 * Produce un documento profesional, descargable y listo para compartir.
 */
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { money, acabadoLabel } from "./format.js";

const NAVY = [30, 58, 95]; // --color-navy
const GREEN = [5, 150, 105]; // --color-brand-green
const INK = [15, 23, 42];
const SOFT = [71, 85, 105];

/**
 * Genera y descarga el PDF de un estimado.
 * @param {object} est respuesta del endpoint /estimate
 */
export function downloadEstimatePDF(est) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 54;

  // Encabezado de marca
  doc.setFillColor(...NAVY);
  doc.rect(0, 0, pageW, 88, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Construct-IA", margin, 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Estimado de costos de construccion · Panama", margin, 64);

  y = 120;

  // Datos del proyecto
  const p = est.proyecto || {};
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Resumen del proyecto", margin, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...SOFT);
  const resumen = doc.splitTextToSize(est.resumen || "", pageW - margin * 2);
  doc.text(resumen, margin, y);
  y += resumen.length * 13 + 10;

  const detalles = [
    ["Tipo de obra", p.tipoObra || "—"],
    ["Area", p.areaM2 ? `${p.areaM2} m²` : "—"],
    ["Cuartos / Banos", `${p.cuartos ?? "—"} / ${p.banos ?? "—"}`],
    ["Acabados", acabadoLabel(p.acabados)],
    ["Ubicacion", p.ubicacion || "—"],
  ];
  autoTable(doc, {
    startY: y,
    theme: "plain",
    margin: { left: margin, right: margin },
    styles: { fontSize: 10, cellPadding: 3, textColor: INK },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 130 } },
    body: detalles,
  });
  y = doc.lastAutoTable.finalY + 22;

  // Tabla de desglose por categoria
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...INK);
  doc.text("Desglose por categoria", margin, y);
  y += 10;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Categoria", "Minimo", "Maximo"]],
    body: (est.categorias || []).map((c) => [c.nombre, money(c.min), money(c.max)]),
    foot: [["TOTAL", money(est.totalMin), money(est.totalMax)]],
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: "bold" },
    footStyles: { fillColor: GREEN, textColor: 255, fontStyle: "bold" },
    styles: { fontSize: 10, cellPadding: 6 },
    columnStyles: { 1: { halign: "right" }, 2: { halign: "right" } },
  });
  y = doc.lastAutoTable.finalY + 18;

  // Costo por m2
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...SOFT);
  if (est.costoM2Min && est.costoM2Max) {
    doc.text(
      `Costo estimado por m²: ${money(est.costoM2Min)} – ${money(est.costoM2Max)}`,
      margin,
      y
    );
    y += 20;
  }

  // Comparativa de niveles
  if (Array.isArray(est.comparativa) && est.comparativa.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text("Comparativa por nivel de acabados", margin, y);
    y += 8;
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [["Nivel", "Total minimo", "Total maximo"]],
      body: est.comparativa.map((c) => [acabadoLabel(c.nivel), money(c.totalMin), money(c.totalMax)]),
      headStyles: { fillColor: NAVY, textColor: 255 },
      styles: { fontSize: 10, cellPadding: 6 },
      columnStyles: { 1: { halign: "right" }, 2: { halign: "right" } },
    });
    y = doc.lastAutoTable.finalY + 18;
  }

  // Supuestos + disclaimer
  if (Array.isArray(est.supuestos) && est.supuestos.length) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text("Supuestos:", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...SOFT);
    est.supuestos.forEach((s) => {
      const lines = doc.splitTextToSize(`•  ${s}`, pageW - margin * 2);
      doc.text(lines, margin, y);
      y += lines.length * 12;
    });
    y += 8;
  }

  doc.setFontSize(8);
  doc.setTextColor(...SOFT);
  const disc = doc.splitTextToSize(
    est.disclaimer ||
      "Estimado preliminar generado por IA. No sustituye una cotizacion profesional.",
    pageW - margin * 2
  );
  doc.text(disc, margin, doc.internal.pageSize.getHeight() - 40);

  const nombre = `Construct-IA_${(p.tipoObra || "estimado").replace(/\s+/g, "-")}.pdf`;
  doc.save(nombre);
}
