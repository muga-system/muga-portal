import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { AccountBlockActions } from '@/components/access/account-block-actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AuthForm } from '@/components/auth-form'

interface AccessPageProps {
  searchParams: Promise<{ invited?: string; error?: string }>
}

function getInviteErrorMessage(code: string | undefined) {
  if (code === 'invite-missing') {
    return 'El enlace de acceso no incluye token de invitacion.'
  }

  if (code === 'invite-invalid') {
    return 'El token de acceso no es valido.'
  }

  if (code === 'invite-expired') {
    return 'El enlace de acceso vencio. Solicita una nueva invitacion.'
  }

  if (code === 'invite-used') {
    return 'El enlace ya fue utilizado. Solicita un nuevo enlace para reingresar por invitacion.'
  }

  if (code === 'auth_error') {
    return 'No se pudo completar la autenticacion. Reintenta desde el correo de acceso.'
  }

  if (code === 'invalid-access-code') {
    return 'El acceso por código ya no está habilitado. Ingresá con email+contraseña o Google.'
  }

  if (code === 'access-link-failed') {
    return 'No se pudo completar el acceso automático. Intenta con Google o email+contraseña.'
  }

  if (code === 'account-not-enabled') {
    return 'Tu cuenta existe pero aún no está habilitada para ingresar al portal. Contacta al equipo de MUGA.'
  }

  if (code === 'token-disabled') {
    return 'El ingreso por token/código fue deshabilitado. Usa Google o contraseña.'
  }

  if (code) {
    return `Codigo: ${code}`
  }

  return null
}

export default async function AccessPage({ searchParams }: AccessPageProps) {
  const query = await searchParams
  const inviteErrorMessage = getInviteErrorMessage(query.error)
  const marketingUrl = 'https://www.muga.dev'
  const googleFlag = (process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN || '').trim().toLowerCase()
  const isGoogleEnabled = googleFlag === 'true' || googleFlag === '1' || googleFlag === 'yes'

  return (
    <main className="muga-auth-plain relative h-screen overflow-hidden">
      <div className="muga-auth-trama muga-auth-trama--left hidden sm:block" aria-hidden="true" />
      <div className="muga-auth-trama muga-auth-trama--right hidden sm:block" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20">
        <div className="page-container mx-auto max-w-[var(--layout-frame-width)] border-x border-white/10">
          <Link
            href={marketingUrl}
            className="pointer-events-auto ml-4 mt-4 inline-flex h-11 items-center gap-2 border border-primary/55 bg-primary/10 px-6 text-sm font-semibold text-primary transition-colors hover:border-primary/70 hover:bg-primary/16 hover:text-primary sm:ml-5 sm:mt-5"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Volver a inicio
          </Link>
        </div>
      </div>

      <div className="page-container mx-auto h-full max-w-[var(--layout-frame-width)] border-x border-white/10">
        <div className="grid h-full lg:grid-cols-2">
          <section className="flex h-full items-center justify-center border-b border-white/10 px-6 py-8 lg:border-b-0 lg:border-r lg:border-r-white/10">
            <div className="w-full max-w-md space-y-5">
              <p className="muga-badge muga-badge--sm">Muga Portal</p>
              <h1 className="section-title text-balance">Acceso cliente</h1>
              <p className="section-lead text-base">
                Ingresá con tu cuenta habilitada para revisar avances, entregables y comentarios de tu proyecto.
              </p>

              <p className="muga-help-text">
                Si no tenés acceso habilitado, escribinos en{' '}
                <Link href="https://muga.dev/contacto" className="secondary-link min-h-0 p-0 text-sm">
                  muga.dev/contacto
                </Link>
                .
              </p>

              {query.invited ? (
                <Alert variant="success">
                  <AlertTitle>Codigo validado</AlertTitle>
                  <AlertDescription>Tu acceso se está preparando. Continua con el enlace que recibiste por correo.</AlertDescription>
                </Alert>
              ) : null}

              {inviteErrorMessage ? (
                <Alert variant="destructive">
                  <AlertTitle>No se pudo completar el acceso</AlertTitle>
                  <AlertDescription>{inviteErrorMessage}</AlertDescription>
                </Alert>
              ) : null}

              {query.error === 'account-not-enabled' ? (
                <div className="pt-1">
                  <AccountBlockActions />
                </div>
              ) : null}
            </div>
          </section>

          <section className="muga-auth-form-dots flex h-full items-center justify-center px-6 py-8">
            <div className="w-full max-w-md border border-white/10 bg-[var(--color-obscure)] p-6 md:p-7">
              <p className="muga-badge muga-badge--sm mb-4">Ingreso</p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Iniciar sesión</h2>
              <p className="mt-2 mb-6 text-sm text-[var(--color-graylight)]">
                Usa tu cuenta cliente para entrar al portal.
                {isGoogleEnabled ? ' Recomendado: continuar con Google.' : ' En este entorno Google está deshabilitado.'}
              </p>

              {isGoogleEnabled ? (
                <div className="mb-4 inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-xs text-[var(--color-graylight)]">
                  <ShieldCheck size={14} className="text-primary" aria-hidden="true" />
                  Serás redirigido a Google para autenticarte de forma segura.
                </div>
              ) : null}

              <AuthForm showTokenAccess={false} showGoogleAccess={isGoogleEnabled} showPasswordReset redirectPath="/portal" />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
