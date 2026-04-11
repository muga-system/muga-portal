# MUGA Figma Bootstrap Playbook (Web Only, Wave 1)

Objetivo: crear la primera version del archivo Figma para `apps/web` desde el estado actual del repo y dejar un ciclo estable de iteracion diseno -> codigo.

Scope Wave 1:

- In: `home`, `contacto`, `modelo`, `legal-template`.
- Out: `nosotros`, `admin`, `apps/cliente`.

## 1) Preparacion

- Crear 1 archivo maestro en Figma (ejemplo: `MUGA Web - Master`).
- Crear 3 paginas fijas en este orden:
  - `00 Foundations`
  - `01 Components`
  - `02 Screens`
- Definir dueno funcional:
  - Figma = fuente visual
  - React/Next = fuente funcional

## 2) Contrato de nombres

Usar nombres predecibles para que el sync sea automatizable.

- Variables:
  - `color/bg/default`
  - `color/text/default`
  - `color/brand/accent`
  - `space/4`, `space/8`, `space/12`, etc.
- Componentes:
  - `Button/Primary`
  - `Button/Secondary`
  - `Input/Text`
  - `Card/Base`
- Variantes:
  - `Size=sm|md|lg`
  - `State=default|hover|focus|disabled`

## 3) Base visual inicial

- Construir foundations primero:
  - color
  - tipografia
  - spacing
  - radius (recto)
  - sombras
- Construir primitives en `01 Components`:
  - Button, Input, Textarea, Select
  - Card, Table, Badge, Alert
- Construir pantallas clave en `02 Screens`:
  - home (`apps/web/src/app/page.tsx`)
  - contacto (`apps/web/src/app/contacto/page.tsx`)
  - modelo (`apps/web/src/app/modelo/page.tsx`)
  - legal template (`apps/web/src/components/legal-page.tsx`)

## 4) Pull tecnico desde este repo

Configurar variables locales en terminal:

```bash
cp design/figma/.env.example design/figma/.env.local
# editar design/figma/.env.local con token y file key
```

Traer metadata del archivo y variables:

```bash
pnpm figma:pull
```

Nota: `pnpm figma:pull:variables` requiere el scope `file_variables:read`, que solo está disponible en cuentas Enterprise. Si no tenés Enterprise, el proceso sigue funcionando con metadata y exportaciones.

Archivos generados:

- `design/figma/snapshots/file-summary.json`
- `design/figma/snapshots/variables-local.json`

## 5) Assets exportables

Crear `design/figma/assets-manifest.json` usando el ejemplo de este repo.

Exportar assets:

```bash
pnpm figma:export:assets --manifest=design/figma/assets-manifest.json --format=svg --out=design/figma/assets
```

## 6) Proceso de iteracion (tu flujo)

1. Vos editas en Figma (componentes, variantes, pantallas).
2. Yo ejecuto `pnpm figma:pull` y reviso diffs de snapshots.
3. Aplico cambios al codigo en `packages/ui` y `apps/web`.
4. Exporto assets nuevos/modificados.
5. Corremos QA visual en pantallas objetivo.

## 7) Regla de calidad

- Nunca generar React directo desde Figma para todo el sitio.
- Siempre mapear cambios visuales al sistema existente.
- Si falta una variante, se agrega al sistema (`@muga/ui`) y no como override local.

## 8) Entregables de Wave 1

- `docs/figma-component-mapping-web.md` completo (tabla Figma <-> React).
- `design/figma/snapshots/file-summary.json` actualizado.
- `design/figma/snapshots/variables-local.json` actualizado.
- `design/figma/assets-manifest.json` con assets usados por `apps/web`.
- QA visual cerrado para `home`, `contacto`, `modelo`, `legal-template`.
