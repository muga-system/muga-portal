'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { CalendarClock, CircleAlert, CircleCheck, MessageSquareText, Upload, Workflow } from 'lucide-react'
import { DeliverablesList } from '@/components/portal/deliverables-list'
import { PortalOnboardingModal } from '@/components/portal/portal-onboarding-modal'
import { ProjectComments } from '@/components/portal/project-comments'
import { ProjectFiles } from '@/components/portal/project-files'
import { ProjectPipeline } from '@/components/portal/project-pipeline'
import { ProjectTimeline } from '@/components/portal/project-timeline'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import type { InternalProjectDetail } from '@/lib/portal-data'
import { PROJECT_STAGE_LABELS } from '@/lib/portal-constants'
import { capitalizeName, cn } from '@/lib/utils'
import type { PortalClient } from '@/types/portal'

type PortalSection = 'summary' | 'pipeline' | 'deliverables' | 'comments' | 'files' | 'activity'

interface PortalDashboardClientProps {
  client: PortalClient
  detail: InternalProjectDetail
  shouldAutoOpenOnboarding: boolean
  initialSection: PortalSection
  status: {
    commented?: string
    fileAdded?: string
    error?: string
  }
}

const SECTION_HREF: Record<PortalSection, string> = {
  summary: '/portal',
  pipeline: '/portal/etapas',
  deliverables: '/portal/entregables',
  comments: '/portal/comentarios',
  files: '/portal/archivos',
  activity: '/portal/actividad',
}

export function PortalDashboardClient({
  client,
  detail,
  shouldAutoOpenOnboarding,
  initialSection,
  status,
}: PortalDashboardClientProps) {
  const activeSection = initialSection
  const isEdgeToEdgeSection = activeSection !== 'summary'

  const { project, stages, deliverables, activity, comments, files } = detail
  const hasStatusAlert = Boolean(status.commented || status.fileAdded || status.error)

  const pendingDeliverables = useMemo(
    () => deliverables.filter((item) => item.status === 'cambios' || item.status === 'revision'),
    [deliverables]
  )

  const upcomingDeliverable = useMemo(
    () => [...deliverables].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0],
    [deliverables]
  )

  const recentFiles = useMemo(() => files.slice(0, 3), [files])

  return (
    <section className={cn('space-y-8 md:space-y-12', isEdgeToEdgeSection && 'space-y-0 md:space-y-0')}>
      <div className="space-y-3">
        <div className="-mx-4 flex flex-wrap items-end justify-between gap-x-3 gap-y-0 border-b border-white/10 pb-0 sm:-mx-5 md:-mx-6">
          <p className="inline-flex h-9 items-center bg-[linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-3 text-xs font-semibold text-[var(--color-graylight)]">
            Portal cliente
          </p>
          <PortalOnboardingModal shouldAutoOpen={shouldAutoOpenOnboarding} />
        </div>
        <h2 className="section-title text-2xl sm:text-[2.1rem] md:text-[2.4rem] leading-[1.08] tracking-tight">
          {capitalizeName(client.userFullName || client.name)}
        </h2>
        <p className="text-sm text-[var(--color-graylight)]">{client.company}</p>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-graylight)] md:text-base">
          Este espacio esta pensado para que puedas trabajar facil, aunque no tengas perfil tecnico.
        </p>
      </div>

      {hasStatusAlert ? (
        <div className="space-y-4">
          {status.commented ? (
            <Alert variant="success">
              <AlertTitle>Comentario enviado</AlertTitle>
              <AlertDescription>Tu feedback se registró correctamente.</AlertDescription>
            </Alert>
          ) : null}

          {status.fileAdded ? (
            <Alert variant="success">
              <AlertTitle>Archivo subido</AlertTitle>
              <AlertDescription>El archivo quedó registrado en tu proyecto.</AlertDescription>
            </Alert>
          ) : null}

          {status.error ? (
            <Alert variant="destructive">
              <AlertTitle>No se pudo completar la acción</AlertTitle>
              <AlertDescription>Código: {status.error}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      ) : null}

      {activeSection === 'summary' ? (
        <div className="space-y-6">
          <section className="space-y-4">
            <header className="space-y-1 px-4 sm:px-5 md:px-6">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-graylight)]">Como empezar</h3>
            </header>
            <div className="border-y border-white/10">
              <div className="grid border-b border-white/10 md:grid-cols-3">
                <article className="border-b border-white/10 p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                  <p className="text-base font-semibold text-white">1. Mira pendientes</p>
                  <p className="mt-1 text-sm text-muted-foreground">Entra a Entregas y revisa primero lo que dice Cambios o Revision.</p>
                </article>
                <article className="border-b border-white/10 p-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
                  <p className="text-base font-semibold text-white">2. Deja tu mensaje</p>
                  <p className="mt-1 text-sm text-muted-foreground">Si algo no esta claro, escribelo en Mensajes en palabras simples.</p>
                </article>
                <article className="p-4">
                  <p className="text-base font-semibold text-white">3. Sube material</p>
                  <p className="mt-1 text-sm text-muted-foreground">Comparte logos, textos o imagenes en Archivos para avanzar mas rapido.</p>
                </article>
              </div>
            </div>
          </section>

          <div className="grid gap-4 md:gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <section className="space-y-4">
              <header className="space-y-1 px-4 sm:px-5 md:px-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-graylight)]">Tu estado hoy</h3>
                <p className="text-sm text-white/82">Proyecto activo</p>
              </header>
              <div className="border-y border-white/10">
                <div className="grid border-b border-white/10 sm:grid-cols-3">
                  <article className="border-b border-white/10 p-4 sm:border-b-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Workflow size={14} className="text-primary" aria-hidden="true" />
                      Etapa actual
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white">{PROJECT_STAGE_LABELS[project.stage]}</p>
                  </article>

                  <article className="border-b border-white/10 p-4 sm:border-b-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {pendingDeliverables.length > 0 ? <CircleAlert size={14} className="text-primary" aria-hidden="true" /> : <CircleCheck size={14} className="text-primary" aria-hidden="true" />}
                      Pendientes
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white">{pendingDeliverables.length}</p>
                  </article>

                  <article className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarClock size={14} className="text-primary" aria-hidden="true" />
                      Proxima entrega
                    </div>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {upcomingDeliverable ? new Date(upcomingDeliverable.dueDate).toLocaleDateString('es-AR') : 'Sin fecha'}
                    </p>
                  </article>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <header className="space-y-1 px-4 sm:px-5 md:px-6">
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-graylight)]">Resumen rapido</h3>
              </header>
              <div className="border-y border-white/10 px-4 py-4 sm:px-5 sm:py-4 md:px-6">
                <p className="text-base font-semibold text-white">{project.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{project.description}</p>
                <div className="mt-4 border-t border-white/10 pt-3 text-xs text-muted-foreground">
                  {recentFiles.length === 0 ? <p>Sin archivos recientes.</p> : <p className="text-white">Ultimos archivos:</p>}
                  {recentFiles.map((file) => (
                    <p key={file.id} className="mt-1">{file.name}</p>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : null}

      {activeSection === 'pipeline' ? (
        <div className="-mx-4 sm:-mx-5 md:-mx-6">
          <ProjectPipeline stages={stages} activeStage={project.stage} deliverables={deliverables} />
        </div>
      ) : null}
      {activeSection === 'deliverables' ? (
        <div className="-mx-4 sm:-mx-5 md:-mx-6">
          <DeliverablesList deliverables={deliverables} projectId={project.id} enableActions={false} />
        </div>
      ) : null}
      {activeSection === 'comments' ? (
        <div className="-mx-4 sm:-mx-5 md:-mx-6">
          <ProjectComments projectId={project.id} comments={comments} deliverables={deliverables} />
        </div>
      ) : null}
      {activeSection === 'files' ? (
        <div className="-mx-4 sm:-mx-5 md:-mx-6">
          <ProjectFiles projectId={project.id} files={files} />
        </div>
      ) : null}
      {activeSection === 'activity' ? (
        <div className="-mx-4 sm:-mx-5 md:-mx-6">
          <ProjectTimeline activity={activity} comments={comments} />
        </div>
      ) : null}
    </section>
  )
}
