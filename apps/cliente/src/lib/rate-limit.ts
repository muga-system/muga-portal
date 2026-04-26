const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_ATTEMPTS = 5

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number
  limit: number
}

export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    })
    return {
      success: true,
      remaining: RATE_LIMIT_MAX_ATTEMPTS - 1,
      resetIn: RATE_LIMIT_WINDOW_MS,
      limit: RATE_LIMIT_MAX_ATTEMPTS,
    }
  }

  if (record.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return {
      success: false,
      remaining: 0,
      resetIn: record.resetTime - now,
      limit: RATE_LIMIT_MAX_ATTEMPTS,
    }
  }

  record.count += 1
  return {
    success: true,
    remaining: RATE_LIMIT_MAX_ATTEMPTS - record.count,
    resetIn: record.resetTime - now,
    limit: RATE_LIMIT_MAX_ATTEMPTS,
  }
}

export function getRateLimitKey(ip: string, endpoint: string): string {
  return `${ip}:${endpoint}`
}

export function withRateLimit(
  handler: (request: Request) => Promise<Response>,
  endpoint: string
) {
  return async function (request: Request): Promise<Response> {
    const ip = getClientIp(request)
    const key = getRateLimitKey(ip, endpoint)
    const result = checkRateLimit(key)

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Too many requests',
          message: `Rate limit exceeded. Try again in ${Math.ceil(result.resetIn / 1000)} seconds.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
            'Retry-After': String(Math.ceil(result.resetIn / 1000)),
          },
        }
      )
    }

    const response = await handler(request)

    response.headers.set('X-RateLimit-Limit', String(result.limit))
    response.headers.set('X-RateLimit-Remaining', String(result.remaining))
    response.headers.set('X-RateLimit-Reset', String(Math.ceil(result.resetIn / 1000)))

    return response
  }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60 * 60 * 1000)