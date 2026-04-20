# Deployment Runbook: Hostinger + Vercel

Objetivo: publicar rapido `muga.dev` (web) y `cliente.muga.dev` (admin + portal) usando Hostinger solo para dominio/DNS y Vercel para ejecucion Next.js.

## Arquitectura (fase actual)

- `apps/web` -> Vercel Project `web`
- `apps/cliente` -> Vercel Project `cliente`
- `apps/api` -> no se publica en esta fase
- Dominio y DNS -> Hostinger (hPanel)
- Auth y datos -> Supabase
- Email transaccional -> SMTP

## Prerrequisitos

1. Repo actualizado en `main`.
2. Cuenta Vercel con acceso al repo.
3. Dominio gestionado en Hostinger.
4. Proyecto Supabase operativo.

## Paso 1: crear proyectos en Vercel

Crear dos proyectos desde el mismo repo:

1. Proyecto `web`:
   - Root Directory: `apps/web`
   - Framework: Next.js
2. Proyecto `cliente`:
   - Root Directory: `apps/cliente`
   - Framework: Next.js

Nota: no crear proyecto para `apps/api` en esta fase.

## Paso 2: variables de entorno en Vercel

Cargar en ambos entornos (Production + Preview).

### Proyecto `web`

- `NEXT_PUBLIC_CLIENT_APP_URL=https://cliente.muga.dev`
- `NEXT_PUBLIC_SITE_URL=https://muga.dev`
- `SUPABASE_URL=<supabase-url>`
- `SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>`
- `SUPABASE_LEADS_TABLE=leads` (si aplica)
- `SMTP_HOST=<smtp-host>`
- `SMTP_PORT=<smtp-port>`
- `SMTP_USER=<smtp-user>`
- `SMTP_PASS=<smtp-pass>`
- `ALERT_FROM_EMAIL=<sender>`
- `ALERT_TO_EMAIL=<destino>`
- `FEATURE_ANALYTICS_INGEST=<true|false>` (opcional)
- `NEXT_PUBLIC_FEATURE_ANALYTICS_CLIENT=<true|false>` (opcional)
- `ANALYTICS_INGEST_KEY=<secret>` (opcional)
- `NEXT_PUBLIC_ANALYTICS_INGEST_KEY=<public-key>` (opcional)

### Proyecto `cliente`

- `NEXT_PUBLIC_SUPABASE_URL=<supabase-url>`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>`
- `SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>`
- `INTERNAL_ALLOWED_EMAILS=<emails internos>`
- `INTERNAL_ALLOWED_DOMAINS=muga.dev,cliente.muga.dev`
- `NEXT_PUBLIC_MARKETING_URL=https://muga.dev`
- `CLIENT_PORTAL_URL=https://cliente.muga.dev/acceso`
- `CLIENT_PORTAL_BASE_URL=https://cliente.muga.dev`
- `INVITE_TOKEN_SECRET=<random-secret>`
- `INVITE_TOKEN_TTL_HOURS=72`
- `SMTP_HOST=<smtp-host>`
- `SMTP_PORT=<smtp-port>`
- `SMTP_USER=<smtp-user>`
- `SMTP_PASS=<smtp-pass>`
- `ALERT_FROM_EMAIL=<sender>`
- `FEATURE_ADMIN_ANALYTICS=<true|false>` (opcional)

## Paso 3: dominios en Vercel

1. En proyecto `web`, agregar dominio: `muga.dev`.
2. En proyecto `cliente`, agregar dominio: `cliente.muga.dev`.
3. Obtener los registros DNS solicitados por Vercel para cada dominio.

## Paso 4: DNS en Hostinger

En hPanel -> DNS Zone Editor:

1. Cargar exactamente los registros que pide Vercel.
2. Si no hay instruccion especifica, usar fallback habitual:
   - Apex (`muga.dev`): registro `A` al valor provisto por Vercel.
   - Subdominio (`cliente`): registro `CNAME` a `cname.vercel-dns.com`.
3. Eliminar/ajustar registros en conflicto.

## Paso 5: Supabase Auth

En Supabase -> Authentication -> URL Configuration:

- Site URL: `https://cliente.muga.dev`
- Redirect URLs:
  - `https://cliente.muga.dev/auth/callback`
  - `http://localhost:3001/auth/callback` (solo dev local)

## Paso 6: validacion tecnica previa a go-live

Desde el repo:

```bash
pnpm lint
pnpm build
pnpm smoke:release
pnpm smoke:e2e
```

## Paso 7: smoke funcional en produccion

1. `https://muga.dev` carga correctamente.
2. CTA "Area cliente" abre `https://cliente.muga.dev/acceso`.
3. Login y callback en `cliente` funcionan.
4. Aprobacion de lead en `/admin` funciona.
5. Usuario no autenticado en `/portal` redirige a `/acceso`.
6. Emails operativos llegan (alerta interna + respuesta/acceso).

## Paso 8: observacion de 24 horas

1. Revisar errores de runtime en Vercel (`web` y `cliente`).
2. Revisar logs de rutas API de Next.
3. Verificar errores de auth/callback en Supabase.
4. Confirmar que no hay operaciones fuera de plataforma para el flujo lead->portal.

## Fase siguiente (no incluida ahora)

Cuando `apps/api` tenga endpoints de negocio:

1. Definir si queda en Vercel Functions o servicio dedicado.
2. Replantear DNS/subdominio de API.
3. Agregar smoke dedicado para API real.

## Referencias oficiales

- Vercel custom domains: https://vercel.com/docs/domains/set-up-custom-domain
- Hostinger DNS zone editor: https://www.hostinger.com/support/how-to-use-hostingers-dns-zone-editor/
- Hostinger CNAME: https://www.hostinger.com/support/4738777-how-to-manage-cname-records-at-hostinger
