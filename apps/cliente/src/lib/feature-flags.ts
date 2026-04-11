function isEnabled(value: string | undefined) {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on'
}

export function isAdminAnalyticsEnabled() {
  return isEnabled(process.env.FEATURE_ADMIN_ANALYTICS)
}
