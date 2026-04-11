import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminSidebarShell } from '@/components/admin-sidebar-shell'
import { ADMIN_NAV_ITEMS } from '@/lib/admin-nav'
import { resolveAccessContext } from '@/lib/access-resolver'
import { getDemoSessionCookieName, hasDemoInternalSession } from '@/lib/internal-access'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await resolveAccessContext()
  const cookieStore = await cookies()
  const isDemoSession = hasDemoInternalSession(cookieStore.get(getDemoSessionCookieName())?.value)

  if (access.role === 'internal_admin' || isDemoSession) {
    return (
      <AdminSidebarShell items={ADMIN_NAV_ITEMS}>
        {children}
      </AdminSidebarShell>
    )
  }

  if (access.role === 'client_accepted') {
    redirect('/portal')
  }

  redirect('/ingreso-admin')
}
