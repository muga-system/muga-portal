import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { inspectClientPortalInvite, consumeClientPortalInvite } from '@/lib/client-invite'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { getHomePathByRole } from '@/lib/access-resolver'
import Link from 'next/link'

interface InviteAccessPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ inv?: string; error?: string }>
}

export default async function InviteAccessPage({ params, searchParams }: InviteAccessPageProps) {
  const { slug } = await params
  const { inv: token, error: queryError } = await searchParams
  const cookieStore = await cookies()

  if (queryError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h1 className="mb-4 text-xl font-semibold text-white">Error de invitación</h1>
            <p className="text-sm text-white/70">
              {queryError === 'expired' && 'Esta invitación ha expirado. Contacta al equipo de MUGA.'}
              {queryError === 'used' && 'Esta invitación ya fue utilizada. Solicita una nueva.'}
              {queryError === 'invalid' && 'La invitación no es válida.'}
              {!['expired', 'used', 'invalid'].includes(queryError || '') && 'Ocurrió un error procesando la invitación.'}
            </p>
            <Link href="/acceso" className="mt-4 inline-block text-sm text-primary hover:underline">
              Volver al login
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h1 className="mb-4 text-xl font-semibold text-white">Enlace inválido</h1>
            <p className="text-sm text-white/70">
              Este enlace de invitación no es válido. Por favor solicitá uno nuevo o contacta al equipo de MUGA.
            </p>
            <Link href="/acceso" className="mt-4 inline-block text-sm text-primary hover:underline">
              Volver al login
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const inspection = await inspectClientPortalInvite({ slug, token })

  if (inspection.status !== 'ok') {
    const errorMap: Record<string, string> = {
      invalid: 'invalid',
      expired: 'expired',
      used: 'used',
    }
    redirect(`/acceso/${slug}?error=${errorMap[inspection.status] || 'invalid'}`)
  }

  const consumeResult = await consumeClientPortalInvite({ slug, token })

  if (consumeResult.status !== 'ok') {
    redirect(`/acceso/${slug}?error=invalid`)
  }

  const supabase = await createSupabaseServerClient({ writeCookies: true })

  if (inspection.email) {
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: inspection.email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${process.env.CLIENT_PORTAL_BASE_URL || 'http://localhost:3001'}/portal`,
      },
    })

    if (!signInError) {
      redirect(`/auth/callback?next=/portal&invite=accepted`)
    }
  }

  const homePath = getHomePathByRole('client_accepted')
  redirect(`${homePath}?invite=accepted`)
}