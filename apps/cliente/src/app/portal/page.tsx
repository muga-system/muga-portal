import { PortalDashboardServer } from '@/components/portal/portal-dashboard-server'

interface PortalPageProps {
  searchParams: Promise<{ commented?: string; fileAdded?: string; error?: string }>
}

export default async function PortalPage({ searchParams }: PortalPageProps) {
  return <PortalDashboardServer initialSection="summary" searchParams={searchParams} />
}
