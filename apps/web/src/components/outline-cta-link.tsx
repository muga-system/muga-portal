import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ComponentProps } from "react"

interface OutlineCtaLinkProps extends Omit<ComponentProps<typeof Link>, "children"> {
  children: ReactNode
  className?: string
  external?: boolean
  withArrow?: boolean
}

const baseClassName =
  "inline-flex w-fit items-center gap-2 border border-primary px-4 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"

export function OutlineCtaLink({ href, children, className, external = false, withArrow = true, ...rest }: OutlineCtaLinkProps) {
  const classes = className ? `${baseClassName} ${className}` : baseClassName

  if (external) {
    return (
      <a href={String(href)} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
        {withArrow ? <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" /> : null}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      {withArrow ? <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" /> : null}
    </Link>
  )
}
