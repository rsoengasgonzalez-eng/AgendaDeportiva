# La Grada · Agenda deportiva

Aplicación estática responsive desplegable mediante **Cloudflare Workers Static Assets**.

## Despliegue desde GitHub

La configuración autoritativa es `wrangler.jsonc`:

```json
{
  "name": "agendadeportiva",
  "compatibility_date": "2026-11-10",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

No hay `main` porque no se necesita un Worker script. Wrangler sube directamente `./dist`.

### Cloudflare Workers Builds

```text
Root directory: /
Build command: npm run build
Deploy command: npx wrangler deploy --config wrangler.jsonc
```

`dist/` se incluye en Git deliberadamente. Así, incluso si el comando de build estuviera vacío, Wrangler seguirá encontrando el directorio de assets.

## Reemplazo del repositorio anterior

No mezcles este paquete con los archivos antiguos. Elimina el contenido anterior del repositorio y copia este paquete en la raíz. En particular, no debe quedar ningún `wrangler.toml` con `pages_build_output_dir`, porque haría que Wrangler vuelva a identificar el repositorio como Pages.

Consulta `CLOUDFLARE-BUILD.md` para la lista de archivos antiguos que deben eliminarse.

## Desarrollo

```bash
npm install
npm run build
npm run dev
```

## Funcionalidad

Incluye agenda Hoy/Mañana/Finde/Semana, fútbol, baloncesto, voleibol, tenis, balonmano, fútbol americano, Fórmula 1, MotoGP, resultados, clasificaciones, favoritos, votaciones, quedadas y enlaces para WhatsApp.

En esta modalidad puramente estática utiliza datos demo locales. Si un endpoint `/api/*` no está disponible, la aplicación continúa funcionando y lo indica sin bloquear la interfaz.
