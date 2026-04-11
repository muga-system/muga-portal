import { existsSync, readFileSync } from "node:fs"

export function resolveFigmaConfig() {
  const apiBase = process.env.FIGMA_API_BASE ?? "https://api.figma.com/v1"
  const envFile = loadEnvFile(process.env.FIGMA_ENV_FILE ?? "design/figma/.env.local")
  const token = process.env.FIGMA_TOKEN ?? envFile.FIGMA_TOKEN
  const fileKey = normalizeFileKey(process.env.FIGMA_FILE_KEY ?? envFile.FIGMA_FILE_KEY)
  const outputDir = process.env.FIGMA_OUTPUT_DIR ?? "design/figma/snapshots"

  return { apiBase, token, fileKey, outputDir }
}

export function missingConfigKeys({ token, fileKey }) {
  return [!token ? "FIGMA_TOKEN" : null, !fileKey ? "FIGMA_FILE_KEY" : null].filter(Boolean)
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return {}

  const raw = readFileSync(filePath, "utf8")
  const entries = {}

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const separator = trimmed.indexOf("=")
    if (separator === -1) continue

    const key = trimmed.slice(0, separator).trim()
    const value = trimmed.slice(separator + 1).trim().replace(/^"|"$/g, "")
    if (key) entries[key] = value
  }

  return entries
}

function normalizeFileKey(value) {
  if (!value) return ""
  const trimmed = value.trim()
  if (!trimmed) return ""

  const fromUrl = trimmed.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/)
  if (fromUrl?.[1]) return fromUrl[1]

  return trimmed
}
