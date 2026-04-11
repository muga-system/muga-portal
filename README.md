# muga-platform

Plataforma unificada de MUGA en monorepo.

## Estructura

- `apps/web`: sitio publico (marketing)
- `apps/cliente`: portal de clientes y operacion
- `apps/api`: backend Fastify (API interna y servicios)
- `packages/ui`: sistema visual compartido (en progreso)
- `packages/shared`: utilidades compartidas (en progreso)
- `packages/config`: configuracion compartida (en progreso)

## Referencias (solo documentacion)

Los repos originales no se modifican y se usan solo como referencia:

- `/home/gramaphenia/Escritorio/MUGA/muga-dev`
- `/home/gramaphenia/Escritorio/muga-wizard-saas`

## Desarrollo local

Instalar dependencias:

```bash
pnpm install
```

Levantar todas las apps:

```bash
pnpm dev
```

Puertos:

- `web`: `http://localhost:3000`
- `cliente`: `http://localhost:3001`
- `api`: `http://localhost:3002`

Scripts utiles:

```bash
pnpm dev:web
pnpm dev:cliente
pnpm dev:api
pnpm lint
pnpm build
```

## Variables de entorno

`apps/web`:

```bash
NEXT_PUBLIC_CLIENT_APP_URL=http://localhost:3001
```

Permite que los CTAs de marketing apunten al dominio del portal cliente segun entorno.

Checklist de salida a produccion:

- `docs/predeploy-checklist.md`

Arquitectura visual oficial (`apps/web`):

- `docs/design-contract.md`
- `docs/web-design-architecture.md`

Operacion y flujo real del sistema:

- `docs/README.md`
- `docs/operations/executive-overview.md`
- `docs/operations/workflow-end-to-end.md`
- `docs/operations/admin-runbook.md`
- `docs/operations/client-portal-guide.md`
- `docs/operations/onboarding-and-access.md`
- `docs/architecture/system-communication-map.md`

## Flujo Figma (bootstrap y sync)

Playbook:

- `docs/figma-bootstrap-playbook.md`

Estado actual con el token disponible:

- `pnpm figma:doctor`: verifica conexión, token y permisos.
- `pnpm figma:pull:file`: descarga metadata del archivo Figma.
- `pnpm figma:pull:variables`: solo funciona con `file_variables:read` y cuenta Enterprise.
- `pnpm figma:pull`: ejecuta metadata + variables cuando están disponibles.
- `pnpm figma:export:assets`: exporta assets definidos en el manifest.

Comandos base:

```bash
export FIGMA_TOKEN="<tu_token>"
export FIGMA_FILE_KEY="<tu_file_key>"

pnpm figma:doctor
pnpm figma:pull
pnpm figma:export:assets --manifest=design/figma/assets-manifest.json --format=svg --out=design/figma/assets
```
