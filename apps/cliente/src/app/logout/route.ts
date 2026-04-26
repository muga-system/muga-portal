import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient({ writeCookies: true })
  await supabase.auth.signOut()

  const response = NextResponse.redirect(new URL('/acceso', request.url))

  response.cookies.set('internal_demo_auth', '', {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return response
}