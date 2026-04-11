import { NextResponse } from 'next/server'

interface ActivateInviteRouteProps {
  params: Promise<{ slug: string }>
}

export async function POST(request: Request, { params }: ActivateInviteRouteProps) {
  await params
  return NextResponse.redirect(new URL('/acceso?error=token-disabled', request.url))
}
