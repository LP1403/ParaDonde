# Contexto completo — App «Para Dónde?»

Documento para transferir contexto a otro asistente o dev (p. ej. Claude Code) antes de pedir cambios.

---

## 1. Qué es

- **Producto:** guía de viajes centrada en **Argentina** (y destinos internacionales en el catálogo).
- **Objetivo UX:** ayudar a elegir destinos (motor «Elige tu aventura»), leer guías temáticas, usar calculadora de dólar tarjeta, y guardar **destinos favoritos** / **vuelos** asociados a un destino cuando el usuario tiene el lugar en «Mis viajes».

---

## 2. Stack técnico

| Capa | Tecnología |
|------|------------|
| UI | **React 19** + **TypeScript** |
| Shell móvil | **Ionic React** (`IonApp`, `IonPage`, `IonContent` en páginas) |
| Routing | **React Router v7** (`BrowserRouter`, rutas en `App.tsx`) |
| Build | **Vite 8** |
| Backend BaaS | **Firebase** (proyecto `para-donde`: Hosting, Analytics; Auth con Google u otros según config) |
| Mobile | **Capacitor** (Android en repo; scripts en `package.json`) |

**APIs externas (desde el cliente o vía proxy):**

- **DolarAPI** (u similar) — calculadora dólar tarjeta.
- **Aviationstack** — estado de vuelos en la sección «Tus vuelos» (solo si hay `VITE_AVIATIONSTACK_ACCESS_KEY`).

---

## 3. Estructura de carpetas relevante

```
src/
  App.tsx                 # Rutas principales
  main.tsx                # Entry + providers si aplica
  theme/theme.css         # Tema global, variables --pd-*, componentes .pd-*
  firebase.ts             # Init Firebase
  context/AuthContext.tsx # Auth React
  data/
    destinos.ts           # Catálogo Destino (slug, nombre, guía, etc.)
    guias.ts              # Guías temáticas (secciones, slugs)
    aventura.ts           # Opciones del flujo aventura (estático)
    aventuraDinamica.ts   # Variante / datos dinámicos del motor
    terminos.ts           # Términos legales
    wikiImages.ts         # Imágenes locales wiki
  logic/
    motorAventura.ts      # Motor que elige destinos según respuestas
    motorAventuraDinamico.ts
    destinosFavoritosStorage.ts   # Favoritos (localStorage)
    vueloFavoritoStorage.ts         # Vuelos guardados por slug (varios por destino)
    vueloDestinoCoincidencia.ts     # Valida que el vuelo coincida con el destino (IATA + texto)
    aventuraStorage.ts, destinosHomeStorage.ts, etc.
  services/
    aviationStack.ts      # Cliente API vuelos (fetch, rowToDisplay)
  components/
    PdSubpageChrome.tsx   # Chrome común subpáginas
    PdUserMenu.tsx          # Menú usuario
    PdFavoritoDestinoButton.tsx
    PdVueloFavoritoSection.tsx  # UI «Tus vuelos» en ficha destino
    ...
  pages/
    Home.tsx, Aventura.tsx, ResultadoAventura.tsx, Destino.tsx
    GuiasTematicas.tsx, GuiaTematica.tsx, CalculadoraDolar.tsx
    MisViajes.tsx, Login.tsx, Register.tsx, Cuenta.tsx, Terminos.tsx
```

**Raíz:** `vite.config.ts` (incluye **proxy dev** `/api/aviationstack` → `api.aviationstack.com` por CORS), `capacitor.config.*`, `firebase.json`, `android/` (Capacitor).

---

## 4. Rutas (`src/App.tsx`)

| Ruta | Página |
|------|--------|
| `/` | Home |
| `/aventura` | Elige tu aventura |
| `/aventura/resultado` | Resultados del motor |
| `/destino/:slug` | Ficha destino |
| `/guias` | Listado guías |
| `/guias/:slug` | Guía temática |
| `/calculadora-dolar` | Calculadora |
| `/login`, `/registro` | Auth |
| `/viajes` | Mis viajes (destinos favoritos) |
| `/cuenta` | Cuenta |
| `/terminos` | Términos |

---

## 5. Convenciones de UI

- **Tema:** `src/theme/theme.css` — paleta azul Material-style (`#1976d2`), variables `--pd-color-*`.
- **Contenedor:** clase **`.pd-content`** (ancho máximo ~720px, centrado) en páginas de contenido.
- **Prefijo componentes** propios: muchos usan `pd-` (ej. `pd-vuelo-card`, `pd-destino-glass-section`).
- **Tema claro/oscuro:** clase `html.pd-light` para overrides.

---

## 6. Datos y motores

- **Destinos:** `src/data/destinos.ts` — `Destino` con `slug`, `nombre`, `guia`, `documentacion`, imágenes, etc. Motor de aventura y enlaces usan **slug**.
- **Guías:** `src/data/guias.ts` — entradas con `slug`, secciones, links.
- **Aventura:** `src/data/aventura.ts` + lógica `motorAventura.ts` / `motorAventuraDinamico.ts`; estado de sesión en **sessionStorage** donde aplique (ver páginas Aventura / Resultado).

---

## 7. Favoritos y «Mis viajes»

- **Destinos favoritos:** `destinosFavoritosStorage.ts` (localStorage), eventos tipo `pd-favoritos-changed`.
- **Página `/viajes`:** `MisViajes.tsx` — lista destinos guardados.
- Botón favorito en ficha/resultado: `PdFavoritoDestinoButton.tsx`.

---

## 8. Feature «Tus vuelos» (ficha destino)

**Cuándo se muestra:** en `Destino.tsx`, componente `PdVueloFavoritoSection`, **solo si** el destino está en favoritos (`isFavoriteDestino(slug)`).

**Flujo:**

1. Usuario ingresa **código IATA del vuelo** (ej. `FO5244`) y **fecha** (la fecha no se envía como filtro en la API en el flujo actual; sirve para elegir la fila correcta entre varias respuestas para el mismo número).
2. `fetchFlightByIata` en `services/aviationStack.ts` llama al endpoint `/v1/flights` con `flight_iata` (+ `access_key`). **Una sola request** (sin `flight_date` en query) por limitaciones del plan gratuito; la fecha se aplica en cliente con `pickRowForDate`.
3. **Validación destino:** `vueloCoincideConDestino` en `vueloDestinoCoincidencia.ts` — el vuelo debe tocar el destino (IATA por mapa `IATA_POR_SLUG` + matching de nombre/slug en textos de aeropuertos). Si no coincide, error y **no** se guarda.
4. **Persistencia:** `vueloFavoritoStorage.ts` — clave **`paradonde_vuelo_favorito_por_slug_v2`**, estructura **array de vuelos por slug**. Cada vuelo tiene `id` estable `CODIGO|AAAA-MM-DD` (upsert: mismo código+fecha actualiza). Migración automática desde `v1` (objeto único por slug).
5. **UI:** varias cards estilo tablero, **Actualizar datos** por card (re-fetch), **Quitar este vuelo**, **Quitar todos**, formulario para agregar otro vuelo.

**Dev:** `vite` proxy `/api/aviationstack` → evita CORS. **Producción estática:** puede hacer falta proxy backend; la clave en `VITE_*` va en el bundle (no es secreta frente al usuario).

**Mensajes de error al usuario:** genéricos, sin mencionar proveedores ni detalles de API.

---

## 9. Variables de entorno (`.env`)

Ver **`.env.example`**. Destacadas:

- `VITE_FIREBASE_*` — Firebase web app.
- `VITE_AVIATIONSTACK_ACCESS_KEY` — opcional; sin esto la consulta de vuelos muestra que no está disponible.

**Importante:** variables `VITE_*` se inyectan en build y son visibles en el cliente.

---

## 10. Auth

- `context/AuthContext.tsx` + Firebase Auth.
- Páginas Login / Register / Cuenta; menú `PdUserMenu.tsx`.

---

## 11. Comandos útiles

```bash
npm run dev          # Vite dev server
npm run build        # tsc + vite build
firebase use para-donde
firebase deploy      # hosting (según proyecto)
```

**PowerShell:** encadenar con `;` en lugar de `&&` (convención del equipo).

---

## 12. Archivos / políticas del repo

- **No editar** `PLAN-VIAJES-v0.md` salvo petición explícita del usuario.
- Reglas Cursor: `.cursor/rules/proyecto-para-donde.mdc` (resumen stack y convenciones).

---

## 13. Checklist para modificaciones

Antes de tocar código nuevo:

1. ¿Afecta **destinos**? → `destinos.ts` + slugs enlazados en UI.
2. ¿Afecta **vuelos**? → `aviationStack.ts` + `vueloFavoritoStorage.ts` + `vueloDestinoCoincidencia.ts` + `PdVueloFavoritoSection.tsx` + estilos `theme.css` (`pd-vuelo-*`).
3. ¿Afecta **favoritos**? → `destinosFavoritosStorage.ts` + `MisViajes.tsx`.
4. ¿Nueva ruta? → `App.tsx` + página en `pages/`.
5. ¿Estilos globales? → `theme.css`, respetar `.pd-content` y variables `--pd-*`.

---

*Última actualización orientativa: documento generado para handoff de contexto; alinear con el repo si hay divergencias.*
