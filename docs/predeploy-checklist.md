# Predeploy Checklist

Checklist rapido para publicar `muga.dev` (marketing) y `cliente.muga.dev` (plataforma).

## 1) Variables de entorno

### apps/web

- `NEXT_PUBLIC_CLIENT_APP_URL=https://cliente.muga.dev`
- `NEXT_PUBLIC_SITE_URL=https://muga.dev`

### apps/cliente

- `NEXT_PUBLIC_SUPABASE_URL=<supabase-url>`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>`
- `SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>`
- `INTERNAL_ALLOWED_EMAILS=<emails permitidos>`
- `INTERNAL_ALLOWED_DOMAINS=muga.dev,cliente.muga.dev`
- `NEXT_PUBLIC_MARKETING_URL=https://muga.dev`
- `CLIENT_PORTAL_BASE_URL=https://cliente.muga.dev`
- `INVITE_TOKEN_SECRET=<secreto-largo-aleatorio>`
- `INVITE_TOKEN_TTL_HOURS=72`

## 2) Supabase Auth

- En `Authentication > URL Configuration`:
  - Site URL: `https://cliente.muga.dev`
  - Redirect URLs:
    - `https://cliente.muga.dev/auth/callback`
    - `http://localhost:3001/auth/callback` (solo local)

## 3) DNS en Hostinger

- Mantener `muga.dev` donde corresponda.
- Crear registro CNAME:
  - Host: `cliente`
  - Value: `cname.vercel-dns.com`

## 4) Deploy

- Deploy `apps/web` y `apps/cliente`.
- Verificar HTTPS activo en ambos dominios.

## 5) Smoke test final

- `https://muga.dev` carga correctamente.
- CTA "Area cliente" redirige a `https://cliente.muga.dev/acceso`.
- Link de invitacion (`/acceso/<slug>?inv=<token>`) redirige a `/login?invited=1`.
- Login funciona y callback no falla.
- `/internal/projects` responde autenticado.
- `pnpm smoke:e2e` en entorno local/staging sin errores.

## 6) Validacion tecnica

- `pnpm lint` sin errores.
- `pnpm build` sin errores.
- `pnpm smoke:release` sin errores.
- Revisar warning pendiente en `apps/cliente/src/proxy.ts:18` si se desea cerrar antes de produccion.
