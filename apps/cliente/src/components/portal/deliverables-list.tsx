import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DELIVERABLE_STATUS_LABELS, PROJECT_STAGE_LABELS } from '@/lib/portal-constants'
import type { PortalDeliverable } from '@/types/portal'

interface DeliverablesListProps {
  deliverables: PortalDeliverable[]
  projectId?: string
  enableActions?: boolean
}

const statusVariant: Record<PortalDeliverable['status'], 'secondary' | 'outline' | 'destructive'> = {
  pendiente: 'outline',
  revision: 'secondary',
  aprobado: 'secondary',
  cambios: 'destructive',
}

export function DeliverablesList({
  deliverables,
  projectId,
  enableActions = false,
}: DeliverablesListProps) {
  return (
    <section className="space-y-4">
      <header className="space-y-1 px-4 sm:px-5 md:px-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-graylight)]">
          Entregas y pendientes
        </h3>
        <p className="text-sm leading-relaxed text-white/82 md:text-[0.95rem]">
          Revisa que esta aprobado y que necesita una respuesta de tu lado.
        </p>
      </header>

      <div className="border-y border-white/10">
        {deliverables.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground sm:px-5 md:px-6">No hay entregables cargados.</p>
        ) : (
          <div>
            <p className="border-b border-white/10 px-4 py-3 text-xs text-muted-foreground sm:px-5 md:px-6">
              Tip: responde primero los items con estado Cambios o En revision.
            </p>
            {deliverables.map((deliverable) => (
              <article
                key={deliverable.id}
                className="border-b border-white/10 px-4 py-4 last:border-b-0 sm:px-5 md:px-6"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-semibold text-white">{deliverable.title}</h4>
                  <Badge variant={statusVariant[deliverable.status]}>
                    {DELIVERABLE_STATUS_LABELS[deliverable.status]}
                  </Badge>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">{deliverable.description}</p>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Etapa: {PROJECT_STAGE_LABELS[deliverable.stage]}</span>
                  <span>Entrega: {new Date(deliverable.dueDate).toLocaleDateString()}</span>
                  <span>Actualizado: {new Date(deliverable.updatedAt).toLocaleDateString()}</span>
                </div>

                {enableActions && projectId ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(DELIVERABLE_STATUS_LABELS).map(([statusKey, label]) => {
                      const isCurrent = deliverable.status === statusKey

                      return (
                        <form
                          key={`${deliverable.id}-${statusKey}`}
                          action={`/internal/projects/${projectId}/deliverables/${deliverable.id}/status`}
                          method="post"
                        >
                          <input type="hidden" name="status" value={statusKey} />
                          <Button type="submit" variant={isCurrent ? 'secondary' : 'outline'} size="xs" disabled={isCurrent}>
                            {isCurrent ? `Actual: ${label}` : `Marcar ${label}`}
                          </Button>
                        </form>
                      )
                    })}
                  </div>
                ) : null}

              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
