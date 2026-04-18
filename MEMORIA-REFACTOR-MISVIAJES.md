# MEMORIA — Refactor `Mis viajes` (cards con fade de imagen)

> Registro continuo de **todo** lo modificado en el refactor de la página `/viajes`.
> Fecha: 2026-04-17 — Autor: Claude (Cowork) + Lucas.

---

## 1. Objetivo del refactor

En la pantalla **`/viajes` (`MisViajes.tsx`)**, las cards de destinos guardados tenían:

- Kicker (país) + título + descripción
- `Ver ficha completa →` (link primario)
- `Quitar de la lista` **debajo**, en una fila separada

Lucas pidió dos cambios:

1. **Layout del footer**: `Quitar de la lista` debe ir **a la derecha** y **a la misma altura** que `Ver ficha completa` (link sutil, alineado a la derecha).
2. **Fondo de la card**: el bloque con país + destino + descripción debe tener como background un **fade de la imagen principal del destino** (hero), con overlay para que el texto siga legible en dark/light.

---

## 2. Análisis de look & feel existente

### Tema (`src/theme/theme.css`)

- Dark por defecto (`:root`), light con `html.pd-light`.
- Variables clave: `--pd-color-text`, `--pd-color-text-muted`, `--pd-color-primary`, `--pd-card-bg`, `--pd-border`, `--pd-radius-lg` (18px), `--pd-shadow-card`.
- Ya existen overlays gradient para imágenes de fondo (ej. `.pd-aventura-bg-overlay--dark` / `--light`), uso el mismo patrón.

### Cards actuales (`.pd-misviajes-card`)

```
border-radius: var(--pd-radius-lg);
border: 1px solid var(--pd-border);
background: var(--pd-card-bg);
padding: 1rem 1.05rem;
box-shadow: 0 2px 12px rgba(0,0,0,.04);
```

El footer (`.pd-misviajes-card-actions`) hoy es `flex-direction: column` con `border-top` separador → lo paso a `row` con `justify-content: space-between` y mantengo el separador sutil.

### Imagen principal del destino

Jerarquía acordada con Lucas:

1. **Imágenes locales** por `destino.id` → `wikiImages[destino.id][0]` (ej. `/images/destinos/bariloche/1.jpg`).
2. **Fallback**: `destino.imageUrl` (Unsplash/picsum) si no hay local.
3. Si no hay ninguna → la card cae al color `--pd-card-bg` (comportamiento actual), sin romper.

No llamo a la API de Wikipedia acá (sería overkill para una lista). Uso solo lo que hay en `src/data/wikiImages.ts` + el `imageUrl` del destino.

---

## 3. Plan de cambios

| # | Archivo | Tipo | Resumen |
|---|---------|------|---------|
| 1 | `src/pages/MisViajes.tsx` | EDIT | Reestructurar JSX: wrapper con bg, overlay, y footer horizontal |
| 2 | `src/theme/theme.css` | EDIT | Reemplazar estilos `.pd-misviajes-card*` por versión con bg-image + footer horizontal |
| 3 | `MEMORIA-REFACTOR-MISVIAJES.md` | NEW | Este archivo |

No se tocan: `destinosFavoritosStorage.ts`, rutas, otros componentes.

---

## 4. Cambios aplicados

### 4.1 `MEMORIA-REFACTOR-MISVIAJES.md`

CREADO. Este documento.

### 4.2 `src/pages/MisViajes.tsx`

APLICADO. Dos cambios:

1. **Import nuevo** de `wikiImages` + helper local `getDestinoHeroImage(destino)`:
   - Si `wikiImages[destino.id]` existe → primera imagen local.
   - Fallback: `destino.imageUrl`.
   - Si ninguna → `undefined` (la card cae al color sólido).

2. **JSX reestructurado** dentro del `.map(...)`:
   - `.pd-misviajes-card` pasa a ser un contenedor que envuelve **dos zonas**:
     - `.pd-misviajes-card-main` (superior): tiene el `backgroundImage` inline con la URL del hero y un atributo `data-has-bg="true|false"` para variantes de estilo. Adentro incluye un `<span.pd-misviajes-card-bg-overlay aria-hidden />` (overlay gradient) y un `.pd-misviajes-card-main-inner` con el kicker + título + descripción.
     - `.pd-misviajes-card-actions` (inferior): los dos links en una sola fila — `Ver ficha completa →` a la izquierda y `Quitar de la lista` a la derecha.

**Diff conceptual:**

```diff
 <li className="pd-misviajes-card">
-  <div className="pd-misviajes-card-main">
-    <p className="pd-misviajes-card-kicker">...</p>
-    <h2 className="pd-misviajes-card-title">...</h2>
-    <p className="pd-misviajes-card-desc">...</p>
-  </div>
+  <div
+    className="pd-misviajes-card-main"
+    style={hero ? { backgroundImage: `url(${hero})` } : undefined}
+    data-has-bg={hero ? 'true' : 'false'}
+  >
+    <span className="pd-misviajes-card-bg-overlay" aria-hidden="true" />
+    <div className="pd-misviajes-card-main-inner">
+      <p className="pd-misviajes-card-kicker">...</p>
+      <h2 className="pd-misviajes-card-title">...</h2>
+      <p className="pd-misviajes-card-desc">...</p>
+    </div>
+  </div>
   <div className="pd-misviajes-card-actions">
     <Link className="pd-misviajes-link-primary">Ver ficha completa →</Link>
     <button className="pd-misviajes-link-quiet">Quitar de la lista</button>
   </div>
 </li>
```

### 4.3 `src/theme/theme.css`

APLICADO. Reescribí el bloque `.pd-misviajes-card*` (líneas ~3962 a ~4019). Cambios:

1. `.pd-misviajes-card` ahora es `position: relative; overflow: hidden; isolation: isolate;` (necesario para contener el bg y el overlay + mantener redondeo).
2. `.pd-misviajes-card-main` nuevo: `position: relative; padding 1rem 1.05rem 1.1rem; background-size: cover; background-position: center;`. Usa `data-has-bg='false'` para forzar `background-image: none` cuando no hay hero.
3. `.pd-misviajes-card-bg-overlay`: absolute inset, gradiente vertical 180deg.
   - **Dark**: `rgba(2,6,23,0.58) → 0.78 → 0.95` (fade cierra hacia el footer).
   - **Light** (`html.pd-light`): `rgba(255,255,255, 0.62 → 0.82 → 0.96)`.
   - Cuando `data-has-bg='false'` → overlay transparente.
4. Título / kicker / descripción con overrides cuando `data-has-bg='true'`:
   - Dark: blanco / gris claro + `text-shadow` oscuro para contraste.
   - Light: slate oscuro + `text-shadow` blanco.
5. `.pd-misviajes-card-actions` pasó de **columna** a **fila**:
   - `display: flex; flex-direction: row; align-items: center; justify-content: space-between;`
   - `padding: 0.7rem 1.05rem 0.85rem;` + `border-top: 1px solid var(--pd-border)` + `background: var(--pd-card-bg)` para separar visualmente del hero.
6. `.pd-misviajes-link-quiet` ahora `margin-left: auto` (garantía de que queda pegado a la derecha aunque el primary crezca) y `font-weight: 500` (más sutil).

---

## 5. Fallbacks de imagen y edge cases

- **Destinos sin imagen local ni `imageUrl`**: card sin bg-image, overlay transparente, se ve igual que antes del refactor (background color sólido `--pd-card-bg`). Texto con los colores base del tema.
- **Imagen rota (404 en runtime)**: el `background-image` simplemente no se renderiza; el overlay sigue aplicándose encima del `background-color` base. No hay broken image icon (porque no es un `<img>`). Aceptable.
- **Performance**: no se agregan requests extra respecto al estado anterior para destinos con imagen local (ya estaban en el bundle de `public/`). Para destinos con `imageUrl` remoto (picsum/unsplash), la card dispara el request pero es lazy por el renderer del navegador.

---

## 6. Verificación

- [x] `npx tsc --noEmit -p tsconfig.app.json` → exit 0, sin errores
- [ ] Visual review dark: esperado fondo azul oscuro con imagen del destino asomando y texto blanco legible
- [ ] Visual review light: fondo claro, overlay blanco sutil, título slate oscuro
- [ ] Destinos a probar:
  - `bariloche`, `mendoza`, `ushuaia`, `buenos-aires` → tienen carpeta en `public/images/destinos/<id>/`
  - `bali` (Indonesia) → NO tiene local, usa `imageUrl` (picsum/unsplash)
- [ ] Footer: `Ver ficha completa →` izquierda, `Quitar de la lista` derecha, **misma altura**
- [ ] Hover estados:
  - `Ver ficha completa` → subrayado
  - `Quitar de la lista` → color pasa a `--pd-color-text`

---

## 7. No tocado

- `destinosFavoritosStorage.ts` → API de favoritos sin cambios.
- Rutas (`App.tsx`) → sin cambios.
- Otras cards (`pd-vuelo-card`, `pd-destino-*`) → sin cambios.
- Estructura del `PdSubpageChrome`, header, lead, estado vacío → intactos.

---

## 7b. Iteración v2 — matching exacto con `.pd-destino-hero` (2026-04-17)

Feedback de Lucas sobre v1: el fade era demasiado agresivo desde arriba → la imagen casi no se veía y la info quedaba "chata". Pidió replicar **exactamente** el fade del hero de la ficha de destino (la captura 2).

**Ajustes aplicados solo a `src/theme/theme.css`** (el JSX de `MisViajes.tsx` no cambió):

1. `.pd-misviajes-card-main` ahora es **flex align-end** con `min-height: 170px` y `padding: 2.5rem 1.05rem 1rem`:
   - La imagen ocupa todo el bloque y se ve bien arriba.
   - El texto (kicker + título + descripción) queda pegado al borde inferior, sobre la parte oscura del gradiente.
   - Cuando `data-has-bg='false'`: `min-height: 0` y `padding-top: 1rem` → la card vuelve a ser compacta como antes.

2. `.pd-misviajes-card-bg-overlay` ahora es **idéntico al `.pd-destino-hero-grad`**:
   ```css
   background: linear-gradient(
     to bottom,
     rgba(0, 0, 0, 0) 0%,
     rgba(0, 0, 0, 0) 35%,
     rgba(2, 6, 23, 0.55) 65%,
     rgba(2, 6, 23, 0.88) 100%
   );
   ```
   Light mode usa el mismo esquema con tinte verde (`rgba(0, 40, 20, …)`) — mirror exacto del hero.

3. Texto sobre el hero va **siempre blanco** (no dependiente del tema), igual que en `.pd-destino-hero-*`:
   - Kicker: `rgba(255,255,255,0.82)` + `text-shadow: 0 1px 6px rgba(0,0,0,0.55)` + `letter-spacing: 0.1em`.
   - Título: `#fff` + `text-shadow: 0 2px 14px rgba(0,0,0,0.55)` + `font-size: 1.25rem` + `letter-spacing: -0.01em`.
   - Descripción: `rgba(255,255,255,0.88)` + `text-shadow: 0 1px 8px rgba(0,0,0,0.5)`.
   Se removieron los overrides específicos de `html.pd-light` para estos textos cuando hay bg.

4. Cuando `data-has-bg='false'` (destino sin imagen) los textos usan las variables base (`--pd-color-text`, `--pd-color-text-muted`) y no requieren shadow → la card se ve como estaba antes del refactor, sin romperse.

**Resultado esperado** (matching con captura 2):
- Mitad superior de la card: imagen clara, transparente, con la foto del destino bien visible.
- Mitad inferior: fade gradual a casi-sólido oscuro donde el texto "ARGENTINA / Mendoza / Vino, montaña y Aconcagua." se lee perfectamente sobre el overlay dark.
- Footer (`Ver ficha completa` | `Quitar de la lista`) sigue siendo una fila separada por `border-top`, sin imagen.

Verificación: `./node_modules/.bin/tsc --noEmit -p tsconfig.app.json` → exit 0.

---

## 7c. Iteración v3 — footer forma parte del fade de la imagen (2026-04-17)

Feedback de Lucas sobre v2: el footer con los links tenía `background: var(--pd-card-bg)` + `border-top`, lo que lo dejaba como una "barra" sólida debajo del hero. Pidió que el footer también forme parte del fondo de la imagen, sin background propio.

**Cambios:**

### 7c.1 `src/pages/MisViajes.tsx`

Moví el `style={{ backgroundImage }}`, el atributo `data-has-bg` y el `<span className="pd-misviajes-card-bg-overlay" />` del `.pd-misviajes-card-main` **al `<li className="pd-misviajes-card">`** (card entera). Eliminé el wrapper `.pd-misviajes-card-main-inner` (ya no hace falta porque el overlay está en el padre).

Estructura final:

```tsx
<li className="pd-misviajes-card" style={bg} data-has-bg={...}>
  <span className="pd-misviajes-card-bg-overlay" aria-hidden />
  <div className="pd-misviajes-card-main">
    <p .kicker />
    <h2 .title />
    <p .desc />
  </div>
  <div className="pd-misviajes-card-actions">
    <Link .primary />
    <button .quiet />
  </div>
</li>
```

### 7c.2 `src/theme/theme.css`

1. `.pd-misviajes-card` ahora lleva el `background-size: cover / background-position: center / background-repeat: no-repeat`. El atributo `data-has-bg='false'` cancela la imagen.
2. `.pd-misviajes-card-bg-overlay` ahora es `position: absolute; inset: 0;` sobre la card entera (no sobre el main). Gradient stops ajustados para abarcar también la zona del footer:
   ```
   rgba(0,0,0,0) 0% → 28%
   rgba(2,6,23,0.5) 55%
   rgba(2,6,23,0.88) 100%
   ```
   Light con tinte verde igual que antes.
3. `.pd-misviajes-card-main`: removido el `background-*`, agregado `z-index: 1`, `justify-content: flex-end` y `padding: 3rem 1.05rem 0.75rem` (antes: `2.5rem 1.05rem 1rem`). Se le subió el padding-top un poco para dar más aire a la imagen y se bajó el padding-bottom porque ya no hay separador con el footer.
4. `.pd-misviajes-card-actions`:
   - **Eliminado** `background: var(--pd-card-bg)` y `border-top: 1px solid var(--pd-border)`.
   - Ahora es `position: relative; z-index: 1;` con `padding: 0.25rem 1.05rem 0.95rem` (padding-top chico porque queda visualmente unido al desc que está arriba).
5. Nuevos overrides de links cuando hay bg:
   - `.pd-misviajes-link-primary`: pasa a `var(--pd-color-primary-muted)` (`#a5b4fc` en dark, emerald en light) + `text-shadow`.
   - `.pd-misviajes-link-quiet`: pasa a `rgba(255,255,255,0.78)` + `text-shadow`; hover sube a `#fff`.
   - Los colores base (sin imagen) quedan igual que antes.

**Selectores que cambiaron de `.pd-misviajes-card-main[data-has-bg='true']` a `.pd-misviajes-card[data-has-bg='true']`**: kicker, title, desc, links. Refleja que ahora el atributo vive en la card y no en el main.

**Resultado esperado (matching de la captura con Ushuaia):**
- Toda la card es la imagen del destino con el fade gradual.
- Parte superior: imagen clara, sin overlay.
- Parte media-inferior: fade a oscuro donde se lee el título + descripción.
- Parte inferior: sigue siendo parte del mismo fade (overlay ~0.88), y ahí viven `Ver ficha completa` (indigo brillante) + `Quitar de la lista` (blanco sutil), **sin ningún separador ni bg propio**.

Verificación: `./node_modules/.bin/tsc --noEmit -p tsconfig.app.json` → exit 0.

---

## 7d. Iteración v4 — card clickeable + link "Ver" (2026-04-17)

Feedback de Lucas: el link debe decir **solo "Ver"** (antes "Ver ficha completa →") y **clickear en cualquier parte de la card** debe abrir la ficha del destino.

### 7d.1 `src/pages/MisViajes.tsx`

1. Texto del link cambió de `Ver ficha completa →` a `Ver`.
2. El `<li className="pd-misviajes-card">` ahora es clickeable completo:
   - `role="link"` + `tabIndex={0}` + `aria-label={`Ver ficha de ${d.nombre}`}` para accesibilidad.
   - `onClick={() => navigate(`/destino/${slug}`)}`.
   - `onKeyDown` maneja `Enter` y `Space` (`e.preventDefault()` + navegar).
3. Propagación del click controlada:
   - `<Link>` "Ver" tiene `onClick={(e) => e.stopPropagation()}` → navega por su cuenta sin disparar el handler de la card (evita doble navegación).
   - `<button>` "Quitar de la lista" tiene `onClick={(e) => { e.stopPropagation(); removeFavoriteDestino(slug); }}` → quita el favorito **sin** navegar.

### 7d.2 `src/theme/theme.css`

Agregado a `.pd-misviajes-card`:
- `cursor: pointer` → affordance de clickeable.
- `outline: none` + `transition: transform / box-shadow / border-color 0.18s`.
- `:hover` → `transform: translateY(-2px)` + `box-shadow: var(--pd-shadow-hover)` + `border-color: var(--pd-card-border)` (lift sutil).
- `:focus-visible` → ring doble con `--pd-color-primary` (sin cambiar layout; accesibilidad teclado).

**Resultado:**
- Click en la card (hero o descripción) → `/destino/:slug`.
- Click en el texto "Ver" → mismo destino, vía `<Link>` (navegación SPA de React Router).
- Click en "Quitar de la lista" → remueve el favorito, se queda en `/viajes`.
- Teclado: `Tab` enfoca la card (focus ring visible), `Enter` o `Space` navegan.

Verificación: `./node_modules/.bin/tsc --noEmit -p tsconfig.app.json` → exit 0.

---

## 8. Pendientes / ideas para siguiente iteración

- Si Lucas quiere, se puede agregar un **carrusel de imágenes dentro del hero de la card** (como hace `Destino.tsx` con el crossfade `slotA/slotB`). Queda para v2 si el feedback visual lo pide.
- Podría agregarse un `aspect-ratio` mínimo al `.pd-misviajes-card-main` para que las cards tengan alto uniforme aunque la descripción sea corta.
- Mover `getDestinoHeroImage` a `src/logic/destinoImages.ts` si se reutiliza en otro lado.

