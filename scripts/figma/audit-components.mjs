import { mkdir, readFile, writeFile } from "node:fs/promises"

const inputPath = process.env.FIGMA_RAW_PATH ?? "design/figma/snapshots/file-raw.json"
const outputPath = process.env.FIGMA_COMPONENTS_AUDIT_PATH ?? "design/figma/snapshots/components-audit.json"

const requiredComponents = [
  "Muga/Navigation/SiteNavigation",
  "Muga/Layout/SiteFooter",
  "Muga/Hero/PageHero",
  "Muga/Badge/Base",
  "Muga/Surface/Card",
  "Muga/Link/Secondary",
  "Muga/Form/Input",
  "Muga/Form/Select",
  "Muga/Form/Textarea",
  "Muga/Form/Submit",
  "Muga/Form/ErrorMessage",
]

const variantRequirements = {
  "Muga/Hero/PageHero": ["Variant"],
  "Muga/Badge/Base": ["Size"],
  "Muga/Surface/Card": ["State"],
  "Muga/Link/Secondary": ["State"],
  "Muga/Form/Input": ["State"],
  "Muga/Form/Select": ["State"],
  "Muga/Form/Textarea": ["State"],
  "Muga/Form/Submit": ["State"],
  "Muga/Form/ErrorMessage": ["State"],
}

const raw = await readFile(inputPath, "utf8")
const payload = JSON.parse(raw)
const page = (payload.document?.children ?? []).find((node) => node.name === "01 Components")

if (!page) {
  console.error("[figma] Missing '01 Components' page in file-raw snapshot")
  process.exit(1)
}

const allNodes = []
walk(page, allNodes)

const componentSets = allNodes.filter((node) => node.type === "COMPONENT_SET")
const components = allNodes.filter((node) => node.type === "COMPONENT")
const mugaFrames = allNodes.filter((node) => node.type === "FRAME" && typeof node.name === "string" && node.name.startsWith("Muga/"))

const foundNames = new Set([
  ...componentSets.map((node) => node.name),
  ...components.map((node) => node.name),
  ...mugaFrames.map((node) => node.name),
])

const missing = requiredComponents.filter((name) => !foundNames.has(name))
const extra = Array.from(foundNames).filter((name) => name.startsWith("Muga/") && !requiredComponents.includes(name))

const variantAudit = requiredComponents
  .filter((name) => variantRequirements[name])
  .map((name) => {
    const node = componentSets.find((item) => item.name === name)
    const keys = Object.keys(node?.componentPropertyDefinitions ?? {})
    const requiredKeys = variantRequirements[name]
    const missingKeys = requiredKeys.filter((key) => !keys.includes(key))

    return {
      component: name,
      requiredKeys,
      foundKeys: keys,
      ok: missingKeys.length === 0,
      missingKeys,
    }
  })

const report = {
  generatedAt: new Date().toISOString(),
  inputPath,
  pageId: page.id,
  counts: {
    componentSets: componentSets.length,
    components: components.length,
    mugaFrames: mugaFrames.length,
  },
  required: {
    total: requiredComponents.length,
    found: requiredComponents.length - missing.length,
    missing,
  },
  variantAudit,
  extra,
  ok: missing.length === 0 && variantAudit.every((item) => item.ok),
}

await mkdir("design/figma/snapshots", { recursive: true })
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`)

if (report.ok) {
  console.log("[figma] Components audit OK")
} else {
  console.warn("[figma] Components audit has gaps")
  if (missing.length) {
    console.warn(`[figma] Missing components: ${missing.join(", ")}`)
  }

  const badVariants = variantAudit.filter((item) => !item.ok)
  for (const item of badVariants) {
    console.warn(`[figma] Missing variants in ${item.component}: ${item.missingKeys.join(", ")}`)
  }
}

console.log(`[figma] Audit report saved to ${outputPath}`)

function walk(node, bucket) {
  bucket.push(node)
  for (const child of node.children ?? []) {
    walk(child, bucket)
  }
}
