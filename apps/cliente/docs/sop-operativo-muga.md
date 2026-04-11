# SOP Operativo Muga

Procedimiento estandar para operar proyectos en el Area de Clientes Muga.

## Objetivo

Estandarizar como el equipo crea proyectos, publica entregables, gestiona revisiones y cierra entregas.

## Roles

- `owner_muga`: define reglas y resuelve bloqueos.
- `manager_muga`: ejecuta el flujo diario del proyecto.
- `cliente`: revisa y aprueba entregables.

## Estados de entregable

- `pendiente`: trabajo en preparacion interna.
- `revision`: listo para feedback del cliente.
- `aprobado`: aceptado por cliente.
- `cambios`: cliente solicita ajustes.

## Flujo estandar por proyecto

1. Crear proyecto y asociarlo al cliente.
2. Crear etapas base (`brief`, `diseno`, `desarrollo`, `qa`, `publicado`).
3. Cargar brief y archivos iniciales.
4. Subir entregable de etapa y marcar `revision`.
5. Esperar respuesta del cliente:
   - Si aprueba -> marcar `aprobado` y avanzar etapa.
   - Si solicita cambios -> marcar `cambios`, ejecutar ajustes, volver a `revision`.
6. Registrar cada cambio de estado en timeline.
7. Al finalizar, subir pack final y cerrar proyecto.

## Reglas operativas

- Todo feedback del cliente se centraliza en el portal.
- No cerrar etapa sin registro de estado final.
- No avanzar a siguiente etapa si la actual no esta aprobada (salvo excepcion aprobada por owner).
- Cada entregable debe tener descripcion breve y fecha.

## SLA interno sugerido

- Respuesta inicial a comentario de cliente: < 24h habiles.
- Reentrega tras cambios menores: 24-48h habiles.
- Reentrega tras cambios mayores: plazo acordado y registrado en comentario.

## Checklists

### Inicio de proyecto

- [ ] Cliente correcto asociado.
- [ ] Etapas creadas.
- [ ] Brief cargado.
- [ ] Responsable asignado.

### Envio a revision

- [ ] Entregable subido.
- [ ] Estado en `revision`.
- [ ] Comentario de contexto agregado.
- [ ] Notificacion enviada al cliente.

### Cierre de proyecto

- [ ] Todas las etapas aprobadas.
- [ ] Archivos finales cargados.
- [ ] Timeline completo.
- [ ] Estado final del proyecto actualizado.

## Escalamiento

Escalar a `owner_muga` cuando:
- Cliente no responde por mas de 5 dias habiles.
- Hay conflicto de alcance no resuelto.
- Se requiere excepcion de flujo.

## KPIs operativos

- Tiempo promedio de revision por entregable.
- Cantidad promedio de iteraciones por etapa.
- Porcentaje de feedback fuera del portal.
- Tiempo total del proyecto de inicio a cierre.
