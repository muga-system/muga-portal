# Checklist Operativo - Carga en Figma (Web Wave 1)

Secuencia recomendada para cargar la base del sitio a Figma sin codegen 1:1.

## 0) Baseline del repo

- [ ] Confirmar scope Wave 1: `home`, `contacto`, `modelo`, `legal-template`.
- [ ] Excluir `nosotros`, `admin`, `apps/cliente`.
- [ ] Confirmar componentes base en codigo:
  - [ ] `apps/web/src/components/site-navigation.tsx`
  - [ ] `apps/web/src/components/site-footer.tsx`
  - [ ] `apps/web/src/components/page-hero.tsx`
  - [ ] `apps/web/src/components/contact-form.tsx`
  - [ ] `apps/web/src/components/legal-page.tsx`

## 1) 00 Foundations

- [ ] Crear colecciones de variables en Figma:
  - [ ] `color/*`
  - [ ] `typography/*`
  - [ ] `space/*`
  - [ ] `radius/*` (recto)
  - [ ] `border/*`
  - [ ] `elevation/*`
  - [ ] `motion/*`
- [ ] Mapear base de color contra `packages/ui/styles/muga-theme.css`.
- [ ] Definir escala tipografica para hero, titulo seccion, lead, body y labels.
- [ ] Definir espaciados semanticos de seccion (`compact`, `default`, `feature`, `lg`).
- [ ] Definir estado focus visible compartido para inputs, links y botones.

## 2) 01 Components

- [ ] `Muga/Navigation/SiteNavigation`
  - [ ] Desktop state
  - [ ] Mobile drawer state
  - [ ] Link active/inactive
- [ ] `Muga/Layout/SiteFooter`
  - [ ] Grupo principal de links
  - [ ] Grupo legal
  - [ ] CTA principal
- [ ] `Muga/Hero/PageHero`
  - [ ] `Variant=default`
  - [ ] `Variant=feature`
  - [ ] `Variant=minimal`
- [ ] `Muga/Badge/Base`
  - [ ] `Size=sm`
  - [ ] `Size=md`
- [ ] `Muga/Surface/Card`
  - [ ] `Tone=default`
  - [ ] `State=hover`
- [ ] `Muga/Link/Secondary`
  - [ ] `State=default|hover|focus`
- [ ] `Muga/Form/ContactForm`
  - [ ] Inputs text/email/tel
  - [ ] Select
  - [ ] Textarea
  - [ ] Submit states
  - [ ] Error state

## 3) 02 Screens

- [ ] `Home` (`apps/web/src/app/page.tsx`)
  - [ ] Hero
  - [ ] Sistema/Pilares
  - [ ] Referencias
  - [ ] Inversion
  - [ ] FAQ
  - [ ] Contacto
- [ ] `Contacto` (`apps/web/src/app/contacto/page.tsx`)
  - [ ] Hero + aside
  - [ ] Steps
  - [ ] Formulario
- [ ] `Modelo` (`apps/web/src/app/modelo/page.tsx`)
  - [ ] Hero + aside
  - [ ] Grid tipo bento
  - [ ] CTA final
- [ ] `Legal Template` (`apps/web/src/components/legal-page.tsx`)
  - [ ] Header legal
  - [ ] Card de fecha
  - [ ] Bloques de seccion

## 4) Mapping y contrato

- [ ] Completar `docs/figma-component-mapping-web.md`.
- [ ] Completar Node IDs reales en filas `TBD`.
- [ ] Confirmar que cada componente Figma tenga equivalente React.
- [ ] Registrar decisiones de variantes nuevas (si aparecen).

## 5) Pull tecnico y assets

- [ ] Ejecutar `pnpm figma:pull`.
- [ ] Validar artefactos en `design/figma/snapshots/`.
- [ ] Crear/actualizar `design/figma/assets-manifest.json`.
- [ ] Ejecutar `pnpm figma:export:assets --manifest=design/figma/assets-manifest.json --format=svg --out=design/figma/assets`.

## 6) QA visual

- [ ] Desktop (`>=1280`): layout y jerarquia.
- [ ] Tablet (`~768`): reflow y legibilidad.
- [ ] Mobile (`~390`): stacking y targets tactiles.
- [ ] Estados: hover/focus/active/disabled.
- [ ] Contraste AA en texto y controles.
- [ ] Consistencia de spacing y tipografia entre pantallas.

## 7) Cierre de iteracion

- [ ] Delta Figma documentado (componentes, variantes, tokens, screens).
- [ ] Delta codigo aplicado en `apps/web` y/o `packages/ui`.
- [ ] QA cerrado con observaciones resueltas.
- [ ] Listo para nueva vuelta Figma -> codigo.
