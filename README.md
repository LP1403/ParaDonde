# Para Dónde?

Guía de viajes: elegí tu aventura, guías prácticas (documentación, derechos del pasajero, equipaje, qué llevar, pagar en el exterior) y calculadora dólar tarjeta.

## Stack

- React + TypeScript (Vite)
- Ionic React
- React Router
- Firebase (Hosting, Analytics)
- Capacitor (preparado para app nativa)

## Desarrollo

```bash
npm install
npm run dev
```

## Build y deploy

```bash
npm run build
firebase use para-donde
firebase deploy
```

La app queda en el proyecto Firebase **para-donde** (Hosting).

## Variables de entorno

Crear `.env` con:

- `VITE_FIREBASE_API_KEY`: API key de Firebase (ver consola Firebase)

Ver `.env.example`.

## Estructura

- `src/pages/`: Home, Aventura, ResultadoAventura, Destino, GuiasTematicas, GuiaTematica, CalculadoraDolar
- `src/data/`: aventura.ts (preguntas), destinos.ts (10 destinos Argentina), guias.ts (guías temáticas)
- `src/logic/`: motorAventura.ts (filtrar destinos por respuestas)
- `src/theme/`: tema Tierra y cielo
