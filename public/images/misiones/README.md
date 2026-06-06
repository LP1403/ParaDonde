# Imágenes de misiones

Carpeta para imágenes específicas de cada misión.

## Convención de nombre

`{misionId}.jpg` — coincide exactamente con el `id` de la misión en `src/data/misiones.ts`.

Ejemplos:
- `bsas-obelisco.jpg`
- `bariloche-lago-nahuel.jpg`
- `ny-central-park.jpg`

## Cómo usarla

Una vez que pongas la imagen acá, actualizá el campo `imagenUrl` de esa misión en
`src/data/misiones.ts`:

```ts
imagenUrl: '/images/misiones/bsas-obelisco.jpg',
```

## Tamaño recomendado

600 × 300 px, formato JPG o WebP, peso < 150 KB por imagen.
