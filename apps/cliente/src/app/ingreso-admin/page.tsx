import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AuthForm } from '@/components/auth-form'
import { resolveAccessContext } from '@/lib/access-resolver'

export default async function AdminAccessPage() {
  const access = await resolveAccessContext()

  if (access.role === 'internal_admin') {
    redirect('/admin/leads')
  }

  if (access.role === 'client_accepted') {
    redirect('/portal')
  }

  return (
    <main className="muga-auth-plain relative h-screen overflow-hidden">
      <div className="muga-auth-trama muga-auth-trama--left hidden sm:block" aria-hidden="true" />
      <div className="muga-auth-trama muga-auth-trama--right hidden sm:block" aria-hidden="true" />

      <div className="page-container mx-auto h-full max-w-[var(--layout-frame-width)] border-x border-white/10">
        <div className="grid h-full lg:grid-cols-2">
          <section className="flex h-full items-center justify-center border-b border-white/10 px-6 py-8 lg:border-b-0 lg:border-r lg:border-r-white/10">
            <div className="w-full max-w-md space-y-5">
              <p className="muga-badge muga-badge--sm">Muga Admin</p>
              <h1 className="section-title text-balance">Ingreso interno</h1>
              <p className="section-lead text-base">
                Acceso exclusivo para administración y operación interna de MUGA.
              </p>

              <p className="muga-help-text">
                ¿Buscás acceso de cliente?{' '}
                <Link href="/acceso" className="secondary-link min-h-0 p-0 text-sm">
                  Ir a acceso cliente
                </Link>
                .
              </p>
            </div>
          </section>

          <section className="muga-auth-form-dots flex h-full items-center justify-center px-6 py-8">
            <div className="w-full max-w-md border border-white/10 bg-[var(--color-obscure)] p-6 md:p-7">
              <p className="muga-badge muga-badge--sm mb-4">Administración</p>
              <h2 className="text-2xl font-semibold tracking-tight text-white">Iniciar sesión</h2>
              <p className="mt-2 mb-6 text-sm text-[var(--color-graylight)]">
                Ingresá con tu correo interno y contraseña.
              </p>
              <AuthForm showTokenAccess={false} showGoogleAccess={false} showPasswordReset={false} redirectPath="/admin/leads" />
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
