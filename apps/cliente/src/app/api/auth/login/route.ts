import { NextResponse } from 'next/server'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() 
    || request.headers.get('x-real-ip') 
    || 'unknown'
  
  const key = getRateLimitKey(ip, 'login')
  const result = checkRateLimit(key)

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        message: `Has realizado demasiados intentos de inicio de sesión. Intenta de nuevo en ${Math.ceil(result.resetIn / 1000)} segundos.`,
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

  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseBrowserClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        user: data.user,
        remaining: result.remaining,
      },
      {
        headers: {
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(Math.ceil(result.resetIn / 1000)),
        },
      }
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}