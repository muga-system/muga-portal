# Prompt para Anima (02 Screens, Wave 1)

Copiar y pegar en Anima dentro de la página `02 Screens`.

```text
Create the first screen set for MUGA using existing components from page "01 Components".

Page:
- Build only inside page: 02 Screens

Required frame names (exact):
1) Web/Home
2) Web/Contacto
3) Web/Modelo
4) Web/Legal-Template

Rules:
- Use instances of existing component sets (do not duplicate components as new sets)
- Keep desktop width 1440 for all frames
- Keep spacing consistent with foundations section spacing tokens
- Keep corner radius 0
- Keep typography and colors from foundations only

Web/Home structure:
- SiteNavigation
- Hero (Variant=default, Aside=off)
- System/Pillars section (cards with Surface/Card)
- References section
- Investment section
- FAQ section
- Contact form section
- SiteFooter

Web/Contacto structure:
- SiteNavigation
- Hero (Variant=feature, Aside=on)
- Steps section (3 cards)
- Contact form section
- Link group section
- SiteFooter

Web/Modelo structure:
- SiteNavigation
- Hero (Variant=feature, Aside=on)
- Bento-like section using Surface/Card and text blocks
- CTA final section
- SiteFooter

Web/Legal-Template structure:
- SiteNavigation
- Hero (Variant=minimal, Aside=off)
- Legal header block
- Updated-date card
- Repeated legal section cards
- SiteFooter

Do not invent new page names or component set names.
```

## Validación rápida

```bash
pnpm figma:pull:file -- --raw
pnpm figma:audit:screens
```

Reporte: `design/figma/snapshots/screens-audit.json`.
