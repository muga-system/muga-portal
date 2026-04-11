import { PortalDashboardServer } from '@/components/portal/portal-dashboard-server'

interface PortalActivityPageProps {
  searchParams: Promise<{ commented?: string; fileAdded?: string; error?: string }>
}

export default async function PortalActivityPage({ searchParams }: PortalActivityPageProps) {
  return <PortalDashboardServer initialSection="activity" searchParams={searchParams} />
}
