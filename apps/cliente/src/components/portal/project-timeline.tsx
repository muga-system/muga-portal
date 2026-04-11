import type { PortalActivity, PortalComment } from '@/types/portal'

interface ProjectTimelineProps {
  activity: PortalActivity[]
  comments?: PortalComment[]
}

type TimelineItem = {
  id: string
  title: string
  description: string
  createdAt: string
}

export function ProjectTimeline({ activity, comments = [] }: ProjectTimelineProps) {
  const timelineItems: TimelineItem[] = [
    ...activity
      .filter((item) => item.eventType !== 'comment')
      .map((item) => ({
        id: `activity-${item.id}`,
        title: item.title,
        description: item.description,
        createdAt: item.createdAt,
      })),
    ...comments.map((comment) => ({
      id: `comment-${comment.id}`,
      title: `Comentario (${comment.author})`,
      description: comment.message,
      createdAt: comment.createdAt,
    })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return (
    <section className="space-y-4">
      <header className="space-y-1 px-4 sm:px-5 md:px-6">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-graylight)]">
          Actividad reciente
        </h3>
        <p className="text-sm leading-relaxed text-white/82 md:text-[0.95rem]">
          Ultimos movimientos del proyecto, ordenados del mas nuevo al mas antiguo.
        </p>
      </header>

      <div className="border-y border-white/10">
        {timelineItems.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground sm:px-5 md:px-6">Sin actividad todavia.</p>
        ) : (
          <ol>
            {timelineItems.map((event) => (
              <li key={event.id} className="border-b border-white/10 px-4 py-3 last:border-b-0 sm:px-5 md:px-6">
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
