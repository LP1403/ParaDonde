# Contexto del chat para otro agente

Archivo generado para pasar a otro agente el contexto de este chat y del proyecto **Para Dónde?**.

---

## 1. Proyecto

- **App:** "Para Dónde?" (Paradonde) – guía de viajes para Argentina.
- **Repo:** `c:\Repos\Brainstorming`; código de la app en **`Paradonde/`**.
- **Stack:** React + TypeScript (Vite) + Ionic React + React Router + Firebase (Hosting, Analytics) + Capacitor.
- **Proyecto Firebase:** `para-donde`.

**Funcionalidades principales:**
- **Elige tu aventura:** flujo de preguntas (compañía, experiencia, presupuesto, días) → resultado con destinos sugeridos.
- **Guías temáticas:** documentación para viajar, derechos del pasajero, equipaje, qué llevar, pagar en el exterior.
- **Calculadora dólar tarjeta** (DolarAPI).

---

## 2. Lo que se hizo en este chat

### 2.1 Tema visual
- Inspiración en [Argentina.gob.ar](https://www.argentina.gob.ar/) (colores y estilo).
- En **`src/theme/theme.css`**: paleta con azul `#1976d2`, fondos claros, bordes suaves (`--pd-color-primary`, `--pd-color-bg`, `--pd-border`, etc.).

### 2.2 Layout general
- Clase **`.pd-content`**: `max-width: 720px`, padding horizontal, centrado. Usada en todas las páginas (Home, Aventura, ResultadoAventura, Destino, GuiasTematicas, GuiaTematica, CalculadoraDolar) para que el contenido no esté pegado a los bordes ni ocupe todo el ancho.

### 2.3 Guía "Documentación para viajar"
- En **`src/data/guias.ts`**: la guía `documentacion-viajar` tiene **secciones**:
  - **Estados Unidos:** pasaporte, visa/ESTA, seguro + links (Embajada EE.UU., ESTA, Argentina.gob.ar).
  - **España:** pasaporte, Schengen 90 días, seguro + links (Embajada España, Cancillería, Argentina.gob.ar).
  - **MERCOSUR:** solo DNI, menores, seguro + links (Cancillería, Argentina.gob.ar).
- En **`src/pages/GuiaTematica.tsx`** se renderiza `guia.secciones` cuando existe: título por sección, cuerpo y lista de enlaces.

### 2.4 Elige tu aventura – cuadrantes con imagen
- **Datos (`src/data/aventura.ts`):**
  - `OpcionAventura` tiene campo opcional **`imageUrl?: string`**.
  - Cada opción tiene una URL de Unsplash acorde (compañía: solo, pareja, amigos, familia; experiencia: playa, montaña, ciudad, aventura, gastronomía, termas; presupuesto y días con imágenes genéricas de viaje).
  - Helper `U(id)` arma la URL: `https://images.unsplash.com/photo-${id}?w=600&q=80&fit=crop`.
- **UI (`src/pages/Aventura.tsx`):**
  - Lista de radios reemplazada por una **cuadrícula de cuadrantes** (2 columnas).
  - Cada opción es un **cuadrado clickeable** (`<button>`) con:
    - `background-image` (URL + overlay lineal oscuro para legibilidad),
    - label abajo en blanco con sombra,
    - estado seleccionado con borde azul (clase `aventura-cuadrante--selected`).
  - Al hacer click se actualiza `respuestas[pregunta.id] = op.id` (misma lógica que antes con el radio).
- **Estilos (`src/theme/theme.css`):**
  - **`.aventura-grid`:** grid 2 columnas, gap.
  - **`.aventura-cuadrante`:** aspect-ratio 1, bordes redondeados, `background-size: cover`, hover y estado seleccionado.
  - **`.aventura-cuadrante-label`:** texto blanco, font-weight 600, text-shadow. Si no hay imagen de fondo, se usa texto oscuro (selector con `:not([style*="backgroundImage"])`).

---

## 3. Archivos relevantes

| Ruta | Descripción |
|------|-------------|
| `Paradonde/src/theme/theme.css` | Variables del tema, `.pd-content`, estilos de aventura (grid, cuadrante, label), enlaces en guías |
| `Paradonde/src/data/aventura.ts` | `preguntasAventura`, `OpcionAventura` (id, label, imageUrl?), `PreguntaAventura` |
| `Paradonde/src/data/guias.ts` | Guías temáticas; `documentacion-viajar` con `secciones` (EEUU, España, MERCOSUR) |
| `Paradonde/src/data/destinos.ts` | Listado de destinos para el motor de aventura |
| `Paradonde/src/pages/Aventura.tsx` | Flujo por pasos, grid de cuadrantes, sessionStorage para respuestas, navegación a `/aventura/resultado?…` |
| `Paradonde/src/pages/GuiaTematica.tsx` | Render de una guía; si tiene `secciones`, muestra título por sección + cuerpo + links |
| `Paradonde/src/logic/motorAventura.ts` | Filtra destinos según respuestas del flujo aventura |

---

## 4. Comandos útiles

```bash
cd c:\Repos\Brainstorming\Paradonde
npm install
npm run dev    # desarrollo
npm run build  # build (ya probado, sin errores)
firebase use para-donde
firebase deploy
```

En PowerShell usar `;` en lugar de `&&` para encadenar comandos.

---

## 5. Notas para el otro agente

- **Plan del proyecto:** existe `PLAN-VIAJES-v0.md` en la raíz del repo; no editar el plan salvo que el usuario lo pida.
- **Imágenes Unsplash:** las URLs están en `aventura.ts`; se pueden cambiar los IDs de foto si se quieren otras imágenes.
- **Build:** el último build (`npm run build`) termina correctamente; no hay tareas pendientes de este chat que rompan la compilación.

Si el usuario pide más cambios en la aventura, las guías o el tema, este documento da el contexto suficiente para seguir desde aquí.
