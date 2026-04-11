# MUGA Design Contract

Contrato visual unico para `apps/web` y `apps/cliente`.

Complemento operativo para `apps/web`:

- `docs/web-design-architecture.md`

## Principios

- Un solo sistema de tokens para color, tipografia y ritmo.
- Bordes rectos en toda la plataforma (`--radius: 0`).
- Cero hardcode visual en pantallas cuando exista token o clase semantica.
- Jerarquia clara: kicker/badge -> titulo -> lead -> accion.

## Tokens de referencia

- `--color-accent: #ff5353`
- `--color-obscure: #191717`
- `--color-mugagray: #302e2e`
- `--color-graylight: #a0a0a0`

Mapeo semantico (HSL):

- `--background`, `--foreground`
- `--card`, `--muted`, `--primary`
- `--border`, `--ring`

## Reglas de implementacion

1. Los tokens viven en un solo archivo compartido.
2. `apps/web` y `apps/cliente` importan la misma hoja base.
3. Las primitives (Button/Input/Card/Table/Alert) convergen a `@muga/ui`.
4. Si falta una variante, se agrega al sistema, no al uso puntual.

## Checklist rapido

- [ ] Sin `bg-*` o `text-*` hardcodeados para corregir paginas.
- [ ] Sin radios distintos de recto.
- [ ] Focus visible consistente.
- [ ] Hover/estado activo coherentes entre apps.
- [ ] `pnpm lint` y `pnpm build` sin errores.
