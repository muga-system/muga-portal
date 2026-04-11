# Admin runbook (operacion diaria)

Guia practica para administrar leads, proyectos y portal cliente.

## Rutina diaria recomendada

1. Revisar leads nuevos en `/admin`.
2. Priorizar leads con mejor contexto (objetivo + problema + contacto valido).
3. Aprobar solo cuando se pueda abrir proyecto con criterio.
4. Revisar proyectos activos y actualizar estados.
5. Responder comentarios y registrar archivos pendientes.

## Flujo de aprobacion de lead

Ruta:

- `apps/cliente/src/app/admin/page.tsx`

Accion:

- Boton: "Aprobar y habilitar portal".

Efecto esperado:

- Se crea/actualiza cliente.
- Se crea/actualiza proyecto.
- Lead pasa a `approved`.
- Cliente recibe email de acceso (usuario + clave temporal).

## Checklist antes de aprobar

- [ ] Email del lead valido.
- [ ] Mensaje con contexto minimo (objetivo/problema).
- [ ] Tipo de proyecto razonable para iniciar.
- [ ] Capacidad operativa para absorber onboarding.

## Operacion por proyecto

Ruta:

- `apps/cliente/src/app/admin/projects/[id]/page.tsx`

Buenas practicas:

- Actualizar estados de entregables sin saltar etapas.
- Centralizar feedback en comentarios del proyecto.
- Registrar archivos con nombre claro y etapa asociada.
- Evitar resolver seguimiento por canales externos sin dejar rastro.

## Criterio de calidad operativa

- Todo cambio relevante deja registro en plataforma.
- Cliente ve informacion consistente con el estado real.
- No hay acciones "ocultas" fuera del flujo principal.

## Invariantes UI del lector de documentacion admin

Estas reglas se dejan fijas para evitar regresiones visuales en `/admin/documentacion/md/*`.

- El rail inferior del lector debe usar la misma altura que el bloque `Cerrar sesion` del sidebar.
- El valor fuente es `--muga-admin-sidebar-footer-height` en `apps/cliente/src/app/globals.css`.
- El fondo del lector y del rail inferior debe ser solido (`var(--color-obscure)`), sin transparencia.
- El texto nunca debe quedar oculto detras del rail inferior; el viewport debe reservar padding inferior.
- Debe existir una sola linea superior del rail inferior (sin doble borde).

## Checklist de cierre de etapa

- [ ] Estado actualizado.
- [ ] Entregable asociado actualizado.
- [ ] Comentario de contexto publicado.
- [ ] Archivos de soporte cargados (si aplica).
