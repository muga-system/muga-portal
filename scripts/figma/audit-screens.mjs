import { mkdir, readFile, writeFile } from "node:fs/promises"

const inputPath = process.env.FIGMA_RAW_PATH ?? "design/figma/snapshots/file-raw.json"
const outputPath = process.env.FIGMA_SCREENS_AUDIT_PATH ?? "design/figma/snapshots/screens-audit.json"

const requiredFrames = [
  "Web/Home",
  "Web/Contacto",
  "Web/Modelo",
  "Web/Legal-Template",
]

const raw = await readFile(inputPath, "utf8")
const payload = JSON.parse(raw)
const page = (payload.document?.children ?? []).find((node) => node.name === "02 Screens")

if (!page) {
  console.error("[figma] Missing '02 Screens' page in file-raw snapshot")
  process.exit(1)
}

const allNodes = []
walk(page, allNodes)

const frames = allNodes.filter((node) => node.type === "FRAME")
const frameNames = new Set(frames.map((node) => node.name))

const missing = requiredFrames.filter((name) => !frameNames.has(name))
const extra = Array.from(frameNames).filter((name) => name.startsWith("Web/") && !requiredFrames.includes(name))

const report = {
  generatedAt: new Date().toISOString(),
  inputPath,
  pageId: page.id,
  counts: {
    frames: frames.length,
  },
  required: {
    total: requiredFrames.length,
    found: requiredFrames.length - missing.length,
    missing,
  },
  extra,
  ok: missing.length === 0,
}

await mkdir("design/figma/snapshots", { recursive: true })
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`)

if (report.ok) {
  console.log("[figma] Screens audit OK")
} else {
  console.warn("[figma] Screens audit has gaps")
  console.warn(`[figma] Missing frames: ${missing.join(", ")}`)
}

console.log(`[figma] Audit report saved to ${outputPath}`)

function walk(node, bucket) {
  bucket.push(node)
  for (const child of node.children ?? []) {
    walk(child, bucket)
  }
}
