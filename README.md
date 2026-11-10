# La Grada · Cloudflare Workers Static Assets

Aplicación responsive de agenda deportiva social para desplegarse como **Cloudflare Worker con Static Assets**.

Esta versión corrige el error:

```text
[ERROR] Missing entry-point to Worker script or to assets directory
```

Cloudflare puede ejecutar `wrangler deploy` directamente. El archivo `wrangler.toml` de la raíz declara `./dist` como directorio de assets, por lo que no hace falta un `main` ni un Worker entry point.

## Funciones incluidas

- Portada Hoy, Mañana, Finde y Semana.
- Fútbol, baloncesto, voleibol, tenis, balonmano y fútbol americano.
- Fórmula 1 y MotoGP: sesiones, calendario, resultados y campeonatos.
- Resultados, clasificaciones, favoritos y “qué ver hoy”.
- Horarios, canales, votaciones, quedadas y mensajes para WhatsApp.
- Diseño responsive y PWA instalable.
- Datos demo claramente señalados y funcionamiento resiliente si las APIs no están disponibles.

## Configuración crítica

`wrangler.toml`:

```toml
name = "agendadeportiva"
compatibility_date = "2026-11-10"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

- `[assets].directory` elimina el error de falta de entry point.
- `not_found_handling = "single-page-application"` devuelve `index.html` en rutas del frontend.
- No se define `main` porque este despliegue es estático.

## Desplegar desde Cloudflare Workers Builds

Sube el contenido de este proyecto a la raíz del repositorio y usa:

```text
Build command: npm run build
Deploy command: npx wrangler deploy
Root directory: /
```

Si el panel instala dependencias automáticamente, encontrará `wrangler` en `devDependencies`. Si el entorno de Cloudflare ya proporciona Wrangler, el mismo comando funciona igualmente.

## Desplegar desde terminal

```bash
npm install
npm run build
npx wrangler deploy
```

La salida del build se crea en `./dist` y Wrangler la sube como Static Assets.

## Desarrollo local

```bash
npm run build
npm run dev
```

Abre `http://localhost:5173`.

Para simular el runtime de Workers:

```bash
npm install
npm run build
npx wrangler dev
```

## Datos deportivos

Este paquete está configurado deliberadamente como **Worker estático sin entry point**. Por tanto, la interfaz funciona siempre con sus datos demo y muestra un aviso si `/api/*` no existe.

Las antiguas Pages Functions se conservan en `functions/api/` como referencia para una evolución posterior, pero Workers Builds no las publica automáticamente. Si se desean APIs en el mismo Worker habrá que añadir un archivo `main`, un binding `ASSETS` y enrutar `/api/*`; eso ya sería un Worker híbrido y dejaría de ser el escenario estático solicitado.

## Estructura

```text
index.html            Entrada de la SPA
src/                  JavaScript y CSS fuente
public/               PWA y recursos estáticos
functions/api/        Conectores de referencia no desplegados en modo estático
dist/                 Salida generada por npm run build
build.mjs             Build sin dependencias de framework
wrangler.toml         Configuración autoritativa de Workers Static Assets
package.json          Build y deploy
```
