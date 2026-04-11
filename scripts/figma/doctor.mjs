import { missingConfigKeys, resolveFigmaConfig } from "./config.mjs"

const { apiBase, token, fileKey } = resolveFigmaConfig()
const missing = missingConfigKeys({ token, fileKey })

if (missing.length) {
  const result = {
    auth: "fail",
    file_access: "fail",
    assets: "fail",
    variables: "disabled",
    reason: `missing_config:${missing.join(",")}`,
  }
  console.log(JSON.stringify(result, null, 2))
  process.exit(1)
}

const authStatus = await requestStatus(`${apiBase}/me`, token)
const fileStatus = await requestStatus(`${apiBase}/files/${fileKey}`, token)
const variablesStatus = await requestStatus(`${apiBase}/files/${fileKey}/variables/local`, token)

const result = {
  auth: authStatus === 200 ? "ok" : "fail",
  file_access: fileStatus === 200 ? "ok" : "fail",
  assets: fileStatus === 200 ? "ok" : "fail",
  variables: variablesStatus === 200 ? "ok" : variablesStatus === 403 ? "disabled" : "fail",
  reason: getReason({ authStatus, fileStatus, variablesStatus }),
}

if (variablesStatus === 403) {
  console.warn("[figma] Variables API disabled (missing scope file_variables:read)")
}

console.log(JSON.stringify(result, null, 2))

const shouldFail = result.auth === "fail" || result.file_access === "fail" || result.assets === "fail"
process.exit(shouldFail ? 1 : 0)

async function requestStatus(url, tokenValue) {
  try {
    const response = await fetch(url, {
      headers: { "X-Figma-Token": tokenValue },
    })
    return response.status
  } catch {
    return 0
  }
}

function getReason({ authStatus, fileStatus, variablesStatus }) {
  if (authStatus === 401) return "invalid_token"
  if (fileStatus === 403) return "missing_access:file"
  if (variablesStatus === 403) return "missing_scope:file_variables:read"
  if (authStatus !== 200) return "auth_failed"
  if (fileStatus !== 200) return "file_access_failed"
  if (variablesStatus !== 200) return "variables_check_failed"
  return null
}
