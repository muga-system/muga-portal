# Figma Sync Artifacts

Este directorio guarda artefactos de sincronizacion con Figma.

- `snapshots/`: metadata descargada del archivo Figma (file summary + variables).
- `assets/`: exports binarios (svg/png/jpg/pdf).
- `assets-manifest.example.json`: ejemplo para definir nodos exportables.
- `assets-manifest.json`: manifest operativo de Wave 1 (completar Node IDs `TBD_*`).

## Uso rapido

```bash
cp design/figma/.env.example design/figma/.env.local
# editar design/figma/.env.local con tu token

pnpm figma:pull
pnpm figma:export:assets --manifest=design/figma/assets-manifest.json --format=svg --out=design/figma/assets
```

`pnpm figma:pull` siempre descarga metadata del archivo.
Si el token no tiene scope `file_variables:read`, las variables se omiten con warning y el pipeline continua.

Diagnostico rapido de conexion/scopes:

```bash
pnpm figma:doctor
```

## Qué funciona con este repo

- `pnpm figma:doctor`: comprueba que el token y el archivo estén accesibles.
- `pnpm figma:pull:file`: descarga metadata del archivo Figma (páginas, componentes, estilos).
- `pnpm figma:pull:variables`: solo funciona si el token tiene `file_variables:read` y la cuenta dispone de Enterprise.
- `pnpm figma:pull`: combina ambos, pero las variables se omiten con warning si no están disponibles.
- `pnpm figma:export:assets`: exporta los assets definidos en `design/figma/assets-manifest.json`.

## Plan y scopes recomendados

Este repo puede sacarle provecho inmediato a Figma sin depender de variables Enterprise. Con el plan actual, priorizá:

- `file_content:read`
- `file_metadata:read`
- `file_versions:read`
- `library_assets:read`
- `library_content:read`
- `file_dev_resources:read` (opcional)

Si la cuenta sube a Enterprise, agrega también:

- `file_variables:read`

### Cómo usarlo

1. Copia `design/figma/.env.example` a `design/figma/.env.local`.
2. Completa `FIGMA_TOKEN` y `FIGMA_FILE_KEY`.
3. Ejecuta `pnpm figma:doctor`.
4. Ejecuta `pnpm figma:pull`.
5. Ejecuta `pnpm figma:export:assets --manifest=design/figma/assets-manifest.json --format=svg --out=design/figma/assets`.

## Qué queda documentado aquí

- metadata del archivo
- componentes y estilos publicados
- assets exportables
- workflow de sync Figma -> repo

## IDs de nodos

El export soporta automaticamente estos formatos para cada asset:

- `12:345`
- `12-345` (se normaliza solo)
- URL completa de Figma con `node-id=`

Tambien acepta `id`, `nodeId`, `node_id` o `url` en cada objeto del manifest.
