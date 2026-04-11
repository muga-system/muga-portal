import { PortalDashboardServer } from '@/components/portal/portal-dashboard-server'

interface PortalDeliverablesPageProps {
  searchParams: Promise<{ commented?: string; fileAdded?: string; error?: string }>
}

export default async function PortalDeliverablesPage({ searchParams }: PortalDeliverablesPageProps) {
  return <PortalDashboardServer initialSection="deliverables" searchParams={searchParams} />
}
