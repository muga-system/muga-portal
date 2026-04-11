import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { ComponentProps } from "react"

interface SecondaryArrowLinkProps extends Omit<ComponentProps<typeof Link>, "children"> {
  children: ReactNode
  className?: string
}

export function SecondaryArrowLink({ href, children, className, ...rest }: SecondaryArrowLinkProps) {
  const classes = className ? `secondary-link ${className}` : "secondary-link"

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
    </Link>
  )
}
