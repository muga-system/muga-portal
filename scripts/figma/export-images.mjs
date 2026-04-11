import { mkdir, readFile, writeFile } from "node:fs/promises"
import { basename, join } from "node:path"
import { missingConfigKeys, resolveFigmaConfig } from "./config.mjs"

const { apiBase: API_BASE, token, fileKey } = resolveFigmaConfig()

if (!token || !fileKey) {
  const missing = missingConfigKeys({ token, fileKey })
  console.error(`Missing ${missing.join(" and ")}. Set it in environment or design/figma/.env.local`)
  process.exit(1)
}

const args = new Map()
for (const rawArg of process.argv.slice(2)) {
  if (!rawArg.startsWith("--")) continue
  const [k, v] = rawArg.slice(2).split("=")
  args.set(k, v ?? "")
}

const format = args.get("format") || "svg"
const outDir = args.get("out") || "design/figma/assets"
const scale = args.get("scale") || "1"
const idsArg = args.get("ids") || ""
const manifestPath = args.get("manifest") || ""

const supportedFormats = new Set(["png", "jpg", "svg", "pdf"])
if (!supportedFormats.has(format)) {
  console.error(`Invalid format '${format}'. Use one of: ${Array.from(supportedFormats).join(", ")}`)
  process.exit(1)
}

let assets = []

if (manifestPath) {
  const manifestRaw = await readFile(manifestPath, "utf8")
  const manifest = JSON.parse(manifestRaw)
  assets = Array.isArray(manifest.assets) ? manifest.assets : []
}

if (!manifestPath && idsArg) {
  assets = idsArg.split(",").map((id) => ({ id }))
}

if (assets.length === 0) {
  console.error("No assets provided. Use --ids or --manifest")
  process.exit(1)
}

const ids = assets
  .map((asset) => normalizeNodeId(asset.id || asset.nodeId || asset.node_id || asset.url || ""))
  .filter(Boolean)

if (ids.length === 0) {
  console.error("No valid node IDs found. You can use '12:345', '12-345' or a full Figma URL with node-id.")
  process.exit(1)
}

const idToImage = new Map()
for (const [index, asset] of assets.entries()) {
  const normalizedId = normalizeNodeId(asset.id || asset.nodeId || asset.node_id || asset.url || "")
  if (!normalizedId) continue
  idToImage.set(index, normalizedId)
}
const url = new URL(`${API_BASE}/images/${fileKey}`)
url.searchParams.set("ids", ids.join(","))
url.searchParams.set("format", format)
url.searchParams.set("scale", scale)

const response = await fetch(url, {
  headers: {
    "X-Figma-Token": token,
  },
})

if (!response.ok) {
  const body = await response.text()
  console.error(`Figma API error (${response.status}): ${body}`)
  process.exit(1)
}

const payload = await response.json()
const images = payload.images ?? {}

await mkdir(outDir, { recursive: true })

for (const [index, asset] of assets.entries()) {
  const assetId = idToImage.get(index)
  if (!assetId) {
    console.warn("Skipping asset: id is missing or invalid")
    continue
  }
  const imageUrl = images[assetId]
  if (!imageUrl) {
    console.warn(`Skipping ${assetId}: URL not available`)
    continue
  }

  const imageResponse = await fetch(imageUrl)
  if (!imageResponse.ok) {
    console.warn(`Skipping ${assetId}: download failed (${imageResponse.status})`)
    continue
  }

  const ext = format === "jpg" ? "jpg" : format
  const fileName = sanitizeName(asset.name || assetId) + `.${ext}`
  const filePath = join(outDir, fileName)
  const buffer = Buffer.from(await imageResponse.arrayBuffer())

  await writeFile(filePath, buffer)
  console.log(`Saved ${filePath}`)
}

function sanitizeName(value) {
  const normalized = basename(value)
  return normalized
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
}

function normalizeNodeId(input) {
  if (!input || typeof input !== "string") return ""

  let value = input.trim()
  if (!value) return ""

  if (value.includes("figma.com") || value.includes("node-id=")) {
    try {
      const url = new URL(value)
      value = url.searchParams.get("node-id") || value
    } catch {
      const match = value.match(/node-id=([^&]+)/)
      if (match?.[1]) value = match[1]
    }
  }

  value = decodeURIComponent(value)

  return value
    .replace(/-/g, ":")
    .replace(/\|/g, ":")
    .trim()
}
