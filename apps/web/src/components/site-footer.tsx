import Link from "next/link"
import { Fragment } from "react"
import { getClientLoginUrl } from "@/lib/client-app-url"
import { LayoutFrameDecor } from "@/components/layout-frame-decor"
import { LayoutWideDivider } from "@/components/layout-wide-divider"
import { OutlineCtaLink } from "@/components/outline-cta-link"

export function SiteFooter() {
  const year = new Date().getFullYear()
  const clientLoginUrl = getClientLoginUrl()

  const primaryLinks = [
    { href: "/formatos", label: "Formatos" },
    { href: "/criterios", label: "Criterios" },
    { href: "/casos", label: "Referencias" },
    { href: "/modelo", label: "Modelo" },
    { href: "https://muga-blog.vercel.app/", label: "Blog", external: true },
    { href: "/contacto", label: "Contacto" },
  ]

  const legalLinks = [
    { href: "/privacidad", label: "Privacidad" },
    { href: "/cookies", label: "Cookies" },
    { href: "/terminos", label: "Términos" },
  ]

  return (
    <footer className="relative bg-background">
      <LayoutFrameDecor />

      <div className="relative page-container py-12">
        <div className="flex flex-col gap-5 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
          <p className="muga-badge muga-badge--sm">MUGA DEV</p>
          <h2 className="mt-3 max-w-xl text-xl font-semibold leading-tight text-white sm:text-2xl">
            Arquitectura clara desde el inicio.
          </h2>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Estructura, jerarquía y recorrido claro para sostener una acción principal.
          </p>
        </div>
        <OutlineCtaLink href="/contacto" data-track-zone="footer-contact" className="font-semibold">
          Contanos tu caso
        </OutlineCtaLink>
      </div>

      <LayoutWideDivider />

      <nav aria-label="Enlaces del sitio" className="py-8">
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {primaryLinks.map((link) => (
            <Fragment key={link.href}>
              <li>
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="inline-flex min-h-10 items-center py-1 text-sm text-muted-foreground transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
              {link.label === "Contacto" ? (
                <li>
                  <Link
                    href={clientLoginUrl}
                    data-track-zone="footer-area-cliente"
                    className="inline-flex min-h-10 items-center border border-primary/50 px-3 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-black"
                  >
                    Área cliente
                  </Link>
                </li>
              ) : null}
            </Fragment>
          ))}
        </ul>
      </nav>

      <LayoutWideDivider />

        <div className="flex flex-wrap items-center gap-5 pt-6 text-xs text-muted-foreground">
          <p className="break-words">
            <span className="font-mono">{year}</span>
            <span className="ml-1 font-semibold text-primary">MUGA</span> - Arquitectura web como sistema.
          </p>
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
          <Link href="https://muga.studio" className="transition-colors hover:text-white">
            MUGA Studio
          </Link>
          <Link href="/admin" className="ml-2 font-mono text-muted-foreground/50 transition-colors hover:text-primary">
            v1.0
          </Link>
        </div>
      </div>
    </footer>
  )
}
