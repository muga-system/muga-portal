# Workflow end-to-end (estado actual real)

Este documento describe el flujo real hoy en produccion/desarrollo, sin supuestos.

## Resumen rapido

1. Usuario envia consulta desde `apps/web`.
2. Lead se guarda en base y se notifican correos.
3. Admin revisa lead en `apps/cliente` (`/admin`).
4. Admin aprueba lead y habilita portal.
5. Cliente recibe email con acceso (usuario + clave temporal).
6. Cliente entra a `/portal` y colabora en el proyecto.

## Etapa 1 - Captura en sitio publico

- UI: `apps/web/src/components/contact-form.tsx`
- Endpoint: `apps/web/src/app/api/contacto/route.ts`

Entrada:

- Formulario (nombre, email, mensaje, contexto comercial).

Proceso actual:

- Validacion de campos obligatorios.
- Anti-spam basico (honeypot + rate limit por email en Supabase).
- Insercion de lead en tabla (`SUPABASE_LEADS_TABLE`, default `leads`).
- Envio de correo interno de alerta y correo de respuesta al cliente (si SMTP activo).

Salida:

- Redireccion a `/contacto/enviado`.
- Lead disponible para operacion en admin.

## Etapa 2 - Operacion interna (admin)

- UI: `apps/cliente/src/app/admin/page.tsx`
- Aprobacion: `apps/cliente/src/app/admin/leads/[id]/approve/route.ts`
- Provisioning: `apps/cliente/src/lib/client-onboarding.ts`

Entrada:

- Lead nuevo en estado `new`.

Proceso actual al aprobar:

- Se valida acceso de admin interno.
- Se crea/actualiza usuario en Supabase Auth.
- Se crea/actualiza perfil, cliente y proyecto.
- Se inicializan etapas y entregable base cuando corresponde.
- Se actualiza lead a `approved`.
- Se envia email de acceso al cliente (usuario + clave temporal).

Salida:

- Cliente con `portal_status = accepted`.
- Proyecto listo para seguimiento interno/externo.

## Etapa 3 - Acceso cliente y colaboracion

- Layout portal: `apps/cliente/src/app/portal/layout.tsx`
- Vista portal: `apps/cliente/src/app/portal/page.tsx`

Entrada:

- Cliente autenticado y aceptado.

Proceso actual:

- Ve pipeline, entregables, comentarios, archivos y actividad.
- Puede enviar feedback/comentarios y subir archivos (segun rutas del portal).

Salida:

- Operacion trazable por proyecto dentro de plataforma.

## Etapa 4 - Ejecucion y cierre

- Admin detalle proyecto: `apps/cliente/src/app/admin/projects/[id]/page.tsx`

Proceso actual:

- Admin gestiona estados de entregables.
- Admin registra comentarios y archivos.
- Cliente ve estado sincronizado en portal.

Salida:

- Historial de actividad y estado final del proyecto.

## Nota importante (estado actual)

- El acceso del cliente se envia hoy por email con **clave temporal**.
- No hay hoy un flujo implementado de "token magico de onboarding" dedicado.
- Si se implementa luego, debe documentarse como "estado futuro" y no reemplazar este flujo hasta estar activo.
