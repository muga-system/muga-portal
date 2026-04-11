import { redirect } from 'next/navigation'
import { PortalDashboardClient } from '@/components/portal/portal-dashboard-client'
import { Card, CardContent } from '@/components/ui/card'
import { resolveAccessContext } from '@/lib/access-resolver'
import { getClientPortalSnapshotByAuthUserId } from '@/lib/portal-data'

type PortalSection = 'summary' | 'pipeline' | 'deliverables' | 'comments' | 'files' | 'activity'

interface PortalDashboardServerProps {
  initialSection: PortalSection
  searchParams: Promise<{ commented?: string; fileAdded?: string; error?: string }>
}

export async function PortalDashboardServer({ initialSection, searchParams }: PortalDashboardServerProps) {
  const query = await searchParams
  const access = await resolveAccessContext()

  if (access.role !== 'client_accepted' || !access.user) {
    redirect('/acceso')
  }

  const userFullName = access.user?.user_metadata?.full_name as string | null
  const snapshot = await getClientPortalSnapshotByAuthUserId(access.user.id, userFullName)

  if (!snapshot) {
    return (
      <section className="space-y-12">
        <div className="space-y-2">
          <p className="muga-badge muga-badge--sm">Portal cliente</p>
          <h2 className="section-title">Tu espacio aún no está habilitado</h2>
          <p className="section-lead max-w-2xl text-base">
            Cuando MUGA active tu acceso como cliente, verás tu proyecto y el seguimiento completo aquí.
          </p>
        </div>

        <Card className="muga-shell-panel max-w-3xl">
          <CardContent className="space-y-2 py-5 text-sm text-[var(--color-graylight)]">
            <p className="muga-badge muga-badge--sm">Qué sigue</p>
            <p>1. El equipo valida tu alta como cliente.</p>
            <p>2. Se habilita tu proyecto con etapas y entregables.</p>
            <p>3. Recibes confirmación para operar en este portal.</p>
          </CardContent>
        </Card>
      </section>
    )
  }

  const shouldAutoOpenOnboarding =
    !snapshot.client.portalOnboardingSeenAt || snapshot.client.portalOnboardingVersion !== 'v1'

  return (
    <PortalDashboardClient
      client={snapshot.client}
      detail={snapshot.detail}
      shouldAutoOpenOnboarding={shouldAutoOpenOnboarding}
      initialSection={initialSection}
      status={{
        commented: query.commented,
        fileAdded: query.fileAdded,
        error: query.error,
      }}
    />
  )
}
