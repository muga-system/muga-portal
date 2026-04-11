function isEnabled(value: string | undefined) {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on'
}

export function isAnalyticsIngestEnabled() {
  return isEnabled(process.env.FEATURE_ANALYTICS_INGEST)
}

export function isAnalyticsClientEnabled() {
  return isEnabled(process.env.NEXT_PUBLIC_FEATURE_ANALYTICS_CLIENT)
}
