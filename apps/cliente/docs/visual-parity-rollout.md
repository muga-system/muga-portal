# Visual parity rollout (cliente)

Plan para extender las reglas visuales consolidadas en `apps/web` hacia `apps/cliente`.

## P1 - Shell y estructura global (completado)

- [x] Unificar shell de `admin` y `portal` en un componente comun (`AppShell`).
- [x] Altura de header basada en token (`--layout-nav-height`).
- [x] Espaciado vertical de main basado en token (`--layout-divider-header-gap`).
- [x] `themeColor` migrado a `viewport` en `src/app/layout.tsx`.
- [x] Footer con separador de ancho de sistema (`--layout-divider-width`).

Archivos clave:

- `src/components/app-shell.tsx`
- `src/app/admin/layout.tsx`
- `src/app/portal/layout.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/components/app-footer.tsx`

## P2 - Paginas nucleo (pendiente)

- [x] `src/app/admin/page.tsx`
- [x] `src/app/admin/projects/[id]/page.tsx`
- [x] `src/app/portal/page.tsx`

Objetivo: aplicar patron de seccion consistente (intro, separador, bloque integrado, ritmo vertical).

## P3 - Componentes del dominio portal (completado)

- [x] `src/components/portal/project-pipeline.tsx`
- [x] `src/components/portal/deliverables-list.tsx`
- [x] `src/components/portal/project-comments.tsx`
- [x] `src/components/portal/project-files.tsx`
- [x] `src/components/portal/project-timeline.tsx`

Objetivo: eliminar variaciones visuales no intencionales y reforzar densidad/tipografia coherente.

## Validacion

- `pnpm --filter cliente lint`
- `pnpm --filter cliente build`
