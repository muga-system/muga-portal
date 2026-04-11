# Backlog Hibrido Muga

Backlog operativo para ejecutar el modelo hibrido en 3 sprints.

Referencia de inicio rapido: `docs/arranque-dia-1-hibrido.md`

## Sprint 1 (10 dias) - Base interna

Objetivo:
- Tener operacion interna usable sin acceso cliente.

Items:
- [ ] Crear esquema base: `clients`, `projects`, `project_stages`, `deliverables`, `comments`, `project_files`, `activity_log`.
- [ ] Implementar permisos base por rol interno (`owner_muga`, `manager_muga`).
- [ ] Vista interna de pipeline de proyectos.
- [ ] CRUD de entregables por etapa.
- [ ] Estados de entregable (`pendiente`, `revision`, `aprobado`, `cambios`).
- [ ] Timeline de actividad automatica por evento.

Criterio de aceptacion:
- Equipo Muga puede crear un proyecto completo y recorrer al menos 1 ciclo de revision sin usar hojas externas.

## Sprint 2 (10 dias) - Apertura cliente minima

Objetivo:
- Habilitar una vista cliente simple para revisiones y aprobaciones.

Items:
- [ ] Login de cliente con acceso solo a su proyecto.
- [ ] Vista de progreso por etapas.
- [ ] Comentarios en entregables.
- [ ] Botones de cliente: aprobar / solicitar cambios.
- [ ] Centro de archivos de proyecto (lectura para cliente, escritura para equipo Muga).
- [ ] Notificacion basica por email en evento de revision.

Criterio de aceptacion:
- Cliente puede revisar, comentar y aprobar entregables sin salir del portal.

## Sprint 3 (10 dias) - Endurecimiento y adopcion

Objetivo:
- Asegurar operacion estable con clientes reales.

Items:
- [ ] Hardening de permisos y casos limite.
- [ ] Mejoras de UX (empty states, copy de estados, consistencia de acciones).
- [ ] Registro de metricas base (tiempo de revision, aprobaciones por iteracion).
- [ ] Guion de onboarding para clientes.
- [ ] Protocolo interno para obligar feedback por portal.
- [ ] Piloto con 2-3 clientes activos.

Criterio de aceptacion:
- Al menos 2 clientes operan en el portal y completan revisiones reales.

## Priorizacion continua

- `P0`: funcionalidad bloqueante para que exista flujo de trabajo.
- `P1`: mejora directa de adopcion y calidad operativa.
- `P2`: optimizaciones no bloqueantes.

## Definicion de terminado (DoD)

Un item esta terminado cuando:
1. Cumple criterio de aceptacion funcional.
2. Respeta permisos por rol.
3. Queda trazado en actividad/timeline cuando aplica.
4. Tiene copy y estados claros para equipo y cliente.
