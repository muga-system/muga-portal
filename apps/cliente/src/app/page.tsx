import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { resolveAccessContext } from '@/lib/access-resolver'
import { getDemoSessionCookieName, hasDemoInternalSession } from '@/lib/internal-access'

export default async function HomePage() {
  const cookieStore = await cookies()
  if (hasDemoInternalSession(cookieStore.get(getDemoSessionCookieName())?.value)) {
    redirect('/admin/leads')
  }

  const access = await resolveAccessContext()

  if (access.role === 'internal_admin') {
    redirect('/admin/leads')
  }

  if (access.role === 'client_accepted') {
    redirect('/portal')
  }

  redirect('/acceso')
}
