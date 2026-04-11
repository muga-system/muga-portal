import type { ReactNode } from "react"

interface SectionIntroProps {
  badge?: string
  title: ReactNode
  lead?: ReactNode
  className?: string
  titleClassName?: string
  leadClassName?: string
}

export function SectionIntro({
  badge,
  title,
  lead,
  className,
  titleClassName,
  leadClassName,
}: SectionIntroProps) {
  const wrapperClassName = className ? `mb-10 max-w-3xl lg:mb-12 ${className}` : "mb-10 max-w-3xl lg:mb-12"
  const resolvedTitleClassName = titleClassName ? `section-title ${titleClassName}` : "section-title"
  const resolvedLeadClassName = leadClassName ? `section-lead ${leadClassName}` : "section-lead"

  return (
    <div className={wrapperClassName}>
      {badge ? (
        <div className="mb-4">
          <span className="muga-badge muga-badge--sm">{badge}</span>
        </div>
      ) : null}

      <h2 className={resolvedTitleClassName}>{title}</h2>

      {lead ? <p className={resolvedLeadClassName}>{lead}</p> : null}
    </div>
  )
}
