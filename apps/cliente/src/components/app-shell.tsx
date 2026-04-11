import Link from 'next/link'

interface AppShellProps {
  badge: string
  title: string
  primaryHref: string
  primaryLabel: string
  secondaryLinks?: Array<{ href: string; label: string }>
  children: React.ReactNode
}

export function AppShell({ badge, title, primaryHref, primaryLabel, secondaryLinks = [], children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="muga-auth-trama muga-auth-trama--left hidden sm:block" aria-hidden="true" />
      <div className="muga-auth-trama muga-auth-trama--right hidden sm:block" aria-hidden="true" />

      <header className="muga-shell-header sticky top-0 z-20">
        <div className="muga-shell-header-frame page-container flex h-[var(--layout-nav-height)] items-center justify-between gap-4">
          <div>
            <p className="muga-badge muga-badge--sm">{badge}</p>
            <h1 className="mt-2 text-sm font-semibold tracking-tight text-white">{title}</h1>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link href={primaryHref} className="muga-nav-link" data-active="true">
              {primaryLabel}
            </Link>
            {secondaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="muga-nav-link">
                {link.label}
              </Link>
            ))}
            <Link href="/logout" className="muga-nav-link">
              Cerrar sesión
            </Link>
          </nav>
        </div>
      </header>

      <main className="muga-shell-main">
        <div className="page-container mx-auto w-full max-w-[var(--layout-frame-width)] border-x border-white/10">
          {children}
        </div>
      </main>
    </div>
  )
}
