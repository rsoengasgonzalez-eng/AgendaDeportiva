# La Grada · Agenda deportiva para WhatsApp

Aplicación responsive de agenda deportiva social, preparada para Cloudflare Pages y construida como SPA estática sin dependencias de ejecución.

## Incluye

- Portada **Hoy / Mañana / Finde / Semana** y buscador.
- Fútbol, baloncesto, voleibol, tenis, balonmano y fútbol americano.
- Fórmula 1 y MotoGP con sesiones, calendario, resultados y campeonatos.
- Resultados recientes, clasificaciones, favoritos persistentes y “qué ver hoy”.
- Horarios, canales, índice de interés y fichas de evento.
- Votaciones, organización de quedadas y mensajes listos para WhatsApp.
- Diseño mobile-first, navegación inferior, PWA instalable y caché offline básica.
- Funciones serverless con caché para TheSportsDB y Jolpica F1.
- Datos demo claramente etiquetados cuando no hay respuesta de un proveedor.

## Desarrollo local

```bash
npm run build
npm run dev
```

La interfaz funciona con datos demo. Para probar también Pages Functions:

```bash
npm run build
npx wrangler pages dev dist
```

## Publicar en Cloudflare Pages

### Desde Git

1. Sube esta carpeta a GitHub o GitLab.
2. En **Workers & Pages → Create → Pages → Connect to Git**.
3. Configura:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Despliega.

### Desde terminal

```bash
npm install
npx wrangler login
npm run deploy
```

## Variables de entorno

En **Settings → Environment variables**:

- `SPORTSDB_API_KEY`: opcional. Si no existe, se usa la clave pública de prueba `123`. Para mayor cobertura, resultados y límites superiores, configura una clave propia.

No expongas claves premium en variables `VITE_*`: las funciones de `/functions/api` las mantienen en servidor.

## Fuentes de datos

- `/api/sports`: consulta hasta siete fechas en TheSportsDB, normaliza los deportes y aplica caché en el edge.
- `/api/f1`: obtiene calendario, sesiones, último resultado y clasificaciones de Jolpica F1.
- MotoGP queda preparado para conectar un proveedor con licencia. La vista demo está etiquetada y nunca se presenta como dato en directo.

## Para llevarla a producción real

1. Contratar o configurar un proveedor deportivo con cobertura contractual de ligas, TV y MotoGP.
2. Sustituir la persistencia local de votos/quedadas por Cloudflare D1 + autenticación o un identificador seguro del grupo.
3. Añadir notificaciones con Workers + Web Push.
4. Confirmar derechos de logotipos, escudos y distribución de datos.
5. Añadir analítica respetuosa con privacidad y monitorización de errores.

## Estructura

```text
src/                 React y estilos
functions/api/       Cloudflare Pages Functions
public/              PWA, cabeceras y fallback SPA
wrangler.toml        Configuración de despliegue
```
