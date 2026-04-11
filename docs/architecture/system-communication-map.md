# Mapa de comunicacion entre partes (estado actual)

Vista tecnica simplificada de como se conectan `apps/web` y `apps/cliente`.

## Modulos

- Sitio publico: `apps/web`
- Operacion interna + portal cliente: `apps/cliente`
- Datos/autenticacion: Supabase
- Correo transaccional: SMTP (nodemailer)

## Flujo de datos

### 1) Captura comercial

`apps/web/contact-form` -> `POST /api/contacto` -> Supabase (`leads`) -> correo interno + correo de respuesta

### 2) Operacion interna

`/admin` -> aprobar lead -> `approveLeadAndProvisionAccess()`

Provisioning actual:

- usuario en auth
- profile
- client
- project
- stages + deliverable inicial
- lead actualizado a `approved`

### 3) Habilitacion de cliente

`approveLeadAndProvisionAccess()` -> email de acceso (usuario + clave temporal)

### 4) Seguimiento colaborativo

Admin (`/admin/projects/[id]`) y cliente (`/portal`) leen/escriben sobre las mismas entidades:

- `projects`
- `project_stages`
- `deliverables`
- `comments`
- `files`
- `activity`

## Entidades principales

- Lead: origen comercial inicial.
- Client: cuenta/logica de acceso cliente.
- Project: unidad de trabajo principal.
- Deliverable: compromiso por etapa.
- Comment/File: colaboracion y evidencia.

## Contrato operativo

- Toda decision relevante debe reflejarse en estas entidades.
- Evitar estados paralelos fuera del sistema.
