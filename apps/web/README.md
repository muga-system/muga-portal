# apps/web

Sitio publico de MUGA construido con Next.js (App Router).

## Comandos

Desde la raiz del monorepo:

```bash
pnpm --filter web dev
pnpm --filter web lint
pnpm --filter web build
```

## Arquitectura visual y de layout

Documentacion oficial vigente:

- `docs/design-contract.md`
- `docs/web-design-architecture.md`

Si hay conflicto entre patrones viejos y estos documentos, prevalece `docs/web-design-architecture.md`.

## Reglas practicas para mantener consistencia

- No crear separadores de seccion con `border-t`/`border-b` sueltos si existe `LayoutWideDivider` o `layout-divider-bottom`.
- No duplicar lineas entre cierre de una seccion y apertura de la siguiente.
- Usar componentes de sistema para patrones repetidos:
  - `SectionIntro`
  - `BorderedGrid`
  - `SurfaceBox`
  - `SecondaryArrowLink`
  - `OutlineCtaLink`
- Mantener spacing con tokens/utilidades, evitar hardcode de distancias por pagina.

## Tokens y estilos base

- Tokens compartidos: `packages/ui/styles/muga-theme.css`
- Utilidades globales web: `apps/web/src/app/globals.css`

## Nota operativa

Antes de introducir cambios visuales grandes, revisar primero la estructura existente en `apps/web/src/app/page.tsx` y replicar el patron en paginas internas.
