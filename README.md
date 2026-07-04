# Construct-IA

**Estimador de costos de construcción y remodelación para Panamá, asistido por inteligencia artificial.**

Construct-IA es una aplicación web que permite a cualquier persona describir su
proyecto de construcción en lenguaje natural —a través de un chatbot— y recibir
en segundos un presupuesto detallado, desglosado por categorías y ajustado al
mercado panameño, con opción de descargar un reporte PDF profesional.

> Proyecto final de la asignatura **Tópicos Especiales** · Lic. en Desarrollo y
> Gestión de Software · Universidad Tecnológica de Panamá.

---

## Tabla de contenido

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Estructura del proyecto](#estructura-del-proyecto)
- [API del backend](#api-del-backend)
- [Uso de IA durante el desarrollo](#uso-de-ia-durante-el-desarrollo)
- [Notas y limitaciones](#notas-y-limitaciones)

---

## Características

| Funcionalidad | Descripción |
|---|---|
| 💬 **Chat inteligente** | Chatbot conversacional que recopila los datos del proyecto en lenguaje natural, sin formularios. |
| 📷 **Análisis por foto** | El usuario puede adjuntar fotos del espacio; la IA (Gemini) las analiza para enriquecer el estimado. |
| 🧮 **Estimador IA** | Genera un presupuesto desglosado usando la API de Google Gemini. |
| 📊 **Desglose de costos** | Costos separados por Estructura, Electricidad, Plomería, Acabados y Mano de obra, con rango mínimo–máximo. |
| ⚖️ **Comparador de acabados** | Compara el costo total entre acabados básico, estándar y premium. |
| 📄 **Generador de PDF** | Exporta el presupuesto completo en un PDF profesional descargable. |
| 🗂️ **Historial de proyectos** | Guarda los estimados anteriores en el navegador (localStorage), sin necesidad de cuenta. |

---

## Arquitectura

Arquitectura cliente–servidor de dos capas. El backend actúa como **proxy
seguro** hacia Gemini para que la clave de API nunca se exponga en el navegador.

```
┌──────────────────────────┐        REST/JSON        ┌──────────────────────────┐
│      Frontend (SPA)       │  ───────────────────▶   │     Backend (Express)     │
│  React + Tailwind + Vite  │                         │       Node.js API         │
│                           │  ◀───────────────────   │                           │
│  · Chat conversacional    │        /api/chat        │  · Construcción de prompts │
│  · Desglose y comparador  │        /api/estimate    │  · Proxy seguro a Gemini  │
│  · Generación de PDF      │                         │  · Validación de datos    │
│  · Historial localStorage │                         └────────────┬─────────────┘
└──────────────────────────┘                                       │ HTTPS
                                                                    ▼
                                                        ┌──────────────────────┐
                                                        │  Google Gemini API    │
                                                        │  (gemini-2.5-flash)   │
                                                        └──────────────────────┘
```

- **Persistencia:** el historial vive en `localStorage` del navegador. No hay
  base de datos ni autenticación (decisión de alcance para la demo académica).
- **Seguridad de la clave:** `GEMINI_API_KEY` solo existe en el servidor
  (`server/.env`), nunca en el bundle del cliente.

---

## Tecnologías

**Frontend**
- React 18 + Vite 5
- Tailwind CSS 4 (tokens de diseño propios)
- Axios (cliente HTTP)
- jsPDF + jspdf-autotable (reportes PDF)
- lucide-react (iconografía SVG)

**Backend**
- Node.js + Express 4
- `@google/genai` (SDK oficial de Google Gemini)
- dotenv, cors

**Inteligencia Artificial**
- Google Gemini (`gemini-2.5-flash`) — motor de estimación y del chatbot.
- Ingeniería de prompts especializada para el dominio de construcción en Panamá
  (ver [`server/src/prompts.js`](server/src/prompts.js)).

---

## Requisitos previos

- **Node.js 18+** y npm.
- Una **clave de API de Google Gemini** (gratuita en
  <https://aistudio.google.com/apikey>).

---

## Instalación y ejecución

### 1. Configurar la clave de Gemini

```bash
cd server
cp .env.example .env      # en Windows PowerShell: copy .env.example .env
# edita .env y coloca tu GEMINI_API_KEY
```

### 2. Instalar dependencias

```bash
# desde la raíz del proyecto
npm run install:all
```

> Si prefieres hacerlo manual: `npm install` dentro de `server/` y de `client/`.

### 3. Ejecutar en modo desarrollo

**Opción A — un solo comando (recomendada):**

```bash
npm run dev        # levanta backend (3001) y frontend (5173) a la vez
```

**Opción B — dos terminales:**

```bash
# Terminal 1 (backend)
npm --prefix server start

# Terminal 2 (frontend)
npm --prefix client run dev
```

Luego abre <http://localhost:5173>.

El frontend redirige automáticamente las llamadas `/api` al backend mediante el
proxy de Vite, así que no hay que preocuparse por CORS en desarrollo.

---

## Estructura del proyecto

```
Construct-IA/
├── client/                  # Frontend React + Vite
│   ├── src/
│   │   ├── components/       # Header, ChatPanel, EstimatePanel, etc.
│   │   ├── lib/              # api, pdf, storage, format
│   │   ├── App.jsx           # Orquestador de estado y flujo
│   │   ├── main.jsx
│   │   └── index.css         # Tokens del sistema de diseño (Tailwind v4)
│   └── vite.config.js        # Proxy /api → backend
│
├── server/                  # Backend Express
│   ├── src/
│   │   ├── routes/           # chat.js, estimate.js
│   │   ├── gemini.js         # Envoltura del SDK de Gemini
│   │   ├── prompts.js        # Ingeniería de prompts del dominio
│   │   └── index.js          # App Express
│   ├── .env.example
│   └── package.json
│
├── docs/                    # Documentación técnica adicional
└── README.md
```

---

## API del backend

| Método | Ruta | Descripción |
|---|---|---|
| `GET`  | `/api/health` | Estado del servidor y modelo configurado. |
| `POST` | `/api/chat` | Conversa con el chatbot. Body: `{ messages, image? }`. Devuelve `{ reply, collected, ready }`. |
| `POST` | `/api/estimate` | Genera el estimado. Body: `{ project, images? }`. Devuelve el presupuesto desglosado. |

Ejemplo:

```bash
curl -X POST http://localhost:3001/api/estimate \
  -H "Content-Type: application/json" \
  -d '{"project":{"tipoObra":"casa nueva","areaM2":120,"cuartos":3,"banos":2,"acabados":"estandar","ubicacion":"Ciudad de Panama"}}'
```

---

## Uso de IA durante el desarrollo

Conforme a los requisitos de la asignatura, se usaron herramientas de IA en
varias etapas del ciclo de desarrollo:

| Etapa | Uso de IA |
|---|---|
| **Generación de código** | Componentes React, endpoints Express y utilidades generados con asistencia de IA (Claude / Gemini). |
| **Diseño de interfaz** | Sistema de diseño (paleta navy + verde, tipografía Poppins/Open Sans, estilo Swiss/minimalista) definido con apoyo de IA. |
| **Ingeniería de prompts** | Prompts del dominio de construcción diseñados y refinados con IA. |
| **Consumo de API de IA** | Integración directa de Google Gemini como motor de estimación (funcionalidad núcleo). |
| **Documentación** | Comentarios de código y este README asistidos por IA. |

---

## Notas y limitaciones

- Los montos son **estimados preliminares generados por IA** y no sustituyen una
  cotización profesional.
- Al ser una demo académica, el historial no se sincroniza entre dispositivos
  (vive en el navegador).
- El modelo por defecto es `gemini-2.5-flash`; puede cambiarse con la variable
  `GEMINI_MODEL` en `server/.env`.
- La clave incluida en el repositorio es solo para la demostración del curso;
  en un entorno real debe mantenerse privada y fuera del control de versiones.

---

_Universidad Tecnológica de Panamá — Facultad de Ingeniería de Sistemas Computacionales._
