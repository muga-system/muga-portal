# Figma <> React Mapping - Web (Wave 1)

## Scope

- In: `home`, `contacto`, `modelo`, `legal-template`.
- Out: `nosotros`, `admin`, `apps/cliente`.

## Convenciones

### Naming Figma

- Pages: `00 Foundations`, `01 Components`, `02 Screens`.
- Components: `Muga/<Categoria>/<Componente>`.
- Variants: `Size=sm|md|lg`, `State=default|hover|focus|disabled`, `Tone=primary|secondary|muted`.

### Naming Codigo

- React components: `PascalCase`.
- Props variants: `variant`, `size`, `state` (cuando aplique).
- Tokens: usar variables de `packages/ui/styles/muga-theme.css`.

## Tabla de Mapping

| Figma Node ID | Figma Component | Variant Props | Screen Usage | React Path | React Component | Props Mapping | Token/Class Mapping | Assets | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  | todo/in-progress/done |  |

## Ejemplos iniciales (base actual del repo)

| Figma Node ID | Figma Component | Variant Props | Screen Usage | React Path | React Component | Props Mapping | Token/Class Mapping | Assets | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| TBD | Muga/Navigation/SiteNavigation | State=default | Home, Contacto, Modelo, Legal | apps/web/src/components/site-navigation.tsx | SiteNavigation | `navItems[] -> links` | `navbar-scrolled`, `--color-obscure`, `--color-accent`, `border-white/10` | `/logo/logo.png` | in-progress | Mantener comportamiento mobile menu |
| TBD | Muga/Hero/PageHero | Variant=default|feature|minimal | Contacto, Modelo, Legal, internas | apps/web/src/components/page-hero.tsx | PageHero | `badge`, `title`, `description`, `variant`, `aside` | `muga-badge`, escala tipografica hero, spacing de seccion | none | in-progress | No romper API actual de props |
| TBD | Muga/Form/ContactForm | State=default|focus|error|submitting | Home, Contacto | apps/web/src/components/contact-form.tsx | ContactForm | estados de envio + campos | `muga-select`, focus ring, `muga-surface` | none | todo | Validar estados error y disabled |
| TBD | Muga/Layout/SiteFooter | State=default | Todas las paginas publicas | apps/web/src/components/site-footer.tsx | SiteFooter | links primarios + legales | `muga-badge`, `muga-surface`, `border-white/10` | none | todo | Mantener enlace Area cliente |
| TBD | Muga/Legal/SectionCard | Tone=default | Privacidad, Cookies, Terminos | apps/web/src/components/legal-page.tsx | LegalPage | `sections[] -> cards` | `muga-surface`, `section-title`, `section-lead` | none | todo | Template unico para 3 paginas |

## Reglas de Sync

1. No crear estilos hardcodeados si existe token o clase semantica.
2. Si falta variante, se agrega al sistema (no override puntual de pantalla).
3. Cada cambio Figma debe referenciar Node ID.
4. Cada sync tecnico cierra con QA visual por pantalla y breakpoint.

## QA por item mapeado

- Desktop (`>=1280`) OK/KO.
- Tablet (`~768`) OK/KO.
- Mobile (`~390`) OK/KO.
- Hover/Focus/Active OK/KO.
- Contrast AA OK/KO.
- Spacing/Typography OK/KO.
