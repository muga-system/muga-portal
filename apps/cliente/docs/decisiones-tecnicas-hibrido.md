# Decisiones tecnicas del modelo hibrido

Documento inicial para mantener consistencia en la implementacion del Area de Clientes Muga.

## Convenciones de nombres

- Entidades del portal usan prefijo semantico `portal` solo en capa de mocks/tipos internos cuando convive con legado.
- Tablas en base de datos usan nombres simples y directos:
  - `clients`
  - `projects`
  - `project_stages`
  - `deliverables`
  - `project_comments`
  - `project_files`
  - `project_activity`
- Estados de flujo son constantes compartidas en `src/lib/portal-constants.ts`.

## Separacion UI mock vs backend real

- Fase inicial:
  - Pantallas internas se apoyan en `src/lib/portal-mock.ts`.
  - Objetivo: validar UX y flujo operativo sin bloquearse por integracion.
- Fase siguiente:
  - Reemplazar lectura mock por queries reales a Supabase.
  - Mantener contratos de tipos para reducir cambios en componentes.

## Reglas de migracion desde demo-store

- No eliminar `demo-store` en bloque.
- Migrar por modulo:
  1. Portal interno (projects/deliverables/activity)
  2. Vista cliente del portal
  3. Limpieza final del legado no usado
- Durante la transicion, evitar mezclar escritura de la misma entidad en dos fuentes distintas.

## Supabase helpers

- Crear helper server: `src/lib/supabase-server.ts`.
- Crear helper browser: `src/lib/supabase-browser.ts`.
- Evitar crear clientes inline en cada pagina/ruta.

## Rutas

- Area interna en `src/app/(internal)/internal/*`.
- No exponer rutas de clientes hasta completar hardening de permisos.

## Acceso interno

- El layout interno valida usuario autenticado y email interno.
- Variables opcionales para definir acceso:
  - `INTERNAL_ALLOWED_EMAILS` (lista separada por comas)
  - `INTERNAL_ALLOWED_DOMAINS` (lista separada por comas)
- Si no existen variables, se usan defaults:
  - email: `admin@gmail.com`
  - dominio: `muga.dev`

## Principio de seguridad

- Proxy puede ayudar con redireccion o checks optimistas.
- La autorizacion real debe validarse en cada query/operacion backend con RLS.
