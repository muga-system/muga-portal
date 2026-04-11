import { PageHero } from "@/components/page-hero"
import { BorderedGrid } from "@/components/bordered-grid"
import { LayoutWideDivider } from "@/components/layout-wide-divider"
import { OutlineCtaLink } from "@/components/outline-cta-link"
import { SecondaryArrowLink } from "@/components/secondary-arrow-link"
import { SurfaceBox } from "@/components/surface-box"

const formats = [
  {
    title: "Landing de conversión",
    summary: "Para campañas, servicios puntuales o una sola propuesta.",
    detail: "Ideal si querés llevar a la persona directo a la consulta con una sola acción principal.",
    href: "https://mugaland.vercel.app/",
  },
  {
    title: "Sitio corporativo",
    summary: "Para presentar tu propuesta, explicar servicios y ordenar secciones.",
    detail: "Ideal si necesitás más contexto que una landing, sin perder foco comercial.",
    href: "https://corporativo-astro.vercel.app/",
  },
  {
    title: "Sitio institucional",
    summary: "Para ordenar información, construir confianza y sostener presencia.",
    detail: "Ideal si necesitás una web más estable que no dependa de una sola campaña.",
    href: "https://muga-institucional.vercel.app/",
  },
]

export default function FormatosPage() {
  return (
    <>
      <PageHero
        badge="Formatos"
        title="Formatos base según el objetivo"
        description="Acá ves la diferencia entre una landing, un sitio corporativo y un sitio institucional."
        variant="minimal"
      />

      <section className="section-space section-space-after-hero divider-header-gap layout-divider-bottom">
        <div className="page-container">
          <div className="mb-12 grid gap-4 border border-white/10 bg-card/35 p-5 text-sm text-muted-foreground md:grid-cols-3">
            <p>
              <span className="font-semibold text-white">Landing:</span> una oferta, una acción.
            </p>
            <p>
              <span className="font-semibold text-white">Corporativo:</span> propuesta, servicios y
              contacto.
            </p>
            <p>
              <span className="font-semibold text-white">Institucional:</span> confianza,
              información y presencia.
            </p>
          </div>

          <div className="divider-gap-top">
            <LayoutWideDivider />
            <BorderedGrid gridClassName="grid grid-cols-1 md:grid-cols-3" frameClassName="border-y-0">
              {formats.map((item, index) => (
                <article
                  key={item.title}
                  className={`flex min-h-[18rem] flex-col p-7 sm:p-8 ${
                    index < formats.length - 1 ? "border-b border-white/10 md:border-b-0" : ""
                  } ${index < formats.length - 1 ? "md:border-r md:border-white/10" : ""}`}
                >
                  <h2 className="mb-2 text-xl font-semibold tracking-tight text-white">{item.title}</h2>
                  <p className="mb-4 text-sm leading-7 text-muted-foreground">{item.summary}</p>
                  <p className="mb-6 text-sm leading-7 text-muted-foreground">{item.detail}</p>
                  <div className="mt-auto">
                    <OutlineCtaLink href={item.href} external className="font-medium uppercase">
                      Ver referencia
                    </OutlineCtaLink>
                  </div>
                </article>
              ))}
            </BorderedGrid>
            <LayoutWideDivider />
          </div>

          <SurfaceBox className="mt-12 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">¿Querés ver más ejemplos antes de decidir?</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Las referencias sirven para mirar estructuras aplicadas. El formato correcto se define
              en la primera conversación.
            </p>
            <div className="mt-6">
              <SecondaryArrowLink href="/casos">Ver referencias</SecondaryArrowLink>
            </div>
          </SurfaceBox>

          <SurfaceBox className="mt-12 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">¿No sabés cuál elegir?</h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              No hace falta que llegues con eso resuelto. En la primera conversación te decimos qué
              conviene hoy y por qué.
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
