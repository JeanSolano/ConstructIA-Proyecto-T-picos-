# Guía para completar la presentación en Canva

Presentación editable:
**https://www.canva.com/d/DnjFoXt8lC2H2pv**

El contenido del PPT ya está alineado con la app real (Construct-IA, Gemini,
chatbot, localStorage, 2 capas). Faltan dos cosas que el conector de Canva no
permite automatizar y se hacen a mano en 1–2 minutos: **agregar la diapositiva
de Referencias** y **arrastrar las capturas**.

---

## 1. Diapositiva de Referencias (lista para pegar)

En Canva: botón **+** para añadir una diapositiva al final → pega este texto.

**Título:** Referencias bibliográficas

- Pressman, R. S., & Maxim, B. R. (2024). *Software engineering: A practitioner's approach* (10.ª ed.). McGraw-Hill Education.
- Sommerville, I. (2020). *Software engineering* (10.ª ed.). Pearson.
- Russell, S., & Norvig, P. (2021). *Artificial intelligence: A modern approach* (4.ª ed.). Pearson.
- Google. (2024). *Gemini API documentation*. https://ai.google.dev/gemini-api/docs
- Meta. (2024). *React documentation*. https://react.dev
- Tailwind Labs. (2024). *Tailwind CSS documentation*. https://tailwindcss.com
- Axios. (s. f.). *Axios — Promise based HTTP client*. https://axios-http.com

> Nota: se reemplazaron las referencias de Claude/OpenAI del documento original
> por la documentación de **Google Gemini**, que es la IA que realmente usa la app.

---

## 2. Capturas y en qué diapositiva va cada una

Para arrastrar una imagen en Canva: menú **Subir → Subir archivos**, luego
arrástrala a la diapositiva.

| Imagen | Archivo / cómo obtenerla | Diapositiva destino |
|---|---|---|
| **Diagrama de arquitectura** | Ya generado: [`docs/capturas/arquitectura.svg`](capturas/arquitectura.svg) | "Arquitectura de software" |
| **App – chat inicial** | Captura de pantalla de la app corriendo (pantalla de inicio del chat) | "Funcionalidades principales" |
| **App – estimado generado** | Captura del panel de resultados (total + desglose) | "Implementación funcional" |
| **Prompts de IA** | Captura de [`server/src/prompts.js`](../server/src/prompts.js) en el editor | "Uso de IA durante el desarrollo" |

### Cómo tomar las capturas de la app

1. En una terminal, desde la raíz del proyecto: `npm run dev`
2. Abre http://localhost:5173
3. **Captura 1 (chat inicial):** captura la pantalla de bienvenida.
4. **Captura 2 (estimado):** escribe en el chat, por ejemplo:
   *"Casa nueva de 120 m², 3 cuartos, 2 baños, acabados estándar, en Ciudad de
   Panamá"*, pulsa **Generar estimado** y captura el desglose de costos.
5. En Windows, `Win + Shift + S` recorta y copia; pégala directo en Canva.

> El diagrama de arquitectura (`arquitectura.svg`) ya está listo: Canva admite
> arrastrar archivos `.svg` directamente.

---

## 3. Requisitos de la guía cubiertos por la presentación

| # | Requisito | Diapositiva(s) |
|---|-----------|----------------|
| 1 | Problemática y justificación | Problemática · Justificación |
| 2 | Objetivo general y específicos | Objetivos |
| 3 | Descripción (propósito, alcance, usuarios, funcionalidades) | Descripción · Funcionalidades |
| 4 | Herramientas de IA utilizadas | Herramientas de IA |
| 5 | Arquitectura + diagrama | Arquitectura (+ `arquitectura.svg`) |
| 6 | Aplicación funcional | Implementación funcional |
| 7 | Uso de IA en el desarrollo (prompts) | Uso de IA durante el desarrollo |
| 8 | Documento técnico | README.md + docs/ |
| 9 | Demostración final | Implementación funcional |
