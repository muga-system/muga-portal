# Arquitectura de diseno web (apps/web)

Este documento fija la arquitectura visual y estructural implementada en `apps/web` para que los avances no se pierdan.

Para flujo operativo real (captura, admin, portal y accesos), ver:

- `docs/operations/workflow-end-to-end.md`

## Objetivo

- Mantener un layout consistente entre Home y paginas internas.
- Evitar duplicaciones visuales (lineas, tramas, wrappers, CTAs).
- Centralizar decisiones de spacing y ancho en tokens.
- Cambiar rapido sin hardcode por pagina.

## Capas del sistema

1. Tokens globales (`packages/ui/styles/muga-theme.css`)
2. Utilidades globales (`apps/web/src/app/globals.css`)
3. Primitivas de layout (`apps/web/src/components/*`)
4. Paginas (`apps/web/src/app/*/page.tsx`)

## Tokens clave de layout

- `--layout-content-max`: ancho maximo del contenido.
- `--layout-frame-gap`: aire entre contenido y lineas internas.
- `--layout-frame-width`: ancho del frame principal.
- `--layout-side-trama-max`: ancho maximo de trama lateral.
- `--layout-side-trama-width`: ancho dinamico real de trama lateral.
- `--layout-divider-width`: ancho de separadores horizontales (contenido + trama).
- `--layout-nav-height`: alto navbar.
- `--layout-breadcrumb-height`: alto breadcrumb.
- `--layout-header-offset`: offset total bajo header fijo.
- `--layout-divider-header-gap`: distancia estandar separador -> header de seccion.

## Componentes estructurales oficiales

- `LayoutFrameDecor`: lineas verticales internas + tramas laterales + lineas externas.
- `LayoutWideDivider`: linea horizontal al ancho `--layout-divider-width`.
- `BorderedGrid`: grid con borde estructural para cajas integradas.
- `SectionIntro`: bloque semantico badge + titulo + lead.
- `SurfaceBox`: superficie base (`muga-surface`) reutilizable.
- `SecondaryArrowLink`: CTA de texto con flecha.
- `OutlineCtaLink`: CTA con borde (interno y externo).

## Plantillas canonicas de seccion

### SectionStandard

- `SectionIntro` -> `LayoutWideDivider` -> `BorderedGrid` -> `LayoutWideDivider`
- Para bloques comparativos o de cards integradas (sistema, referencias, inversion, formatos, casos).

### SectionContent

- `SectionIntro` -> `SurfaceBox` (o bloque de contenido) -> CTA/s secundarios
- Para cierres, contexto adicional, legales y bloques de accion.

### SectionData

- `SectionIntro` -> `LayoutWideDivider` -> contenido funcional (`details`, `table`, `ol`)
- Para FAQ, tablas, procesos y contenido semantico no-card.

## Reglas de implementacion

### 1) Separadores

- Los cortes entre secciones deben usar `layout-divider-bottom` o `LayoutWideDivider`.
- Evitar `border-t`/`border-b` sueltos para separar secciones si ya existe separador estructural.
- No duplicar linea de cierre de seccion con linea de apertura del bloque siguiente.

### 2) Estructura de cajas

- Para bloques tipo sistema/referencias/inversion usar `BorderedGrid`.
- Evitar cards flotantes con `gap` cuando el patron esperado es bloque continuo con divisores.

### 3) Espaciado

- Usar tokens y utilidades (`divider-header-gap`, `divider-gap-top`) antes que `mt-*` puntuales.
- Si hace falta override puntual, documentarlo en la pagina.
- Mantener una sola metrica de separacion por contexto (no mezclar 3-4 valores en la misma zona).

### 4) Formularios

- Campos visuales unificados con `--color-form-field`.
- Usar `muga-field` para inputs/textarea y `muga-select` para selects.
- Si una superficie no debe reaccionar al hover, usar `muga-surface--static`.

### 5) FAQ

- Cada item debe usar `faq-row` y `faq-row--line` para separadores consistentes.
- Icono de apertura en blanco/sutil, sin acento rojo.

## Checklist de revision visual antes de merge

- [ ] No hay lineas horizontales full viewport donde debe ir `--layout-divider-width`.
- [ ] No hay dobles lineas entre secciones consecutivas.
- [ ] Trama lateral anclada al frame y limitada por token.
- [ ] Header fijo, breadcrumb y main comparten offset coherente.
- [ ] Cajas principales usan patrones compartidos (`BorderedGrid`/`SurfaceBox`).
- [ ] CTAs repetidos usan componentes reutilizables.

## Baseline visual (2026-04-06)

Estado validado en `apps/web` despues de la ronda de ajustes:

- Home sin huecos verticales innecesarios en secciones principales.
- Separadores horizontales de seccion al ancho `--layout-divider-width`.
- Trama lateral limitada por token y anclada al frame.
- Footer con separadores de ancho completo de sistema (incluyendo trama).
- CTA links/botones con icono `ArrowRight` (lucide-react) unificado.
- FAQ con fondo oscuro tonal y contraste ajustado (pregunta/acento, respuesta/acento suavizado).

Validacion tecnica de este baseline:

- `pnpm --filter web lint`
- `pnpm --filter web build`

## Archivos de referencia rapida

- `packages/ui/styles/muga-theme.css`
- `apps/web/src/app/globals.css`
- `apps/web/src/components/layout-frame-decor.tsx`
- `apps/web/src/components/layout-wide-divider.tsx`
- `apps/web/src/components/bordered-grid.tsx`
- `apps/web/src/components/section-intro.tsx`
- `apps/web/src/components/surface-box.tsx`
- `apps/web/src/components/site-navigation.tsx`
- `apps/web/src/components/site-breadcrumb.tsx`
- `apps/web/src/app/page.tsx`
