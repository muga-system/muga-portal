# Baseline v1 - apps/web

Fecha: 2026-04-04

## Scope Wave 1

- In: `home`, `contacto`, `modelo`, `legal-template`.
- Out: `nosotros`, `admin`, `apps/cliente`.

## Rutas publicas detectadas

- `/` (`apps/web/src/app/page.tsx`)
- `/contacto` (`apps/web/src/app/contacto/page.tsx`)
- `/contacto/enviado` (`apps/web/src/app/contacto/enviado/page.tsx`)
- `/modelo` (`apps/web/src/app/modelo/page.tsx`)
- `/formatos` (`apps/web/src/app/formatos/page.tsx`)
- `/casos` (`apps/web/src/app/casos/page.tsx`)
- `/criterios` (`apps/web/src/app/criterios/page.tsx`)
- `/nosotros` (`apps/web/src/app/nosotros/page.tsx`)
- `/privacidad` (`apps/web/src/app/privacidad/page.tsx`)
- `/cookies` (`apps/web/src/app/cookies/page.tsx`)
- `/terminos` (`apps/web/src/app/terminos/page.tsx`)

## Componentes base relevantes

- `SiteNavigation` (`apps/web/src/components/site-navigation.tsx`)
- `SiteFooter` (`apps/web/src/components/site-footer.tsx`)
- `PageHero` (`apps/web/src/components/page-hero.tsx`)
- `ContactForm` (`apps/web/src/components/contact-form.tsx`)
- `LegalPage` (`apps/web/src/components/legal-page.tsx`)
- `SiteBreadcrumb` (`apps/web/src/components/site-breadcrumb.tsx`)

## Tokens y estilos base

- Tokens compartidos: `packages/ui/styles/muga-theme.css`.
- Estilos web: `apps/web/src/app/globals.css`.
- Clases semanticas clave:
  - `page-container`
  - `section-space*`
  - `muga-badge*`
  - `muga-surface`
  - `secondary-link`

## Assets publicos usados por Wave 1

- Logo: `apps/web/public/logo/logo.png`
- Iconos: `apps/web/public/icons/*.svg` (subset usado en `modelo` y `criterios`)

## Estado de conexion Figma

- Archivo conectado: `QrJQQfCKrZdeDPMMLLcXAr`.
- `pnpm figma:pull:file`: OK.
- `pnpm figma:pull:variables`: requiere scope `file_variables:read` (Enterprise plan only).
- `pnpm figma:export:assets`: OK con IDs o URLs de nodos.
