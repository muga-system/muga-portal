import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isInternalEmail } from '@/lib/internal-access'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const resolveClientPortalStatus = async () => {
    const userEmail = (user?.email || '').trim().toLowerCase()

    try {
      const byAuthUser = await supabase
        .from('clients')
        .select('id, portal_status, auth_user_id, email')
        .eq('auth_user_id', user!.id)
        .maybeSingle()

      let client = byAuthUser.data

      if (!client && userEmail) {
        const byEmail = await supabase
          .from('clients')
          .select('id, portal_status, auth_user_id, email')
          .ilike('email', userEmail)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        client = byEmail.data

        if (client && (!client.auth_user_id || client.auth_user_id !== user!.id)) {
          await supabase
            .from('clients')
            .update({ auth_user_id: user!.id, updated_at: new Date().toISOString() })
            .eq('id', client.id)
        }
      }

      return client?.portal_status === 'accepted' ? 'accepted' : 'pending'
    } catch {
      return 'pending'
    }
  }

  const accountNotEnabledUrl = () => {
    const url = request.nextUrl.clone()
    url.pathname = '/acceso'
    url.searchParams.set('error', 'account-not-enabled')
    return url
  }

  if (user && (pathname === '/login' || pathname === '/register' || pathname === '/acceso' || pathname === '/ingreso-admin')) {
    const url = request.nextUrl.clone()

    if (isInternalEmail(user.email)) {
      url.pathname = '/admin/leads'
      return NextResponse.redirect(url)
    }

    const portalStatus = await resolveClientPortalStatus()

    if (portalStatus === 'accepted') {
      url.pathname = '/portal'
      url.search = ''
      return NextResponse.redirect(url)
    }

    if (pathname === '/ingreso-admin') {
      return NextResponse.redirect(accountNotEnabledUrl())
    }

    if (pathname === '/acceso' && !request.nextUrl.searchParams.has('error')) {
      return NextResponse.redirect(accountNotEnabledUrl())
    }

    return supabaseResponse
  }

  if (user && pathname.startsWith('/portal')) {
    if (isInternalEmail(user.email)) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/leads'
      url.search = ''
      return NextResponse.redirect(url)
    }

    const portalStatus = await resolveClientPortalStatus()
    if (portalStatus !== 'accepted') {
      return NextResponse.redirect(accountNotEnabledUrl())
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
