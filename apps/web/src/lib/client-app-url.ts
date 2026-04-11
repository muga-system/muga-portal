const DEFAULT_CLIENT_APP_URL = process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://cliente.muga.dev"

export function getClientAppUrl(): string {
  const raw = process.env.NEXT_PUBLIC_CLIENT_APP_URL || DEFAULT_CLIENT_APP_URL

  try {
    const parsed = new URL(raw)
    return parsed.origin
  } catch {
    return DEFAULT_CLIENT_APP_URL
  }
}

export function getClientLoginUrl(nextPath?: string): string {
  const baseUrl = getClientAppUrl()

  if (!nextPath) {
    return `${baseUrl}/acceso`
  }

  const params = new URLSearchParams({ next: nextPath })
  return `${baseUrl}/acceso?${params.toString()}`
}
