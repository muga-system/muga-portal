import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight, ChartNoAxesCombined, ChevronRight, Layers, ListChecks, SquareArrowRight } from "lucide-react"
import { BorderedGrid } from "@/components/bordered-grid"
import { LayoutWideDivider } from "@/components/layout-wide-divider"
import { OutlineCtaLink } from "@/components/outline-cta-link"
import { SectionIntro } from "@/components/section-intro"
import { SecondaryArrowLink } from "@/components/secondary-arrow-link"
import { SurfaceBox } from "@/components/surface-box"

const ContactForm = dynamic(
  () => import("@/components/contact-form").then((module) => module.ContactForm),
  {
    loading: () => <p className="text-sm text-muted-foreground">Cargando formulario…</p>,
  }
)

const pillars = [
  {
    title: "Conversión",
    description: "Definimos una única acción principal por pantalla.",
    detail: "Menos fricción en la decisión.",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Jerarquía",
    description: "Priorizamos contenido para lectura rápida y escaneo claro.",
    detail: "Propuesta entendible en pocos segundos.",
    icon: Layers,
  },
  {
    title: "Flujo",
    description: "Diseñamos el recorrido entre secciones y CTAs.",
    detail: "Ruta concreta hacia contacto o compra.",
    icon: SquareArrowRight,
  },
  {
    title: "Secuencia",
    description: "Estructuramos el mensaje por etapas de decisión.",
    detail: "Base lista para escalar sin rehacer.",
    icon: ListChecks,
  },
]

const faq = [
  {
    q: "No sé qué comprar",
    a: "No hace falta que lo sepas. Justamente por eso conviene escribirnos: vemos tu objetivo y te decimos qué formato tiene más sentido hoy.",
  },
  {
    q: "¿La consulta me obliga a contratar?",
    a: "No. La primera conversación ordena la decisión. Después decidís si avanzamos juntos, pero ya con más claridad.",
  },
  {
    q: "Ya tengo una web, ¿igual vale la pena?",
    a: "Sí. Si tu web actual no explica bien, no ordena la decisión o no te trae el tipo de consulta que buscás, hay algo para corregir.",
  },
  {
    q: "¿Tengo que hacer todo de una?",
    a: "No. Muchas veces conviene empezar con una versión más simple, resolver lo importante y crecer después sobre una base ordenada.",
  },
  {
    q: "¿Cuándo hablamos de inversión real?",
    a: "Después de la primera conversación. Primero definimos objetivo, formato y alcance. Recién ahí tiene sentido hablar de propuesta.",
  },
]

export default function HomePage() {
  return (
    <>
      <div className="relative">

        <section className="relative -mt-12 layout-divider-bottom py-8 sm:py-10 lg:py-14">
        <div className="page-container min-h-[34rem] content-center">
          <div className="max-w-4xl">
            <div className="mb-5 muga-badge muga-badge--md">muga dev</div>

              <h1 className="text-4xl font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-[4.9rem]">
                Construimos sitios web con una estructura clara desde el inicio
              </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Diseñamos estructura, jerarquía y flujo para que tu web comunique mejor y sostenga
              una acción principal.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/contacto"
                data-track-zone="home-hero-contact"
                className="inline-flex w-full items-center justify-center gap-2 border border-primary/55 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/18 sm:w-auto"
              >
                Contanos tu caso
                <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </Link>
              <SecondaryArrowLink href="/modelo" data-track-zone="home-hero-modelo">Ver el modelo</SecondaryArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pt-12 pb-0">
        <div className="page-container">
          <SectionIntro
            badge="Sistema"
            title="La base con la que ordenamos cada sitio"
            lead="Conversión, jerarquía, flujo y secuencia aplicados para que la web sea clara, ordenada y fácil de entender."
            className="mb-0 max-w-3xl"
            titleClassName="mb-4 max-w-2xl"
          />

          <div>
            <LayoutWideDivider />
            <BorderedGrid gridClassName="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4" frameClassName="border-y-0">
              {pillars.map(({ title, description, detail, icon: Icon }, index) => (
                <article
                  key={title}
                  className={`h-full min-h-[17.5rem] p-7 sm:min-h-[19rem] sm:p-8 ${
                    index === 0
                      ? "md:border-r md:border-white/10 xl:border-r"
                      : index === 1
                        ? "xl:border-r xl:border-white/10"
                        : index === 2
                          ? "md:border-r md:border-white/10 xl:border-r"
                          : ""
                  }`}
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center border border-primary/50 bg-primary/8 text-primary">
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
                  <p className="max-w-sm text-muted-foreground">{description}</p>
                  <p className="mt-3 text-sm text-white/80">{detail}</p>
                </article>
              ))}
            </BorderedGrid>
            <LayoutWideDivider />
          </div>

          <div className="mt-12">
            <LayoutWideDivider />
          </div>
        </div>
      </section>

      <section className="relative layout-divider-bottom bg-[rgba(24,23,23,0.3)] pt-12">
        <div className="page-container">
          <SectionIntro
            badge="Referencias"
            title="Referencias publicadas"
            lead="Dos proyectos publicados para revisar estructura, navegación y foco de conversión en contexto real."
            className="mb-0 max-w-3xl"
            titleClassName="mb-4 max-w-2xl"
          />

          <LayoutWideDivider />
          <BorderedGrid gridClassName="grid grid-cols-1 md:grid-cols-2" frameClassName="border-y-0">
            <article className="flex h-full min-h-[16.5rem] flex-col p-7 sm:p-8 md:border-r md:border-white/10">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-primary">Caso 01</p>
              <h3 className="mb-2 text-2xl font-semibold tracking-tight text-white">Dicorato</h3>
              <p className="mb-6 max-w-md text-sm leading-7 text-muted-foreground">
                Caso con foco en presencia clara, recorrido de contenido ordenado y cierre a
                consulta.
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                <span className="font-semibold text-white">Sitio:</span> dicorato.com.ar
              </p>
              <div className="mt-auto w-full">
                <OutlineCtaLink href="https://www.dicorato.com.ar/" external className="font-semibold">
                  Ver sitio
                </OutlineCtaLink>
              </div>
            </article>

            <article className="flex h-full min-h-[16.5rem] flex-col p-7 sm:p-8">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.28em] text-primary">Caso 02</p>
              <h3 className="mb-2 text-2xl font-semibold tracking-tight text-white">El Método Adulma</h3>
              <p className="mb-6 max-w-md text-sm leading-7 text-muted-foreground">
                Caso con narrativa de oferta, secciones de método y jerarquía pensada para explicar
                propuesta.
              </p>
              <p className="mb-6 text-sm text-muted-foreground">
                <span className="font-semibold text-white">Sitio:</span> elmetodoadulma.com
              </p>
              <div className="mt-auto w-full">
                <OutlineCtaLink href="https://elmetodoadulma.com/" external className="font-semibold">
                  Ver sitio
                </OutlineCtaLink>
              </div>
            </article>
          </BorderedGrid>
          <LayoutWideDivider />

          <div className="flex h-12 items-center">
            <SecondaryArrowLink href="/casos">Ver todas las referencias</SecondaryArrowLink>
          </div>
          </div>
      </section>

      <section className="relative layout-divider-bottom bg-[rgba(24,23,23,0.3)] pt-12">
        <div className="page-container">
          <SectionIntro
            badge="FAQ"
            title="Dudas comunes antes de avanzar"
            lead="Estas preguntas suelen aparecer antes de contratar. Las resolvemos directo."
            className="mb-0 max-w-3xl"
            titleClassName="mb-4 max-w-2xl"
          />

          <LayoutWideDivider />
          <div
            className="relative left-1/2 -translate-x-1/2"
            style={{ width: "var(--layout-frame-width)" }}
          >
            {faq.map((item, index) => (
              <details
                key={item.q}
                className="faq-row faq-row--line p-5 transition-colors duration-200"
                open={index === 0}
              >
                <summary className="faq-summary text-[1.06rem]">
                  <span>{item.q}</span>
                  <ChevronRight className="faq-summary__icon" size={20} strokeWidth={1.8} aria-hidden="true" />
                </summary>
                <p className="faq-answer mt-3 max-w-3xl leading-7">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative layout-divider-bottom pt-12 pb-12">
        <div className="page-container">
          <SectionIntro
            badge="Contacto"
            title="Contanos tu caso y te orientamos con el formato"
            lead="No hace falta que llegues con el formato resuelto. Con tu objetivo alcanza para ordenar el punto de partida y avanzar con una propuesta clara."
            className="mb-0 max-w-3xl"
            titleClassName="mb-4"
            leadClassName="mb-8"
          />

          <SurfaceBox className="form-panel-dots muga-surface--static p-6 sm:p-8 lg:p-10">
            <div className="relative z-10">
              <ContactForm />
            </div>
          </SurfaceBox>

        </div>
      </section>

      </div>
    </>
  )
}
