import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInternalEmail } from '@/lib/internal-access'

const PROTECTED_ADMIN_ROUTES = ['/admin']
const PROTECTED_PORTAL_ROUTES = ['/portal']
const PUBLIC_ROUTES = ['/acceso', '/login', '/register', '/ingreso-admin', '/logout', '/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  const isProtectedAdmin = PROTECTED_ADMIN_ROUTES.some((route) => pathname.startsWith(route))
  const isProtectedPortal = PROTECTED_PORTAL_ROUTES.some((route) => pathname.startsWith(route))
  const isApiRoute = pathname.startsWith('/api')

  if (!isProtectedAdmin && !isProtectedPortal && !isApiRoute) {
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

  if (isProtectedPortal) {
    if (!user) {
      const loginUrl = new URL('/acceso', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const clientId = await getClientIdByUserId(supabase, user.id)
    
    if (!clientId) {
      return NextResponse.redirect(new URL('/acceso', request.url))
    }

    const { data: client } = await supabase
      .from('clients')
      .select('portal_status')
      .eq('id', clientId)
      .maybeSingle()

    if (!client || client.portal_status !== 'accepted') {
      return NextResponse.redirect(new URL('/acceso', request.url))
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

async function getClientIdByUserId(supabase: ReturnType<typeof createServerClient>, userId: string) {
  const { data } = await supabase
    .from('clients')
    .select('id')
    .eq('auth_user_id', userId)
    .maybeSingle()

  if (data?.id) {
    return data.id
  }

  const { data: userData } = await supabase.auth.getUser()
  const email = userData.user?.email?.toLowerCase()
  
  if (!email) return null

  const { data: byEmail } = await supabase
    .from('clients')
    .select('id')
    .ilike('email', email)
    .maybeSingle()

  return byEmail?.id || null
}

function isDemoEnabled() {
  const env = process.env.ENABLE_INTERNAL_DEMO_LOGIN || process.env.NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN || ''
  return env.toLowerCase() === '1' || env.toLowerCase() === 'true'
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/portal/:path*',
    '/api/:path*',
  ],
}