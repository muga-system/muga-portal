# Prompt para Anima (01 Components, Wave 1)

Copiar y pegar en Anima dentro de la página `01 Components`.

```text
Create a Figma component library for MUGA using these exact names and variants.

Global rules:
- Create everything on page: 01 Components
- Use naming prefix: Muga/
- Use component sets (not plain frames)
- Use existing Foundations tokens for color and typography
- Keep square corners (radius 0)
- Do not invent new brand colors

Required component sets and variants:

1) Muga/Navigation/SiteNavigation
- Variants:
  - State=desktop
  - State=mobile-closed
  - State=mobile-open
- Include link state examples: default, active, hover

2) Muga/Layout/SiteFooter
- Variant:
  - State=default
- Include CTA block, primary links, legal links

3) Muga/Hero/PageHero
- Variants:
  - Variant=default, Aside=off
  - Variant=feature, Aside=on
  - Variant=minimal, Aside=off

4) Muga/Badge/Base
- Variants:
  - Size=sm, State=default
  - Size=md, State=default

5) Muga/Surface/Card
- Variants:
  - State=default
  - State=hover

6) Muga/Link/Secondary
- Variants:
  - State=default
  - State=hover
  - State=focus

7) Muga/Form/Input
- Variants:
  - State=default
  - State=focus
  - State=error
  - State=disabled

8) Muga/Form/Select
- Variants:
  - State=default
  - State=focus
  - State=error
  - State=disabled

9) Muga/Form/Textarea
- Variants:
  - State=default
  - State=focus
  - State=error
  - State=disabled

10) Muga/Form/Submit
- Variants:
  - State=default
  - State=hover
  - State=disabled
  - State=loading

11) Muga/Form/ErrorMessage
- Variants:
  - State=default

Output constraints:
- Component set names must match exactly.
- Variant property names must be exactly: State, Variant, Aside, Size.
- Keep all components aligned in a clean grid.
```

## Validación rápida después de correr Anima

1. Guardar en Figma.
2. Ejecutar:

```bash
pnpm figma:pull:file -- --raw
pnpm figma:audit:components
```

3. Revisar reporte en `design/figma/snapshots/components-audit.json`.
