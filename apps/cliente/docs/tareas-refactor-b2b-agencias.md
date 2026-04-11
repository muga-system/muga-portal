# Tareas de refactor (pendiente)

Leyenda de prioridad:
- `P0` = bloqueante para MVP
- `P1` = importante post-MVP inmediato
- `P2` = mejora incremental

## Fase 0 - Fundaciones

- [ ] `P0` Configurar `app.tudominio.com` en Vercel.
- [ ] `P0` Configurar wildcard `*.tudominio.com`.
- [ ] `P0` Confirmar variables de entorno de Supabase en Vercel.
- [ ] `P2` Ajustar branding base del producto para enfoque agencias.

## Fase 1 - Modelo de datos multi-tenant

- [ ] `P0` Crear tabla `agencies`.
- [ ] `P0` Crear tabla `agency_members` con roles.
- [ ] `P0` Crear tabla `clients`.
- [ ] `P0` Crear tabla `domains`.
- [ ] `P0` Crear tabla `site_published_versions`.
- [ ] `P0` Extender `sites` con `agency_id` y `client_id`.
- [ ] `P0` Implementar RLS por `agency_id`.

## Fase 2 - Unificacion de datos

- [ ] `P0` Migrar login a flujo Supabase real.
- [ ] `P0` Migrar dashboard a lectura real de Supabase.
- [ ] `P0` Migrar CRUD de sitios a Supabase.
- [ ] `P0` Migrar editor para guardar en Supabase.
- [ ] `P0` Retirar dependencia central de `demo-store`.
- [ ] `P1` Eliminar rutas/componentes duplicados no usados.

## Fase 3 - Publicacion por subdominio

- [ ] `P0` Resolver host en middleware/proxy (`app` vs wildcard).
- [ ] `P0` Mapear subdominio a registro en `domains`.
- [ ] `P0` Resolver sitio publicado activo por subdominio.
- [ ] `P0` Implementar accion de publish con snapshot.
- [ ] `P1` Implementar accion de unpublish.
- [ ] `P1` Agregar fallback para subdominio inexistente.
- [ ] `P1` Agregar fallback para subdominio sin sitio publicado.

## Fase 4 - Leads para agencias

- [ ] `P0` Crear endpoint publico de captura de leads.
- [ ] `P0` Guardar UTM/source/referrer en cada lead.
- [ ] `P1` Crear inbox de leads por agencia.
- [ ] `P1` Agregar estados de pipeline (`new`, `contacted`, `won`, `lost`).
- [ ] `P1` Agregar filtro por cliente/sitio/campana.
- [ ] `P2` Agregar export CSV.

## Fase 5 - SaaS comercial

- [ ] `P1` Definir planes para agencias (Starter/Growth/Pro).
- [ ] `P1` Aplicar limites por plan en backend.
- [ ] `P2` Implementar white-label basico por agencia.
- [ ] `P1` Implementar onboarding inicial (agencia -> cliente -> sitio -> publish).

## Orden sugerido de ejecucion

1. Completar todos los items `P0`.
2. Completar `P1` en este orden: onboarding, limites de plan, inbox de leads, hardening de publicacion.
3. Completar `P2` como mejoras de producto y operacion.
