import Link from 'next/link'
import { notFound } from 'next/navigation'
import { DeliverablesList } from '@/components/portal/deliverables-list'
import { ProjectComments } from '@/components/portal/project-comments'
import { ProjectFiles } from '@/components/portal/project-files'
import { ProjectPipeline } from '@/components/portal/project-pipeline'
import { ProjectTimeline } from '@/components/portal/project-timeline'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getAdminProjectIdFromRouteParam } from '@/lib/admin-project-route'
import { getAdminProjectDetail } from '@/lib/portal-data'

interface AdminProjectPageProps {
  params: Promise<{ projectRef: string }>
  searchParams: Promise<{ updated?: string; commented?: string; fileAdded?: string; demo?: string; error?: string }>
}

export default async function AdminProjectPage({ params, searchParams }: AdminProjectPageProps) {
  const { projectRef } = await params
  const projectId = getAdminProjectIdFromRouteParam(projectRef)
  const query = await searchParams

  if (!projectId) {
    notFound()
  }

  const detail = await getAdminProjectDetail(projectId)

  if (!detail) {
    notFound()
  }

  const { project, client, stages, deliverables, activity, comments, files } = detail
  const hasStatusAlert = Boolean(query.updated || query.commented || query.fileAdded || query.error)

  return (
    <section className="space-y-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/proyectos" className="muga-shell-link">
            Volver a proyectos
          </Link>
          <p className="muga-badge muga-badge--sm mt-3">Proyecto</p>
          <h2 className="section-title mt-2 text-balance">{project.name}</h2>
          <p className="text-sm text-[var(--color-graylight)]">{project.description}</p>
          <p className="mt-2 text-sm text-[var(--color-graylight)]">Cliente: {client?.company ?? 'Sin cliente'}</p>
        </div>
        <div className="muga-shell-section px-3 py-2 text-xs text-[var(--color-graylight)]">Control interno</div>
      </div>

      <div className="muga-shell-divider" aria-hidden="true" />

      <div>
        <ProjectPipeline stages={stages} activeStage={project.stage} />
      </div>

      {hasStatusAlert ? (
        <div className="space-y-4">
          {query.updated ? (
            <Alert variant="success">
              <AlertTitle>Entregable actualizado</AlertTitle>
              <AlertDescription>Estado actualizado correctamente.</AlertDescription>
            </Alert>
          ) : null}

          {query.commented ? (
            <Alert variant="success">
              <AlertTitle>Comentario publicado</AlertTitle>
              <AlertDescription>Comentario registrado correctamente.</AlertDescription>
            </Alert>
          ) : null}

          {query.fileAdded ? (
            <Alert variant="success">
              <AlertTitle>Archivo registrado</AlertTitle>
              <AlertDescription>Archivo registrado correctamente.</AlertDescription>
            </Alert>
          ) : null}

          {query.error ? (
            <Alert variant="destructive">
              <AlertTitle>Error al actualizar</AlertTitle>
              <AlertDescription>No se pudo completar la accion. Codigo: {query.error}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      ) : null}

      <div className="muga-shell-divider" aria-hidden="true" />

      <div className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
        <div className="space-y-6">
          <DeliverablesList deliverables={deliverables} projectId={project.id} enableActions />
          <ProjectComments projectId={project.id} comments={comments} deliverables={deliverables} />
          <ProjectFiles projectId={project.id} files={files} />
        </div>
        <ProjectTimeline activity={activity} comments={comments} />
      </div>
    </section>
  )
}
