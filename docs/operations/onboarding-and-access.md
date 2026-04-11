# Onboarding y accesos (estado actual)

Control de acceso por rol y rutas de entrada en `apps/cliente`.

## Roles actuales

- `guest`
- `internal_admin`
- `client_pending`
- `client_accepted`

Resolucion de rol:

- `apps/cliente/src/lib/access-resolver.ts`

Configuracion recomendada de acceso interno:

- `INTERNAL_ALLOWED_EMAILS=admin@tu-dominio.com,ops@tu-dominio.com`
- `INTERNAL_ALLOWED_DOMAINS=tu-dominio.com` (opcional)

Modo demo interno (solo local):

- `ENABLE_INTERNAL_DEMO_LOGIN=true`
- `NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN=true`

## Rutas y redirecciones

- Admin:
  - layout: `apps/cliente/src/app/admin/layout.tsx`
  - acceso valido: `internal_admin` (o sesion demo interna)
  - no valido: redireccion a `/acceso`

- Portal:
  - layout: `apps/cliente/src/app/portal/layout.tsx`
  - acceso valido: `client_accepted`
  - `internal_admin`: redireccion a `/admin`
  - `client_pending`: redireccion a `/acceso`
  - `guest`: redireccion a `/acceso`

## Flujo de onboarding real hoy

1. Admin aprueba lead en `/admin`.
2. Se provisiona usuario/cliente/proyecto.
3. Se marca cliente como `accepted`.
4. Se genera invitacion de un solo uso con URL amigable (`/acceso/<slug>?inv=<token>`).
5. Se envia email con enlace unico + credenciales temporales.
6. Cliente abre `/acceso/<slug>?inv=<token>`, confirma activacion y luego ingresa a `/acceso` para acceder a `/portal`.

Variables de entorno para invitaciones:

- `CLIENT_PORTAL_BASE_URL=https://cliente.muga.dev`
- `INVITE_TOKEN_SECRET=<secreto-largo>`
- `INVITE_TOKEN_TTL_HOURS=72`

Guardrail actual:

- No se provisiona portal cliente para emails internos (admin/ops).

## Seguridad operativa minima

- No compartir claves temporales por canales no seguros.
- El enlace de invitacion es de un solo uso y vence por TTL.
- Recomendar cambio de clave en primer ingreso.
- Mantener separacion de roles (admin vs cliente) por rutas y layout.
