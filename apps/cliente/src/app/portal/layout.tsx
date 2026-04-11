import { redirect } from 'next/navigation'
import { AdminSidebarShell } from '@/components/admin-sidebar-shell'
import { resolveAccessContext } from '@/lib/access-resolver'
import { PORTAL_NAV_ITEMS } from '@/lib/portal-nav'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const access = await resolveAccessContext()

  if (access.role === 'client_accepted') {
    return (
      <AdminSidebarShell
        items={PORTAL_NAV_ITEMS}
        sectionLabel="Portal"
        baseSegment="portal"
        homeHref="/portal"
        sectionIcon="door-open"
        contentClassName="!pt-0 sm:!pt-0 md:!pt-0"
      >
        {children}
      </AdminSidebarShell>
    )
  }

  if (access.role === 'internal_admin') {
    redirect('/admin/leads')
  }

  if (access.role === 'client_pending') {
    redirect('/acceso')
  }

  redirect('/acceso')
}
