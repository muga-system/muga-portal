# Plan Hibrido: Area de Clientes Muga

## Objetivo

Implementar un sistema hibrido que primero optimice la operacion interna de Muga y luego habilite una vista cliente controlada, sin competir con `muga.dev`.

## Principio estrategico

`muga.dev` sigue siendo el centro comercial y de marca.
El portal no es un producto paralelo: es el area de clientes para ejecucion y seguimiento post-venta.

## Modelo hibrido

### Etapa 1: Uso interno (solo equipo Muga)

Objetivo:
- Estandarizar entregas, revisiones y trazabilidad antes de exponer nada al cliente.

Incluye:
- Proyectos y etapas (`brief`, `diseno`, `desarrollo`, `qa`, `publicado`)
- Entregables por etapa
- Estado de revision por entregable
- Timeline de actividad
- Archivos y versiones

No incluye:
- Acceso cliente
- Chat en tiempo real
- Facturacion

Resultado esperado:
- Flujo interno estable y medible en 2 a 4 semanas.

### Etapa 2: Apertura parcial al cliente (vista minima)

Objetivo:
- Dar transparencia al cliente sin convertirlo en un constructor DIY.

Incluye:
- Vista de progreso del proyecto
- Revision/aprobacion de entregables
- Comentarios por entregable
- Descarga de archivos finales

No incluye:
- Edicion libre de sitios
- Configuracion tecnica
- Funciones de auto-servicio avanzadas

Resultado esperado:
- Mejor experiencia cliente y menos friccion operativa.

## Posicionamiento para evitar competencia con muga.dev

Mensaje recomendado:
- Muga sigue ejecutando tu proyecto de punta a punta.
- El area de clientes centraliza avances, revisiones y entregables.

Reglas de marca:
- Mismo branding, mismo tono, mismo ecosistema de dominio.
- Ideal: `clientes.muga.dev` o seccion protegida dentro de `muga.dev`.
- Acceso solo para clientes activos.

## Casos de uso clave

1. Muga crea proyecto y define etapas.
2. Muga sube entregable y lo marca en revision.
3. Cliente recibe aviso y aprueba o solicita cambios.
4. Muga aplica cambios y vuelve a enviar.
5. Proyecto avanza con historial completo.
6. Cliente descarga entregables finales.

## Roles y permisos

- `owner_muga`: acceso total.
- `manager_muga`: gestiona proyectos, entregables y revisiones.
- `cliente`: ve su proyecto, comenta, aprueba/rechaza y descarga archivos.
- `colaborador_cliente` (fase posterior): acceso acotado por proyecto.

## Backlog priorizado

### P0

- Modelo de datos base:
  - `clients`
  - `projects`
  - `project_stages`
  - `deliverables`
  - `comments`
  - `project_files`
  - `activity_log`
- Permisos y aislamiento por cliente/proyecto
- Vista interna de pipeline
- Flujo de revision por entregable
- Timeline de actividad

### P1

- Login/portal de cliente
- Vista de progreso por etapas
- Comentarios y aprobaciones cliente
- Centro de archivos cliente
- Notificaciones por eventos de revision

### P2

- Plantillas por tipo de proyecto
- Reportes de tiempos por etapa
- Export de historial de aprobaciones
- Colaboradores de cliente

## KPIs

Operacion interna:
- Reduccion del tiempo medio por ciclo de revision
- Menos mensajes dispersos por WhatsApp/email
- Porcentaje de proyectos con trazabilidad completa

Experiencia cliente:
- Tiempo de respuesta en revisiones
- Porcentaje de entregables aprobados en primera o segunda iteracion
- Satisfaccion post-entrega

## Riesgos y mitigaciones

- Riesgo: parecer producto aparte.
  - Mitigacion: narrativa unica de area de clientes, mismo branding y dominio.
- Riesgo: scope creep.
  - Mitigacion: congelar MVP en seguimiento, revision y archivos.
- Riesgo: baja adopcion.
  - Mitigacion: onboarding guiado y politica interna de feedback por portal.

## Criterio de exito

1. El equipo Muga opera mas del 80% de proyectos desde el flujo interno.
2. El cliente aprueba entregables desde el area sin depender de canales paralelos.
3. No hay confusion comercial entre `muga.dev` (servicio) y el portal (post-venta operativa).
