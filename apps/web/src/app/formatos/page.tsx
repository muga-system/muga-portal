import { Target, Building2, Shield } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { BorderedGrid } from "@/components/bordered-grid"
import { LayoutWideDivider } from "@/components/layout-wide-divider"
import { OutlineCtaLink } from "@/components/outline-cta-link"
import { SecondaryArrowLink } from "@/components/secondary-arrow-link"
import { SurfaceBox } from "@/components/surface-box"

const formatDescriptions = [
  {
    icon: Target,
    title: "Landing de conversión",
    subtitle: "una oferta, una acción",
    summary: "Para campañas, servicios puntuales o una sola propuesta.",
    detail: "Ideal si querés llevar a la persona directo a la consulta con una sola acción principal.",
    href: "https://mugaland.vercel.app/",
  },
  {
    icon: Building2,
    title: "Sitio corporativo",
    subtitle: "propuesta, servicios y contacto",
    summary: "Para presentar tu propuesta, explicar servicios y ordenar secciones.",
    detail: "Ideal si necesitás más contexto que una landing, sin perder foco comercial.",
    href: "https://corporativo-astro.vercel.app/",
  },
  {
    icon: Shield,
    title: "Sitio institucional",
    subtitle: "confianza, información y presencia",
    summary: "Para ordenar información, construir confianza y sostener presencia.",
    detail: "Ideal si necesitás una web más estable que no dependa de una sola campaña.",
    href: "https://muga-institucional.vercel.app/",
  },
]

const comparisons = [
  { feature: "Páginas", landing: "1", corporativo: "3-5", institucional: "7+" },
  { feature: "Objetivo", landing: "Conversión directa", corporativo: "Captura de contacto", institucional: "Autoridad" },
  { feature: "Tiempo", landing: "5-7 días", corporativo: "10-15 días", institucional: "15-30 días" },
  { feature: "Ideal para", landing: "Campañas", corporativo: "Negocios locales", institucional: "Empresas" },
]

export default function FormatosPage() {
  return (
    <>
      <PageHero
        badge="Formatos"
        title="Formatos base según el objetivo"
        description="Acá ves la diferencia entre una landing, un sitio corporativo y un institucional."
        variant="minimal"
      />

      <section className="section-space section-space-after-hero divider-header-gap layout-divider-bottom">
        <div className="page-container">
          <LayoutWideDivider />
          <BorderedGrid gridClassName="grid grid-cols-1 lg:grid-cols-3" frameClassName="border-y-0 border-x-0">
            {formatDescriptions.map((item, index) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="flex flex-col p-6 sm:p-8 lg:p-10 border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10 last:lg:border-r-0"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-12 w-12 items-center justify-center border border-primary/50 bg-primary/8 text-primary">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                      <p className="text-xs font-mono uppercase tracking-wider text-white/50">{item.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-white/80 mb-3">{item.summary}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-6">{item.detail}</p>

                  <div className="mt-auto pt-4 border-t border-white/10">
                    <OutlineCtaLink href={item.href} external withArrow={false} className="font-medium rounded-none">
                      Ver sitio
                    </OutlineCtaLink>
                  </div>
                </article>
              )
            })}
          </BorderedGrid>
          <LayoutWideDivider />
        </div>
      </section>

      <section className="section-space bg-[rgba(24,23,23,0.3)] pt-12 pb-12">
        <div className="page-container">
          <div className="mb-8">
            <p className="muga-badge muga-badge--sm">Comparativa</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">¿Cuál es la diferencia?</h2>
            <p className="mt-3 text-muted-foreground">
              Las diferencias principales entre cada formato para que puedas elegir con más claridad.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-4 pr-4 font-mono text-[11px] uppercase tracking-wider text-white/50">Característica</th>
                  <th className="pb-4 pr-4 font-mono text-[11px] uppercase tracking-wider text-primary">Landing</th>
                  <th className="pb-4 pr-4 font-mono text-[11px] uppercase tracking-wider text-primary">Corporativo</th>
                  <th className="pb-4 font-mono text-[11px] uppercase tracking-wider text-primary">Institucional</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.feature} className="border-b border-white/5">
                    <td className="py-4 pr-4 text-white/70">{row.feature}</td>
                    <td className="py-4 pr-4 text-white">{row.landing}</td>
                    <td className="py-4 pr-4 text-white">{row.corporativo}</td>
                    <td className="py-4 text-white">{row.institucional}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-space pt-12">
        <div className="page-container">
          <SurfaceBox className="p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">¿Querés ver más ejemplos?</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Las referencias sirven para mirar estructuras aplicadas. El formato correcto se define en la primera conversación.
            </p>
            <div className="mt-6">
              <SecondaryArrowLink href="/casos">Ver todas las referencias</SecondaryArrowLink>
            </div>
          </SurfaceBox>

          <SurfaceBox className="mt-6 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">¿No sabés cuál elegir?</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              No hace falta que llegues con eso resuelto. En la primera conversación te decimos qué conviene hoy y por qué.
            </p>
            <div className="mt-6">
              <SecondaryArrowLink href="/contacto">Quiero que me orienten</SecondaryArrowLink>
            </div>
          </SurfaceBox>
        </div>
      </section>
    </>
  )
}
