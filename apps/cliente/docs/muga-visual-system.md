# MUGA Visual System (Portal Interno)

Guia corta para mantener este repo como extension visual coherente de `muga-dev`.

Seguimiento de implementacion por etapas:

- `apps/cliente/docs/visual-parity-rollout.md`

## Principios

- Usar siempre tokens y componentes del sistema (no colores hardcodeados por pantalla).
- Mantener bordes rectos en toda la UI (`--radius: 0`, `rounded-none`).
- Priorizar jerarquia clara: titulo, subtitulo, contenido, accion.
- Mantener contraste alto en dark mode y foco visible en todos los interactivos.

## Fuente de verdad

- Tokens globales: `src/app/globals.css`
- Componentes base: `src/components/ui/*`
- Utilidades semanticas MUGA: `src/app/globals.css` (`.section-title`, `.section-lead`, `.muga-*`)

## Tokens de color (no hardcodear)

Usar siempre variantes basadas en tokens:

- Fondo y superficies: `background`, `card`, `popover`
- Texto: `foreground`, `muted-foreground`
- Acento de marca: `primary` (rojo MUGA)
- Estados: `destructive`, `success`, `warning`, `info`
- Bordes y foco: `border`, `input`, `ring`

## Clases semanticas recomendadas

- Estructura:
  - `.page-container`
  - `.section-space`, `.section-space-lg`, `.section-space-bottom`
- Jerarquia tipografica:
  - `.section-title`
  - `.section-lead`
  - `.muga-kicker`
- Identidad:
  - `.muga-badge`, `.muga-badge--sm`, `.muga-badge--md`
  - `.secondary-link`
- Superficies y acciones:
  - `.muga-surface`
  - `.muga-surface-subtle`
  - `.muga-inline-note`
  - `.muga-btn-primary`
  - `.muga-btn-outline`
  - `.muga-nav-link`
  - `.muga-help-text`

## Reglas para componentes

- Button/Input/Select/Textarea/Card/Alert/Table deben resolverse desde `src/components/ui/*`.
- No aplicar `bg-*`, `text-*`, `border-*` de color directo en paginas para "corregir" visual.
- Si falta una variante, agregarla al componente UI (no al uso puntual).

## Checklist rapido antes de merge

1. No hay nuevos colores hardcodeados en `.tsx`.
2. No hay `rounded-*` distintos de `rounded-none`.
3. Estados de feedback usan `Alert` con variantes semanticas.
4. Formularios y tablas usan componentes UI base (sin estilos duplicados).
5. Corre `pnpm lint` y `pnpm build` sin errores.

## Anti-patrones a evitar

- Duplicar estilos inline en varias pantallas.
- Cambiar contraste por utilidades locales en lugar de ajustar tokens.
- Romper consistencia de densidad (heights/paddings distintos sin razon).
- Introducir un segundo lenguaje visual distinto al de `muga-dev`.
