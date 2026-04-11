import { PortalDashboardServer } from '@/components/portal/portal-dashboard-server'

interface PortalCommentsPageProps {
  searchParams: Promise<{ commented?: string; fileAdded?: string; error?: string }>
}

export default async function PortalCommentsPage({ searchParams }: PortalCommentsPageProps) {
  return <PortalDashboardServer initialSection="comments" searchParams={searchParams} />
}
