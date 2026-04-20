# API (Fastify)

Backend service for the MUGA monorepo.

## Estado de despliegue (fase actual)

En la estrategia Hostinger + Vercel de la fase actual:

- `apps/api` no se publica en produccion.
- `apps/web` y `apps/cliente` cubren los flujos operativos activos.
- Este servicio queda para evolucion futura cuando existan endpoints de negocio reales.

## Run

```bash
pnpm --filter api dev
```

## Health check

```bash
curl http://localhost:3002/health
```
