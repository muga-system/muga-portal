import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInternalEmail } from '@/lib/internal-access'

const PROTECTED_ADMIN_ROUTES = ['/admin']
const PUBLIC_ROUTES = ['/acceso', '/login', '/register', '/ingreso-admin', '/logout', '/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  const isProtectedAdmin = PROTECTED_ADMIN_ROUTES.some((route) => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api')

  if (!isProtectedAdmin && !isApiRoute) {
    return NextResponse.next()
  }

  if (isPublicRoute) {
    return NextResponse.next()
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const demoCookie = request.cookies.get('internal_demo_auth')?.value
  const isDemoSession = demoCookie === '1' && isDemoEnabled()

  if (isProtectedAdmin) {
    if (!user && !isDemoSession) {
      const loginUrl = new URL('/ingreso-admin', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (user && !isDemoSession) {
      const isInternal = user.email ? isInternalEmail(user.email) : false
      if (!isInternal) {
        return NextResponse.redirect(new URL('/portal', request.url))
      }
    }

    return response
  }

  if (isApiRoute) {
    if (!user && !isDemoSession) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (isProtectedAdmin && user) {
      const isInternal = user.email ? isInternalEmail(user.email) : false
      if (!isInternal && !isDemoSession) {
        return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }
  }

  return response
}

function isDemoEnabled() {
  const env = process.env.ENABLE_INTERNAL_DEMO_LOGIN || process.env.NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN || ''
  return env.toLowerCase() === '1' || env.toLowerCase() === 'true'
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api',
    '/api/:path*',
  ],
}
