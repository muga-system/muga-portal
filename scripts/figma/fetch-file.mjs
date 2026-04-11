import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { missingConfigKeys, resolveFigmaConfig } from "./config.mjs"

export async function pullFileMetadata({ apiBase, token, fileKey, outputDir, writeRaw = false }) {
  const requestUrl = `${apiBase}/files/${fileKey}`

  const response = await fetch(requestUrl, {
    headers: {
      "X-Figma-Token": token,
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Figma API error (${response.status}): ${body}`)
  }

  const payload = await response.json()

  const pages = (payload.document?.children ?? []).map((page) => ({
    id: page.id,
    name: page.name,
    childCount: page.children?.length ?? 0,
  }))

  const componentEntries = Object.entries(payload.components ?? {})
  const componentSetEntries = Object.entries(payload.componentSets ?? {})
  const styleEntries = Object.entries(payload.styles ?? {})

  const summary = {
    pulledAt: new Date().toISOString(),
    fileKey,
    name: payload.name,
    version: payload.version,
    lastModified: payload.lastModified,
    pages,
    counts: {
      pages: pages.length,
      components: componentEntries.length,
      componentSets: componentSetEntries.length,
      styles: styleEntries.length,
    },
    components: componentEntries.map(([key, component]) => ({
      key,
      name: component.name,
      nodeId: component.node_id,
      componentSetId: component.componentSetId,
    })),
    componentSets: componentSetEntries.map(([key, set]) => ({
      key,
      name: set.name,
      nodeId: set.node_id,
    })),
    styles: styleEntries.map(([key, style]) => ({
      key,
      name: style.name,
      styleType: style.style_type,
      nodeId: style.node_id,
    })),
  }

  await mkdir(outputDir, { recursive: true })
  await writeFile(join(outputDir, "file-summary.json"), `${JSON.stringify(summary, null, 2)}\n`)

  if (writeRaw) {
    await writeFile(join(outputDir, "file-raw.json"), `${JSON.stringify(payload, null, 2)}\n`)
  }

  console.log(`Saved Figma file summary to ${join(outputDir, "file-summary.json")}`)
  if (writeRaw) {
    console.log(`Saved raw file payload to ${join(outputDir, "file-raw.json")}`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { apiBase, token, fileKey, outputDir } = resolveFigmaConfig()
  const writeRaw = process.argv.includes("--raw")

  const missing = missingConfigKeys({ token, fileKey })
  if (missing.length) {
    console.error(`Missing ${missing.join(" and ")}. Set it in environment or design/figma/.env.local`)
    process.exit(1)
  }

  try {
    await pullFileMetadata({ apiBase, token, fileKey, outputDir, writeRaw })
  } catch (error) {
    console.error(String(error.message || error))
    process.exit(1)
  }
}
