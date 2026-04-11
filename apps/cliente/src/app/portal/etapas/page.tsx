import { PortalDashboardServer } from '@/components/portal/portal-dashboard-server'

interface PortalPipelinePageProps {
  searchParams: Promise<{ commented?: string; fileAdded?: string; error?: string }>
}

export default async function PortalPipelinePage({ searchParams }: PortalPipelinePageProps) {
  return <PortalDashboardServer initialSection="pipeline" searchParams={searchParams} />
}
