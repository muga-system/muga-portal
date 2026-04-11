import { PageHero } from "@/components/page-hero"
import { BorderedGrid } from "@/components/bordered-grid"
import { LayoutWideDivider } from "@/components/layout-wide-divider"
import { OutlineCtaLink } from "@/components/outline-cta-link"
import { SecondaryArrowLink } from "@/components/secondary-arrow-link"
import { SurfaceBox } from "@/components/surface-box"

const clientCases = [
  {
    label: "Cliente 01",
    name: "Dicorato",
    description:
      "Caso publicado con foco en presencia digital clara y recorrido de contenido orientado a conversión.",
    domain: "dicorato.com.ar",
    href: "https://www.dicorato.com.ar/",
  },
  {
    label: "Cliente 02",
    name: "El Método Adulma",
    description:
      "Caso publicado con estructura narrativa de oferta y secciones pensadas para explicar método y propuesta.",
    domain: "elmetodoadulma.com",
    href: "https://elmetodoadulma.com/",
  },
  {
    label: "Cliente 03",
    name: "Mandorla",
    description:
      "Caso publicado con foco en propuesta de valor clara, navegación ordenada y recorrido orientado a contacto.",
    domain: "muga-mandorla.vercel.app",
    href: "https://muga-mandorla.vercel.app/",
  },
]

const structureReferences = [
  {
    label: "Referencia 01",
    title: "Landing de conversión",
    description:
      "Muestra cómo ordenamos una oferta puntual cuando todo apunta a una sola acción.",
    lookAt: "hero, beneficio central y CTA.",
    usefulFor: "campañas, servicios puntuales, captación directa.",
    href: "https://mugaland.vercel.app/",
  },
  {
    label: "Referencia 02",
    title: "Sitio corporativo",
    description:
      "Muestra cómo ordenamos una propuesta más amplia cuando hay que explicar mejor qué hace el negocio.",
    lookAt: "recorrido de secciones, jerarquía de servicios y cierre de contacto.",
    usefulFor: "presentar propuesta, ordenar servicios y sostener confianza.",
    href: "https://corporativo-astro.vercel.app/",
  },
  {
    label: "Referencia 03",
    title: "Institucional y presencia",
    description:
      "Muestra una estructura pensada para reforzar marca, ordenar información y sostener presencia.",
    lookAt: "orden de información, confianza y claridad de lectura.",
    usefulFor: "presencia de marca, servicios y comunicación institucional.",
    href: "https://muga-institucional.vercel.app/",
  },
]

export default function CasosPage() {
  return (
    <>
      <PageHero
        badge="Referencias"
        title="Referencias"
        description="Acá podés ver casos de clientes publicados y referencias de estructura para entender cómo trabajamos."
        variant="minimal"
      />

      <section className="section-space section-space-after-hero divider-header-gap layout-divider-bottom">
        <div className="page-container">
          <div className="mb-12 max-w-3xl border border-white/10 bg-card/35 p-5 text-sm text-muted-foreground">
            Los casos muestran sitios publicados. Las referencias muestran estructuras tipo. Todo se
            ajusta en la primera conversación.
          </div>

          <h2 className="mb-0 text-xl font-semibold text-white">Casos de clientes</h2>

          <LayoutWideDivider />
          <BorderedGrid gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" frameClassName="border-y-0">
            {clientCases.map((item, index) => (
              <article
                key={item.name}
                className={`flex min-h-[19rem] flex-col p-7 sm:p-8 ${
                  index < clientCases.length - 1 ? "border-b border-white/10 lg:border-b-0" : ""
                } ${
                  index === 0 ? "md:border-r md:border-white/10 lg:border-r" :
                  index === 1 ? "lg:border-r lg:border-white/10" : ""
                }`}
              >
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-primary">
                  {item.label}
                </p>
                <h3 className="text-2xl font-semibold text-white">{item.name}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{item.description}</p>
                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <p className="break-words">
                    <span className="font-semibold text-white">Sitio:</span> {item.domain}
                  </p>
                </div>
                <OutlineCtaLink href={item.href} external className="mt-6 font-semibold">
                  Ver sitio
                </OutlineCtaLink>
              </article>
            ))}
          </BorderedGrid>
          <LayoutWideDivider />

          <h2 className="divider-gap-top mb-0 text-xl font-semibold text-white">Referencias de estructura</h2>

          <LayoutWideDivider />
          <BorderedGrid gridClassName="grid grid-cols-1 md:grid-cols-3" frameClassName="border-y-0">
            {structureReferences.map((item, index) => (
              <article
                key={item.title}
                className={`flex min-h-[19rem] flex-col p-7 sm:p-8 ${
                  index < structureReferences.length - 1 ? "border-b border-white/10 md:border-b-0" : ""
                } ${index < structureReferences.length - 1 ? "md:border-r md:border-white/10" : ""}`}
              >
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-primary">
                  {item.label}
                </p>
                <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{item.description}</p>
                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-semibold text-white">Mirar:</span> {item.lookAt}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Sirve para:</span> {item.usefulFor}
                  </p>
                </div>
                <OutlineCtaLink href={item.href} external className="mt-6 font-semibold">
                  Ver referencia
                </OutlineCtaLink>
              </article>
            ))}
          </BorderedGrid>
          <LayoutWideDivider />

          <SurfaceBox className="mt-12 p-6 sm:p-8">
            <h2 className="text-2xl font-semibold text-white">
              La referencia sirve para mirar. La conversación inicial sirve para decidir.
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Si querés saber cuál se acerca más a tu caso, el siguiente paso es simple: contanos tu
              objetivo y te decimos qué conviene.
            </p>
            <div className="mt-6 flex flex-wrap gap-6">
              <SecondaryArrowLink href="/contacto">Quiero definir mi caso</SecondaryArrowLink>
              <SecondaryArrowLink href="/formatos">Ver formatos</SecondaryArrowLink>
            </div>
          </SurfaceBox>
        </div>
      </section>
    </>
  )
}
