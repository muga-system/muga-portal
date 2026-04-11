async function hasVariablesAccess({ token, fileKey }) {
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/variables/local`, {
    headers: {
      "X-Figma-Token": token,
    },
  })

  if (res.status === 200) return true
  if (res.status === 403) return false

  throw new Error(`Unexpected response: ${res.status}`)
}

module.exports = {
  hasVariablesAccess,
}
