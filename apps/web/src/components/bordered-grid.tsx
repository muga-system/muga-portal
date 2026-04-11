import type { ReactNode } from "react"

interface BorderedGridProps {
  gridClassName: string
  frameClassName?: string
  children: ReactNode
}

export function BorderedGrid({ gridClassName, frameClassName = "", children }: BorderedGridProps) {
  const frameClasses = `border-y border-white/10 ${frameClassName}`.trim()

  return (
    <div className={frameClasses}>
      <div className={gridClassName}>{children}</div>
    </div>
  )
}
