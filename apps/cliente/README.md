# Muga Wizard SaaS

Generador de sitios web con wizard de opciones cerradas.

## Propuesta de valor (2026)

Muga Wizard tiene valor en 2026 como plataforma B2B para agencias que necesitan lanzar
micrositios de conversion rapido, con calidad consistente y sin depender de IA.

En lugar de un constructor generico, ofrece un flujo operativo completo para agencias:
creacion guiada de sitios con estilos cerrados, publicacion en subdominios gestionados
(`cliente.tudominio.com`) y gestion centralizada de leads por cliente o campana.

### Por que tiene valor hoy

- Velocidad operativa: pasar de brief a sitio publicado en minutos.
- Consistencia de marca: estilos y estructura controlados para evitar resultados irregulares.
- Escalabilidad para agencias: un panel para multiples clientes, campanas y miembros.
- Mas retencion: subdominios gestionados y operacion de leads en el mismo producto.
- Menos complejidad: enfoque en conversion y ejecucion, no en un builder infinito.

## Setup

### 1. Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) y crear un nuevo proyecto
2. Ir a SQL Editor y ejecutar el contenido de `supabase/schema.sql`
3. **Crear usuario demo** - Ir a Authentication > Users > Add user:
   - Email: `admin@gmail.com`
   - Password: `admin123`
   - Confirm password: `admin123`

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Editar `.env.local` con:
- `NEXT_PUBLIC_SUPABASE_URL` - URL del proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon Key de Supabase (Settings > API)
- `INTERNAL_ALLOWED_EMAILS` - lista de emails internos separados por coma
- `INTERNAL_ALLOWED_DOMAINS` - lista de dominios internos separados por coma (opcional)

Opcional (solo demo local):

- `ENABLE_INTERNAL_DEMO_LOGIN=true`
- `NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN=true`

### 3. Configurar Auth en Supabase

1. Ir a Authentication > Providers
2. Habilitar Email/Password
3. Habilitar Google OAuth (opcional)
4. Habilitar GitHub OAuth (opcional)

### 4. Configurar Redirect URLs

En Supabase Authentication > URL Configuration:
- Site URL: `http://localhost:3000`
- Add redirect URL: `http://localhost:3000/auth/callback`

### 5. Ejecutar

```bash
pnpm dev
```

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page público |
| `/login` | Iniciar sesión |
| `/register` | Registrarse |
| `/pricing` | Planes y pricing |
| `/dashboard` | Dashboard principal |
| `/dashboard/sites` | Lista de sitios |
| `/dashboard/sites/new` | Crear nuevo sitio |
| `/dashboard/sites/[id]` | Editor del sitio |
| `/dashboard/settings` | Settings y plan |
| `/preview/[id]` | Preview del sitio |
| `/api/payment/mercadopago` | API de pagos (demo) |

## Features implementados

- [x] Landing page público con navbar
- [x] Auth con email/password
- [x] OAuth con Google y GitHub
- [x] Dashboard con overview de sitios
- [x] CRUD de sitios
- [x] Wizard de creación de sitios
- [x] Sistema de leads
- [x] Editor de contenidos
- [x] Editor de colores
- [x] Preview en vivo
- [x] Export a ZIP
- [x] Pricing con MercadoPago (demo)
- [x] Settings con cambio de plan

## Flujo operativo real (hoy)

1. El lead entra desde `apps/web` al endpoint `/api/contacto`.
2. El equipo revisa y aprueba en `/admin`.
3. La aprobacion provisiona cliente + proyecto + acceso en portal.
4. El cliente recibe email de acceso con usuario + clave temporal.
5. El cliente entra a `/portal` para seguimiento, comentarios y archivos.

Documentacion operativa oficial:

- `docs/operations/workflow-end-to-end.md`
- `docs/operations/admin-runbook.md`
- `docs/operations/client-portal-guide.md`
- `docs/operations/onboarding-and-access.md`
- `docs/architecture/system-communication-map.md`

Roadmap de paridad visual:

- `apps/cliente/docs/visual-parity-rollout.md`

## Planes

| Plan | Precio | Sitios |
|------|--------|--------|
| Free | $0 | 1 |
| Pro | $4.900/mes | 5 |
| Agency | $9.900/mes | Ilimitados |

## Roadmap

- [ ] Webhooks reales de MercadoPago
- [ ] Dominio personalizado
- [ ] Editor visual avanzado
- [ ] Analytics completo
