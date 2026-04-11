# Figma Foundations Seed - Web Wave 1

Usa este documento para construir `00 Foundations` en Figma desde el estado actual del repo.

## 1) Color tokens (base)

Fuente: `packages/ui/styles/muga-theme.css`.

- `color/brand/accent`: `#ff5353`
- `color/brand/accent-md`: `#5e3131`
- `color/brand/accent-xs`: `#2d1f1f`
- `color/bg/obscure`: `#191717`
- `color/bg/mugagray`: `#302e2e`
- `color/text/graylight`: `#a0a0a0`

Semanticos (HSL, copiar literal):

- `color/semantic/background`: `0 4% 9%`
- `color/semantic/foreground`: `0 0% 96%`
- `color/semantic/card`: `0 2% 14%`
- `color/semantic/card-foreground`: `0 0% 96%`
- `color/semantic/popover`: `0 2% 14%`
- `color/semantic/popover-foreground`: `0 0% 96%`
- `color/semantic/primary`: `0 100% 66%`
- `color/semantic/primary-foreground`: `0 0% 100%`
- `color/semantic/secondary`: `0 2% 19%`
- `color/semantic/secondary-foreground`: `0 0% 96%`
- `color/semantic/muted`: `0 2% 19%`
- `color/semantic/muted-foreground`: `0 0% 68%`
- `color/semantic/accent`: `0 31% 28%`
- `color/semantic/accent-foreground`: `0 0% 100%`
- `color/semantic/destructive`: `0 80% 56%`
- `color/semantic/destructive-foreground`: `210 40% 98%`
- `color/semantic/success`: `142 62% 48%`
- `color/semantic/success-foreground`: `0 0% 100%`
- `color/semantic/warning`: `34 92% 58%`
- `color/semantic/warning-foreground`: `0 0% 9%`
- `color/semantic/info`: `210 92% 62%`
- `color/semantic/info-foreground`: `0 0% 100%`
- `color/semantic/border`: `0 2% 30%`
- `color/semantic/input`: `0 2% 30%`
- `color/semantic/ring`: `0 100% 66%`

## 2) Layout and sizing tokens

- `layout/content-max`: `87.5rem` (1400 px)
- `radius/base`: `0`

## 3) Section spacing tokens

Valores que hoy usa `apps/web`:

- `space/section/compact/mobile`: `3.25rem`
- `space/section/default/mobile`: `4.25rem`
- `space/section/lg/mobile`: `5.5rem`
- `space/section/feature/mobile`: `6rem`

- `space/section/compact/tablet`: `3.75rem`
- `space/section/default/tablet`: `5rem`
- `space/section/lg/tablet`: `6rem`
- `space/section/feature/tablet`: `6.5rem`

- `space/section/compact/desktop`: `4.25rem`
- `space/section/default/desktop`: `6.5rem`
- `space/section/lg/desktop`: `7.5rem`
- `space/section/feature/desktop`: `7.5rem`

## 4) Typography seed

Familias:

- `font/sans`: `Geist`
- `font/mono`: `Geist Mono`

Escala principal (actual):

- `type/section-title/mobile`: `2rem`
- `type/section-title/tablet`: `2.75rem`
- `type/section-title/desktop`: `3.25rem`
- `type/section-lead/mobile`: `1.125rem`
- `type/section-lead/tablet`: `1.1875rem`
- `type/section-lead/desktop`: `1.25rem`

## 5) Interaction tokens

- `focus/ring/color`: `color/brand/accent`
- `focus/ring/offset-bg`: `color/bg/obscure`
- `selection/bg`: `rgba(255, 83, 83, 0.32)`

## 6) Naming rules for Wave 1

- Páginas Figma: `00 Foundations`, `01 Components`, `02 Screens`.
- Componentes: `Muga/<Categoria>/<Componente>`.
- Variants: `Size=sm|md|lg`, `State=default|hover|focus|disabled`, `Variant=default|feature|minimal`.

## 7) Definition of Done (Foundations)

- Todos los tokens de color arriba creados en Figma.
- Layout + radius definidos.
- Escalas de spacing de sección definidas por breakpoint.
- Escala tipográfica base definida y aplicada a estilos de texto.
- Listo para arrancar `01 Components` sin hardcode local.
