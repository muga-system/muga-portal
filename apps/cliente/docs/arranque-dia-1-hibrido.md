# Arranque Dia 1 (Accionable)

Checklist tecnico para empezar implementacion del modelo hibrido en este repo, sin scope extra.

## Objetivo del dia

Dejar preparada la base minima para trabajar el portal interno de Muga sin romper el flujo actual.

## Tareas concretas

1. **Crear namespace de datos del portal en Supabase**
   - Crear nuevo SQL en `supabase/migrations/` con tablas:
     - `clients`
     - `projects`
     - `project_stages`
     - `deliverables`
     - `project_comments`
     - `project_files`
     - `project_activity`
   - Mantener `sites` y `leads` como legado por ahora (no borrar nada).

2. **Agregar tipos TypeScript del portal**
   - Crear `src/types/portal.ts` con interfaces y enums de estado.
   - No mezclar con `src/types/database.ts` existente hasta migracion completa.

3. **Crear cliente Supabase server/browser reutilizable**
   - Reemplazar uso directo repetido de `createServerClient` en rutas criticas por helpers:
     - `src/lib/supabase-server.ts`
     - `src/lib/supabase-browser.ts`
   - Mantener `src/lib/supabase.ts` temporal para compatibilidad.

4. **Preparar rutas internas del portal (sin exponer a clientes aun)**
   - Crear grupo de rutas:
     - `src/app/(internal)/internal/projects/page.tsx`
     - `src/app/(internal)/internal/projects/[id]/page.tsx`
   - Agregar layout basico del area interna si hace falta.

5. **Agregar datos mock controlados para UI interna**
   - Crear `src/lib/portal-mock.ts` con 2 proyectos y etapas.
   - Consumir esos mocks en las nuevas paginas internas para validar UX sin bloquearse por backend.

6. **Crear componentes base reutilizables del portal**
   - `src/components/portal/project-pipeline.tsx`
   - `src/components/portal/deliverables-list.tsx`
   - `src/components/portal/project-timeline.tsx`
   - Sin logica compleja: solo render de datos y estados visuales.

7. **Definir estados unificados del flujo**
   - Etapas: `brief`, `diseno`, `desarrollo`, `qa`, `publicado`
   - Entregables: `pendiente`, `revision`, `aprobado`, `cambios`
   - Guardar estos valores en constante compartida (`src/lib/portal-constants.ts`).

8. **Agregar documento de decisiones tecnicas iniciales**
   - Crear `docs/decisiones-tecnicas-hibrido.md` con:
     - convenciones de nombres
     - que vive en UI mock vs backend real
     - reglas para migrar de `demo-store`

## Definicion de terminado (Dia 1)

- Existe estructura de datos del portal lista para iterar.
- Existen 2 pantallas internas navegables con datos mock.
- Estados de flujo estan unificados en constantes compartidas.
- No se rompieron rutas actuales (`/`, `/dashboard`, `/dashboard/sites`).

## No hacer en Dia 1

- No abrir acceso a clientes.
- No migrar todo el dashboard existente.
- No integrar pagos ni features comerciales.
- No eliminar codigo legado aun.

## Comandos de verificacion sugeridos

```bash
pnpm lint
pnpm build
```

## Siguiente paso natural (Dia 2-3)

- Conectar `projects` y `project_stages` reales desde Supabase a las pantallas internas.
- Registrar eventos de actividad cada vez que cambia un estado de entregable.
