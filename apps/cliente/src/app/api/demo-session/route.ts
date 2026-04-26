import { NextResponse } from 'next/server'
import { isInternalDemoEnabled } from '@/lib/internal-access'

export async function POST() {
  if (!isInternalDemoEnabled()) {
    return NextResponse.json(
      { error: 'Demo access is not enabled' },
      { status: 403 }
    )
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set('internal_demo_auth', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })

  response.cookies.set('internal_demo_auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}