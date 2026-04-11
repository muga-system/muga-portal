const DEFAULT_ALLOWED_EMAILS: string[] = []
const DEFAULT_ALLOWED_DOMAINS: string[] = []
const DEMO_SESSION_COOKIE = 'internal_demo_auth'

function isTruthy(value: string | undefined) {
  if (!value) return false
  const normalized = value.trim().toLowerCase()
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on'
}

function normalizeList(value: string | undefined): string[] {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

export function isInternalEmail(email: string | null | undefined) {
  if (!email) {
    return false
  }

  const normalizedEmail = email.toLowerCase()
  const envEmails = normalizeList(process.env.INTERNAL_ALLOWED_EMAILS)
  const envDomains = normalizeList(process.env.INTERNAL_ALLOWED_DOMAINS)

  const allowedEmails = envEmails.length > 0 ? envEmails : DEFAULT_ALLOWED_EMAILS
  const allowedDomains = envDomains.length > 0 ? envDomains : DEFAULT_ALLOWED_DOMAINS

  if (allowedEmails.includes(normalizedEmail)) {
    return true
  }

  const domain = normalizedEmail.split('@')[1]

  if (!domain) {
    return false
  }

  return allowedDomains.includes(domain)
}

export function getDemoSessionCookieName() {
  return DEMO_SESSION_COOKIE
}

export function hasDemoInternalSession(cookieValue: string | null | undefined) {
  if (!isInternalDemoEnabled()) {
    return false
  }

  return cookieValue === '1'
}

export function isInternalDemoEnabled() {
  return isTruthy(process.env.ENABLE_INTERNAL_DEMO_LOGIN) || isTruthy(process.env.NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN)
}
