# Prompts utilizados durante el desarrollo de Construct-IA

> Evidencia para el **requisito 7** de la guía: *"Documentar el uso de las
> herramientas de Inteligencia Artificial, incluyendo capturas de los prompts
> utilizados y una breve explicación de cómo contribuyeron al desarrollo."*

Este documento recoge los prompts reales de la conversación de desarrollo
sostenida con **Claude (Claude Code)**, la herramienta de IA usada como asistente
durante todo el ciclo del proyecto. No debe confundirse con los prompts *internos
de la aplicación* (los que Construct-IA envía a Google Gemini en tiempo de
ejecución), que están en [`server/src/prompts.js`](../server/src/prompts.js) y se
documentan en la sección 4.

Hay dos niveles de uso de IA en este proyecto:

| Nivel | Herramienta | Propósito |
|---|---|---|
| **IA como asistente de desarrollo** | Claude (Claude Code) | Generar el código, el diseño, la documentación y las evidencias. |
| **IA como funcionalidad del producto** | Google Gemini (`gemini-flash-latest`) | Motor del chatbot y de la estimación de costos dentro de la app. |

---

## 1. Prompt maestro consolidado

Este es el prompt único que resume toda la conversación: si se ejecutara de cero,
reproduciría el proyecto completo. Es la síntesis de las instrucciones dadas a lo
largo del desarrollo.

```text
Actúa como desarrollador full-stack senior y asistente de ingeniería de software.

CONTEXTO
Desarrollaremos "Construct-IA", el proyecto final de la asignatura Tópicos
Especiales I (Universidad Tecnológica de Panamá, FISC). Es un proyecto
universitario: debe mostrarse FUNCIONAL y estar bien DOCUMENTADO.
Te adjunto dos PDF: "Proyecto.pdf" (guía, requisitos y rúbrica del profesor) y
"Construct-IA.pdf" (la propuesta del equipo que se deriva de esa guía).
Léelos y ajústate a ellos.

PROBLEMA A RESOLVER
En Panamá, obtener un presupuesto de construcción exige contratar un profesional
y esperar días o semanas, con cotizaciones inconsistentes. Construct-IA debe
permitir que cualquier persona describa su proyecto en lenguaje natural y reciba
en segundos un estimado detallado, desglosado y ajustado al mercado panameño.

ALCANCE
- Aplicación web funcional completa (frontend + backend + IA integrada).
- Persistencia con localStorage: SIN base de datos y SIN login.

STACK OBLIGATORIO
- Frontend: React 18 + Vite + Tailwind CSS + Axios + jsPDF.
- Backend: Node.js + Express.
- IA: Google Gemini (usar el modelo gemini-flash-latest). NO usar Claude ni OpenAI
  como motor del producto.
- Control de versiones: Git + GitHub.

ARQUITECTURA
Cliente-servidor de dos capas. El backend actúa como PROXY SEGURO hacia Gemini:
la API key vive solo en el servidor (server/.env, ignorado por git) y nunca se
expone en el navegador. Endpoints REST: POST /api/chat y POST /api/estimate.

FUNCIONALIDADES
1. Chat inteligente: chatbot conversacional que recopila, en lenguaje natural y
   sin formularios: tipo de obra (casa nueva | remodelación | ampliación),
   área en m², número de cuartos, número de baños, nivel de acabados
   (básico | estándar | premium) y ubicación en Panamá.
2. Análisis por foto: el usuario puede adjuntar imágenes del espacio y Gemini las
   interpreta para enriquecer el estimado.
3. Estimador IA: genera un presupuesto en JSON estructurado.
4. Desglose de costos por 5 categorías (Estructura, Electricidad, Plomería,
   Acabados, Mano de obra) con rango mínimo y máximo, y costo por m².
5. Comparador de acabados: básico vs estándar vs premium.
6. Generador de PDF profesional descargable (jsPDF).
7. Historial de proyectos en localStorage.

INGENIERÍA DE PROMPTS (dentro de la app)
Diseña dos prompts de sistema especializados en el dominio de construcción en
Panamá, aislados en server/src/prompts.js, que FUERCEN salida JSON válida:
- Uno conversacional que devuelva { reply, collected, ready }.
- Uno de estimación que devuelva el presupuesto completo (categorías, totales,
  costo por m², comparativa de acabados, supuestos y disclaimer).
La salida estructurada es clave: permite un frontend determinista.

DISEÑO DE INTERFAZ
Estilo minimalista / Swiss: limpio, alto contraste, basado en grid.
Paleta: navy #1E3A5F (primario), verde #059669 (acento/costos), slate para
fondos. Tipografía: Poppins (títulos) + Open Sans (cuerpo).
Iconos SVG (lucide-react), nunca emojis como iconos. Responsive (móvil y
escritorio), accesible (contraste 4.5:1, focus visible, prefers-reduced-motion).

BUENAS PRÁCTICAS
Código modular y comentado en español, separación de responsabilidades
(routes / servicios / prompts / utilidades), manejo de errores, .env.example,
.gitignore que excluya node_modules y .env.

ENTREGABLES
1. Aplicación funcional ejecutable localmente (npm run dev levanta API y web).
2. README con instalación, uso, arquitectura y endpoints.
3. Documentación técnica con diagrama de arquitectura.
4. Evidencias: diagrama, capturas de la app funcionando y capturas de los prompts.

Antes de programar, hazme las preguntas necesarias para fijar el alcance.
Verifica que todo funcione de verdad (build y llamadas reales a la API) y
repórtame los resultados con honestidad.
```

---

## 2. Registro cronológico de prompts

Prompts reales de la conversación, en orden, con su aporte al proyecto.

### Fase 1 — Encuadre y análisis de requisitos

> «Dentro de la carpeta tendrás el contexto del proyecto que vamos a trabajar.
> Toma a consideración que es un proyecto universitario, solo debe de mostrarse
> funcional y documentarlo. Las indicaciones del proyecto están en el archivo
> "Proyecto" con indicaciones y métricas. El pdf "Construct-IA" vendría siendo la
> propuesta que sale del pdf de "Proyecto". […] Se usará Gemini para el modelo de
> inteligencia artificial para el chatbot. API_KEY: …»

**Contribución:** la IA leyó ambos PDF, extrajo los requisitos y la rúbrica, y
detectó que la propuesta debía adaptarse a Gemini. Definió el plan de trabajo.

### Fase 2 — Definición del alcance (decisiones del equipo)

> **Alcance:** «App funcional completa»
> **Datos:** «localStorage, sin login»

**Contribución:** fijó la arquitectura de dos capas sin base de datos ni
autenticación, simplificando la demo sin perder el historial de proyectos.

### Fase 3 — Diseño de interfaz

> «/ui-ux-pro-max»

**Contribución:** generó el sistema de diseño del producto (estilo Swiss/
minimalista, paleta navy + verde, tipografía Poppins/Open Sans y una checklist
de accesibilidad), que se aplicó en `client/src/index.css`.

### Fase 4 — Generación de código

*(derivado del prompt de la Fase 1)*

**Contribución:** generó el backend Express con el proxy a Gemini, los prompts
del dominio, los endpoints REST, y el frontend React completo (chat, desglose,
comparador, PDF, historial). Se verificó con build real y llamadas reales a la
API de Gemini.

### Fase 5 — Control de versiones

> «https://github.com/JeanSolano/ConstructIA-Proyecto-T-picos-.git
> haz el push del proyecto a este repo»

**Contribución:** inicializó el repositorio, verificó que la API key quedara
excluida por `.gitignore` y publicó el proyecto en GitHub.

### Fase 6 — Verificación del stack

> «usaste react y tailwind?»

**Contribución:** confirmación de que el stack entregado coincide con el
comprometido en la propuesta.

### Fase 7 — Presentación

> «Dentro de las conexiones de claude tienes canva. Hazme una presentación sobre
> esto. […] [los 9 requisitos de la guía]»

**Contribución:** generó el esquema de 12 diapositivas mapeado a los requisitos y
creó la presentación en Canva.

### Fase 8 — Consolidación documental

> «aquí está el documento principal de propuesta. Toma la información del
> documento y acóplala al ppt en canva. Terminé tomando la opción 1»
> **Decisiones:** nombre «Construct-IA»; contenido «a la app real construida».

**Contribución:** detectó las inconsistencias entre el documento (EstimIA,
Claude/OpenAI, formulario, PostgreSQL, tres capas) y la app real, y unificó todo
bajo Construct-IA + Gemini + chatbot + localStorage + dos capas.

### Fase 9 — Documento técnico con evidencias

> «Ahora haz un documento tomando la propuesta pero ya desarrollada con los
> puntos de la presentación […] Si el documento que generaste anteriormente ya lo
> tiene, agrégale las evidencias faltantes»

**Contribución:** produjo el documento técnico final de 12 secciones con las
evidencias embebidas (diagrama, app funcional y prompts).

### Fase 10 — Evidencias en la presentación

> «puedes ahora dentro de la presentación colocar las imágenes que obtuviste con
> playwright»

**Contribución:** insertó las capturas reales en las diapositivas 7, 8 y 10 de
la presentación de Canva.

### Fase 11 — Documentación de prompts

> «Créame el prompt de la conversación del desarrollo de este trabajo»

**Contribución:** este documento.

---

## 3. Aporte de la IA por etapa

| Etapa | Aporte concreto de la IA |
|---|---|
| Análisis | Lectura de los PDF, extracción de requisitos y rúbrica, plan de trabajo. |
| Diseño de interfaz | Sistema de diseño: paleta, tipografía, estilo y accesibilidad. |
| Generación de código | Backend Express + Gemini, frontend React completo, utilidades (PDF, storage, formato). |
| Ingeniería de prompts | Diseño de los dos prompts de dominio con salida JSON forzada. |
| Pruebas | Ejecución real del flujo (chat → estimado) y verificación del build. |
| Documentación | README, documentación técnica, diagramas y este registro de prompts. |
| Automatización | Capturas de evidencia automatizadas con Playwright; generación del .docx. |

---

## 4. Prompts internos de la aplicación

Además de los prompts de desarrollo, la aplicación usa dos prompts de sistema
propios, que son el corazón funcional del producto. Su código está en
[`server/src/prompts.js`](../server/src/prompts.js) y sus capturas en
[`docs/capturas/`](capturas/):

| Prompt | Archivo de captura | Función |
|---|---|---|
| `CHAT_SYSTEM_PROMPT` | `prompt-chat.png` | Convierte a Gemini en un asistente que recopila los datos del proyecto conversando y devuelve `{ reply, collected, ready }` en JSON. |
| `ESTIMATE_SYSTEM_PROMPT` | `prompt-estimacion.png` | Convierte a Gemini en un ingeniero presupuestista que devuelve el presupuesto completo en JSON. |

**Por qué son la contribución más importante de la IA:** trasladan el
conocimiento del dominio de construcción panameño al modelo y garantizan
respuestas estructuradas, lo que permite renderizar el desglose, el comparador y
el PDF de forma determinista y confiable.
