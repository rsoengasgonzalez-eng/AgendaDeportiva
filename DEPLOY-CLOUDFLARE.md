# Cloudflare Workers Build

Usa estos valores en el panel:

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |

No utilices `wrangler pages deploy` para este proyecto.

El despliegue correcto debe detectar en la raíz:

```toml
[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

No es necesario configurar un Worker entry point ni añadir `main`.
