import type { ReactNode } from "react"

interface SurfaceBoxProps {
  children: ReactNode
  className?: string
}

export function SurfaceBox({ children, className }: SurfaceBoxProps) {
  const classes = className ? `muga-surface ${className}` : "muga-surface"

  return <div className={classes}>{children}</div>
}
