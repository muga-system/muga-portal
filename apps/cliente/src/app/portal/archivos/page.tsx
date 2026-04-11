import { PortalDashboardServer } from '@/components/portal/portal-dashboard-server'

interface PortalFilesPageProps {
  searchParams: Promise<{ commented?: string; fileAdded?: string; error?: string }>
}

export default async function PortalFilesPage({ searchParams }: PortalFilesPageProps) {
  return <PortalDashboardServer initialSection="files" searchParams={searchParams} />
}
