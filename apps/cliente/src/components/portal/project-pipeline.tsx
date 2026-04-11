import { Badge } from '@/components/ui/badge'
import { Activity, ClockAlert, CheckCircle2, Clock, Upload, MessageSquareText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROJECT_STAGE_LABELS, PROJECT_STAGE_INFO } from '@/lib/portal-constants'
import type { PortalDeliverable, PortalProjectStage, ProjectStageKey } from '@/types/portal'

interface ProjectPipelineProps {
  stages: PortalProjectStage[]
  activeStage: ProjectStageKey
  deliverables?: PortalDeliverable[]
}

export function ProjectPipeline({ stages, activeStage, deliverables = [] }: ProjectPipelineProps) {
  const activeDeliverables = deliverables.filter((d) => d.stage === activeStage && d.status !== 'aprobado')

  return (
    <section className="space-y-0">
      <header className="space-y-1 px-4 sm:px-5 md:px-6 mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-graylight)]">Etapas del proyecto</h3>
        <p className="text-sm leading-relaxed text-white/82 md:text-[0.95rem]">
          Aqui ves en que etapa estamos y que falta para terminar.
        </p>
      </header>
      <div className="grid gap-0 border-y border-white/10 sm:grid-cols-2 lg:grid-cols-5">
          {stages.map((stage) => {
            const isCompleted = Boolean(stage.completedAt)
            const isActive = stage.key === activeStage
            const isInactive = !isActive
            const stageTitleClass = cn(
              'mt-2 text-lg font-semibold leading-tight sm:text-[1.2rem]',
              isActive ? 'text-white' : isCompleted ? 'text-white/90' : 'text-white/72'
            )
            const stageDetailClass = cn(
              'mt-2 text-[11px] font-medium uppercase tracking-[0.1em]',
              isActive ? 'text-primary' : isCompleted ? 'text-emerald-300/85' : 'text-[var(--color-graylight)]'
            )

            return (
              <div
                key={stage.id}
                className={cn(
                  'border-0 border-b border-white/10 p-3 transition-all duration-200 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0',
                  isActive && 'bg-[rgba(255,83,83,0.14)]',
                  isCompleted && isInactive && 'muga-surface-subtle opacity-80 saturate-75',
                  !isCompleted && isInactive &&
                    'bg-[linear-gradient(135deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] opacity-65 saturate-50'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/52">Etapa {stage.position}</p>
                  <Badge
                    variant={isActive ? 'default' : isCompleted ? 'secondary' : 'outline'}
                    className={
                      isActive || !isCompleted
                        ? 'h-8 w-8 border-0 bg-transparent p-0 text-primary shadow-none'
                        : undefined
                    }
                  >
                    {isActive ? (
                      <span className="group relative inline-flex h-full w-full items-center justify-center">
                        <Activity className="h-full w-full text-primary" aria-label="Activa" />
                        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap border border-white/15 bg-[var(--color-obscure)] px-2 py-1 text-[11px] text-[var(--color-graylight)] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-opacity group-hover:opacity-100">
                          Activa
                        </span>
                      </span>
                    ) : isCompleted ? (
                      'Ok'
                    ) : (
                      <span className="group relative inline-flex h-full w-full items-center justify-center">
                        <ClockAlert className="h-full w-full text-primary" aria-label="Pendiente" />
                        <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap border border-white/15 bg-[var(--color-obscure)] px-2 py-1 text-[11px] text-[var(--color-graylight)] opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-opacity group-hover:opacity-100">
                          Pendiente
                        </span>
                      </span>
                    )}
                  </Badge>
                </div>
                <p className={stageTitleClass}>{PROJECT_STAGE_LABELS[stage.key]}</p>
                <p className={stageDetailClass}>
                  {isCompleted
                    ? `Completada ${new Date(stage.completedAt as string).toLocaleDateString()}`
                    : isActive
                    ? 'En progreso'
                    : 'Pendiente'}
                </p>
              </div>
            )
          })}
      </div>

      {activeStage && (
        <div className="grid border-b border-white/10 md:grid-cols-3">
          <div className="border-b border-white/10 p-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
            <div className="flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-primary" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-primary">Etapa actual</p>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-white">{PROJECT_STAGE_LABELS[activeStage]}</p>
            <p className="mt-1 text-xs text-white/72">{PROJECT_STAGE_INFO[activeStage].whatWeDo}</p>
          </div>

          <div className="flex flex-col justify-between border-b border-white/10 p-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
            <div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/52">Que recibis</p>
              </div>
              <p className="mt-1.5 text-xs text-white/82">{PROJECT_STAGE_INFO[activeStage].whatYouGet}</p>
            </div>
            <a
              href="/portal/entregables"
              className="mt-3 flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
            >
              <CheckCircle2 className="h-3 w-3" />
              Ver entregables
            </a>
          </div>

          <div className="flex flex-col justify-between p-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/52">Que necesito de vos</p>
              </div>
              <p className="mt-1.5 text-xs text-white/82">{PROJECT_STAGE_INFO[activeStage].whatINeed}</p>
            </div>
            <div className="mt-3 flex gap-2">
              <a
                href="/portal/archivos"
                className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                <Upload className="h-3 w-3" />
                Subir archivos
              </a>
              <a
                href="/portal/comentarios"
                className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                <MessageSquareText className="h-3 w-3" />
                Dejar mensaje
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
