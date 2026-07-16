# Documentación técnica — Construct-IA

Este documento complementa el [README](../README.md) con los diagramas y la
descripción técnica de la organización del sistema.

---

## 1. Arquitectura general

Construct-IA usa una arquitectura **cliente–servidor de dos capas** con la IA
como servicio externo. El backend es un *proxy seguro*: encapsula la clave de
Gemini y la lógica de prompts, exponiendo una API REST simple al frontend.

```mermaid
flowchart LR
    subgraph Cliente["Navegador del usuario"]
        UI["React SPA<br/>(Vite + Tailwind)"]
        LS[("localStorage<br/>historial")]
        UI <--> LS
    end

    subgraph Servidor["Backend Node.js / Express"]
        API["API REST"]
        PROMPT["Módulo de prompts"]
        GEM["Cliente Gemini"]
        API --> PROMPT --> GEM
    end

    IA["Google Gemini API<br/>gemini-flash-latest"]

    UI -- "POST /api/chat<br/>POST /api/estimate" --> API
    API -- "JSON" --> UI
    GEM -- "HTTPS" --> IA
    IA -- "JSON" --> GEM
```

---

## 2. Flujo de una estimación

```mermaid
sequenceDiagram
    actor U as Usuario
    participant C as Frontend (React)
    participant S as Backend (Express)
    participant G as Gemini

    U->>C: Describe su proyecto (chat / foto)
    C->>S: POST /api/chat { messages, image }
    S->>G: Prompt de conversación + historial
    G-->>S: { reply, collected, ready }
    S-->>C: { reply, collected, ready }
    C-->>U: Muestra respuesta y progreso (n/6)

    Note over C,U: Cuando ready = true, aparece<br/>el botón "Generar estimado"

    U->>C: Clic en "Generar estimado"
    C->>S: POST /api/estimate { project, images }
    S->>G: Prompt de estimación (datos del proyecto)
    G-->>S: Presupuesto desglosado (JSON)
    S-->>C: Presupuesto
    C->>C: Guarda en localStorage
    C-->>U: Desglose + comparador + PDF
```

---

## 3. Capas y responsabilidades

### Capa de presentación (frontend)
- **`App.jsx`** — orquesta el estado (mensajes, datos recopilados, estimado,
  historial) y coordina las llamadas a la API.
- **`components/`** — UI modular: `Header`, `ChatPanel`, `ChatInput`,
  `MessageBubble`, `EstimatePanel`, `CostBreakdown`, `Comparator`,
  `HistoryDrawer`, `EmptyState`.
- **`lib/`** — utilidades: `api.js` (Axios), `pdf.js` (jsPDF), `storage.js`
  (localStorage) y `format.js` (moneda/fechas).

### Capa de lógica de negocio (backend)
- **`routes/chat.js`** — endpoint conversacional; traduce el historial al
  formato de Gemini y adjunta imágenes.
- **`routes/estimate.js`** — valida los datos del proyecto y solicita el
  presupuesto estructurado.
- **`prompts.js`** — instrucciones de sistema (ingeniería de prompts) del
  dominio de construcción panameño.
- **`gemini.js`** — envoltura del SDK: fuerza salida JSON y la parsea de forma
  robusta.

### Servicios externos
- **Google Gemini** (`gemini-flash-latest`) — procesamiento de lenguaje natural,
  análisis de imágenes y generación del estimado.

---

## 4. Modelo de datos (en memoria / localStorage)

No hay base de datos relacional. Las entidades relevantes se representan como
objetos JSON:

```mermaid
classDiagram
    class Proyecto {
        string tipoObra
        number areaM2
        number cuartos
        number banos
        string acabados
        string ubicacion
    }
    class Estimado {
        string resumen
        string moneda
        number totalMin
        number totalMax
        number costoM2Min
        number costoM2Max
        string[] supuestos
        string disclaimer
    }
    class Categoria {
        string nombre
        number min
        number max
        string detalle
    }
    class NivelComparativa {
        string nivel
        number totalMin
        number totalMax
    }
    class EntradaHistorial {
        string id
        string createdAt
    }
    Estimado "1" --> "1" Proyecto
    Estimado "1" --> "5" Categoria
    Estimado "1" --> "3" NivelComparativa
    EntradaHistorial "1" --> "1" Estimado
```

---

## 5. Decisiones de diseño

| Decisión | Justificación |
|---|---|
| **Gemini en lugar de Claude/OpenAI** | Nivel gratuito suficiente para la demo académica. |
| **Backend como proxy** | Mantiene la clave de API fuera del navegador (buena práctica de seguridad). |
| **localStorage en vez de PostgreSQL** | Simplifica la demo sin sacrificar la funcionalidad de historial. |
| **Salida JSON forzada del modelo** | Permite un frontend determinista (desglose, comparador, PDF) a partir de la IA. |
| **Estilo Swiss / minimalista** | Transmite confianza y profesionalismo, adecuado para un estimador de costos. |
