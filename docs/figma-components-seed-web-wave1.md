# Figma Components Seed - Web Wave 1

Usa este documento para construir `01 Components` con naming y variantes compatibles con el repo.

## 1) Navigation

Component: `Muga/Navigation/SiteNavigation`

Variants:

- `State=desktop`
- `State=mobile-closed`
- `State=mobile-open`
- `Link=default|active|hover`

Referencia codigo: `apps/web/src/components/site-navigation.tsx`.

## 2) Footer

Component: `Muga/Layout/SiteFooter`

Variants:

- `State=default`

Sub-bloques:

- bloque CTA
- links primarios
- links legales

Referencia codigo: `apps/web/src/components/site-footer.tsx`.

## 3) Hero

Component: `Muga/Hero/PageHero`

Variants:

- `Variant=default`
- `Variant=feature`
- `Variant=minimal`
- `Aside=off|on`

Referencia codigo: `apps/web/src/components/page-hero.tsx`.

## 4) Badge

Component: `Muga/Badge/Base`

Variants:

- `Size=sm|md`
- `State=default`

Referencia: clases `muga-badge`, `muga-badge--sm`, `muga-badge--md` en `packages/ui/styles/muga-theme.css`.

## 5) Surface and secondary link

Components:

- `Muga/Surface/Card`
- `Muga/Link/Secondary`

Variants:

- Surface: `State=default|hover`
- Secondary link: `State=default|hover|focus`

Referencia: `muga-surface`, `secondary-link`, `secondary-link__arrow`.

## 6) Contact form primitives

Components:

- `Muga/Form/Input`
- `Muga/Form/Select`
- `Muga/Form/Textarea`
- `Muga/Form/Submit`
- `Muga/Form/ErrorMessage`

Variants:

- `State=default|focus|error|disabled`

Referencia codigo: `apps/web/src/components/contact-form.tsx`.

## 7) Definition of Done (Components)

- Todos los componentes anteriores creados bajo `01 Components`.
- Variantes nombradas con convención fija.
- Estados de foco y hover definidos.
- Sin hardcode de color/tipografia fuera de tokens de foundations.
