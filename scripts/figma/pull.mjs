import checkVariablesScope from "./checkVariablesScope.js"
import { resolveFigmaConfig, missingConfigKeys } from "./config.mjs"
import { pullFileMetadata } from "./fetch-file.mjs"
import { pullVariables } from "./fetch-variables.mjs"

const { hasVariablesAccess } = checkVariablesScope

const config = resolveFigmaConfig()
const missing = missingConfigKeys(config)

if (missing.length) {
  console.error(`Missing ${missing.join(" and ")}. Set it in environment or design/figma/.env.local`)
  process.exit(1)
}

const { apiBase, token, fileKey, outputDir } = config

let variablesEnabled = false

try {
  variablesEnabled = await hasVariablesAccess({ token, fileKey })
} catch (error) {
  const status = parseStatus(error)
  if (status === 401) {
    console.error("[figma] Unauthorized token (401)")
    process.exit(1)
  }

  if (status === 403) {
    variablesEnabled = false
  } else {
    console.warn(`[figma] Variables API check failed (${status ?? "unknown"}); continuing without variables`)
    variablesEnabled = false
  }
}

if (!variablesEnabled) {
  console.warn("[figma] Variables API disabled (missing scope file_variables:read)")
}

try {
  await pullFileMetadata({ apiBase, token, fileKey, outputDir, writeRaw: false })
} catch (error) {
  const status = parseStatus(error)
  if (status === 401) {
    console.error("[figma] Unauthorized token (401)")
  } else if (status === 403) {
    console.error("[figma] Forbidden file access (403)")
  } else {
    console.error(String(error.message || error))
  }
  process.exit(1)
}

if (variablesEnabled) {
  try {
    await pullVariables({ apiBase, token, fileKey, outputDir })
  } catch (error) {
    const status = parseStatus(error)
    if (status === 403) {
      console.warn("[figma] Variables API disabled (missing scope file_variables:read)")
    } else {
      console.warn(`[figma] Variables pull skipped (${status ?? "unknown"})`)
    }
  }
}

function parseStatus(error) {
  const message = String(error?.message ?? error ?? "")
  const match = message.match(/(\d{3})/)
  if (!match?.[1]) return null
  return Number(match[1])
}
