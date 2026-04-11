const UUID_LIKE_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function normalizeSlug(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s-]+/g, '-')
}

export function getAdminProjectIdFromRouteParam(projectRef: string) {
  const raw = projectRef.trim()
  if (!raw) return null

  if (UUID_LIKE_PATTERN.test(raw)) {
    return raw
  }

  const separatorIndex = raw.lastIndexOf('--')
  if (separatorIndex < 0) {
    return null
  }

  const candidate = raw.slice(separatorIndex + 2)
  if (!UUID_LIKE_PATTERN.test(candidate)) {
    return null
  }

  return candidate
}

export function getAdminProjectDetailHref(projectId: string, projectName?: string) {
  const normalizedName = normalizeSlug(projectName || '')
  const safeName = normalizedName || 'proyecto'
  return `/admin/proyectos/${safeName}--${projectId}`
}
