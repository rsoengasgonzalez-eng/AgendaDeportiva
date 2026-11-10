# Ajustes de Cloudflare Workers Builds

Configura el repositorio conectado con estos valores:

- **Root directory:** `/`
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy --config wrangler.jsonc`

También funciona `npx wrangler deploy`, porque `wrangler.jsonc` está en la raíz.

## Importante al sustituir el repositorio

Elimina antes los archivos antiguos, especialmente:

- `wrangler.toml`
- `functions/`
- `_routes.json`
- `_headers`
- `_redirects`

Después copia el contenido de este paquete directamente en la raíz del repositorio. No subas la carpeta contenedora como un nivel adicional.

El repositorio final debe mostrar `wrangler.jsonc`, `package.json`, `build.mjs`, `index.html`, `src/`, `public/` y `dist/` en el primer nivel.
