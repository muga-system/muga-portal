import { NextResponse } from 'next/server'
import { getDemoSessionCookieName } from '@/lib/internal-access'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient({ writeCookies: true })
  await supabase.auth.signOut()

  const response = NextResponse.redirect(new URL('/acceso', request.url))

  response.cookies.set(getDemoSessionCookieName(), '', {
    path: '/',
    maxAge: 0,
    httpOnly: false,
    sameSite: 'lax',
  })

  return response
}
