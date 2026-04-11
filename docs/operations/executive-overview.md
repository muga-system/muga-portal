# Resumen ejecutivo del flujo (MUGA)

Documento de una pagina para alinear negocio, operacion y producto.

## Que problema resuelve este sistema

- Evita perder consultas comerciales entre formularios, emails y chats sueltos.
- Ordena el paso de lead a cliente activo con trazabilidad.
- Centraliza ejecucion y feedback en un portal unico hasta publicacion.

## Flujo de negocio real (hoy)

1. **Captura**: el usuario completa formulario en `apps/web`.
2. **Triage**: el equipo revisa leads en `apps/cliente` (`/admin`).
3. **Aprobacion**: admin aprueba lead y provisiona cliente + proyecto.
4. **Habilitacion**: cliente recibe email de acceso (usuario + clave temporal).
5. **Ejecucion**: cliente y equipo colaboran en `/portal` (pipeline, entregables, comentarios, archivos).
6. **Cierre**: proyecto llega a etapa final con historial completo y verificable.

## Como se conectan las partes

- `apps/web` captura la demanda.
- `apps/cliente` opera la demanda y ejecuta proyectos.
- Supabase concentra autenticacion y datos.
- SMTP notifica a equipo y cliente en momentos clave.

## Valor operativo

- Menos retrabajo por falta de contexto.
- Menos dependencia de canales paralelos.
- Mejor tiempo de respuesta y claridad de estado.
- Mejor experiencia para cliente y equipo interno.

## Roles y responsabilidad

- **Admin interno**: califica, aprueba, define avance y mantiene estado real.
- **Cliente aceptado**: aporta feedback y archivos dentro del portal.
- **Sistema**: valida acceso por rol y conserva trazabilidad.

## KPIs sugeridos (seguimiento mensual)

- Leads nuevos por semana.
- Tasa de aprobacion de leads.
- Tiempo medio lead -> portal habilitado.
- Tiempo medio por etapa del proyecto.
- Cantidad de iteraciones por entregable.

## Riesgo principal a controlar

- Operar fuera de plataforma (chat/mail) sin registrar decisiones.

Mitigacion:

- Toda decision importante debe quedar en comentarios/entregables/actividad del proyecto.

## Estado actual y siguiente paso

- **Estado actual**: flujo operativo activo y documentado.
- **Siguiente paso recomendado**: instrumentar tablero de KPIs con corte semanal para gestion de capacidad y conversion.

## Referencias

- `docs/operations/workflow-end-to-end.md`
- `docs/operations/admin-runbook.md`
- `docs/operations/client-portal-guide.md`
- `docs/operations/onboarding-and-access.md`
- `docs/architecture/system-communication-map.md`
