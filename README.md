# Muga Platform

Plataforma B2B para gestión de clientes, proyectos y leads.

## Stack

- Next.js 16 + React 19
- Supabase (Auth + Database)
- UI: shadcn/ui + TailwindCSS 4

## Estructura

```
apps/
├── cliente/      # Panel admin + Portal clientes (puerto 3001)
└── web/         # Sitio público (marketing, puerto 3000)
```

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Puertos:
- `web`: `http://localhost:3000`
- `cliente`: `http://localhost:3001`

## Rutas principales (cliente)

| Ruta | Descripción |
|------|-------------|
| `/` | Landing público |
| `/login` | Autenticación |
| `/admin` | Panel de administración |
| `/admin/leads` | Gestión de leads |
| `/admin/proyectos` | Proyectos |
| `/portal` | Portal del cliente |

## Docs

- `docs/operations/` - Guías operativas (end-to-end, admin, portal, onboarding)
- `docs/architecture/` - Arquitectura técnica