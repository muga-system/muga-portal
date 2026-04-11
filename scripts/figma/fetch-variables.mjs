import { mkdir, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { missingConfigKeys, resolveFigmaConfig } from "./config.mjs"

export async function pullVariables({ apiBase, token, fileKey, outputDir }) {
  const requestUrl = `${apiBase}/files/${fileKey}/variables/local`

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

  await mkdir(outputDir, { recursive: true })
  await writeFile(join(outputDir, "variables-local.json"), `${JSON.stringify(payload, null, 2)}\n`)

  console.log(`Saved local variables to ${join(outputDir, "variables-local.json")}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { apiBase, token, fileKey, outputDir } = resolveFigmaConfig()
  const missing = missingConfigKeys({ token, fileKey })
  if (missing.length) {
    console.error(`Missing ${missing.join(" and ")}. Set it in environment or design/figma/.env.local`)
    process.exit(1)
  }

  try {
    await pullVariables({ apiBase, token, fileKey, outputDir })
  } catch (error) {
    console.error(String(error.message || error))
    process.exit(1)
  }
}
