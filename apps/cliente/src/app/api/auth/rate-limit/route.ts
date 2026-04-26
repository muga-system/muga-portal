import { NextResponse } from 'next/server'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'

const RATE_LIMIT_ENDPOINT = 'auth'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown'
  
  const key = getRateLimitKey(ip, RATE_LIMIT_ENDPOINT)
  const result = checkRateLimit(key)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Has realizado demasiados intentos. Intenta de nuevo en ${Math.ceil(result.resetIn / 1000)} segundos.`,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
          'Retry-After': String(Math.ceil(result.resetIn / 1000)),
        },
      }
    )
  }

  return NextResponse.json(
    { 
      success: true, 
      remaining: result.remaining,
      resetIn: result.resetIn,
    },
    {
      headers: {
        'X-RateLimit-Limit': String(result.limit),
        'X-RateLimit-Remaining': String(result.remaining),
        'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
      },
    }
  )
}
