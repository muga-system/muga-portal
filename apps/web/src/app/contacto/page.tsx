import dynamic from "next/dynamic"
import { PageHero } from "@/components/page-hero"
import { SectionIntro } from "@/components/section-intro"
import { SecondaryArrowLink } from "@/components/secondary-arrow-link"
import { SurfaceBox } from "@/components/surface-box"

const ContactForm = dynamic(
  () => import("@/components/contact-form").then((module) => module.ContactForm),
  {
    loading: () => <p className="text-sm text-muted-foreground">Cargando formulario…</p>,
  }
)

const steps = [
  {
    id: "01",
    title: "Primera conversación",
    description:
      "Entendemos qué vendés, qué querés lograr y dónde hoy se traba la decisión.",
    time: "30-45 min",
    result: "Lectura inicial del caso",
  },
  {
    id: "02",
    title: "Recomendación",
    description:
      "Te decimos qué tipo de sitio conviene, qué debería incluir y cuál es la primera versión razonable.",
    time: "24-48 h",
    result: "Formato, jerarquía y alcance inicial",
  },
  {
    id: "03",
    title: "Implementación",
    description:
      "Si avanzamos, construimos la versión definida y dejamos una base lista para crecer sin rehacer.",
    time: "Según alcance",
    result: "Sitio implementado",
  },
]

export default function ContactoPage() {
  return (
    <>
      <PageHero
        badge="MUGA"
        title="Contanos tu caso"
        description="No hace falta que sepas qué tipo de sitio necesitás. Revisamos tu objetivo y te orientamos con una propuesta clara."
        variant="feature"
        aside={
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Respuesta esperada</p>
            <p className="mt-3 text-sm text-white/75">Primera lectura del caso y recomendación inicial en 24-48 h.</p>
            <p className="mt-4 border-t border-white/10 pt-4 text-xs uppercase tracking-[0.18em] text-white/55">
              Sin compromiso de contratación
            </p>
          </>
        }
      />

      <section className="relative layout-divider-bottom pt-12 pb-12">
        <div className="page-container">
          <div className="mb-12">
            <SectionIntro
              badge="Proceso"
              title="Así convertimos tu necesidad en una propuesta clara"
              lead="Primero entendemos tu objetivo, después te recomendamos el formato y recién ahí avanzamos."
              className="mb-0 max-w-3xl"
              leadClassName="mt-4"
            />

            <div className="divider-gap-top">
              <ol className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {steps.map((step) => (
                  <li
                    key={step.id}
                    className="muga-surface flex h-full min-h-[320px] flex-col p-6 transition-colors duration-200 hover:border-primary/25 md:p-7"
                  >
                    <div className="mb-6">
                      <div className="flex h-16 w-16 items-center justify-center border border-primary/50 bg-primary/8 font-mono text-sm font-semibold tracking-[0.28em] text-primary md:h-[4.5rem] md:w-[4.5rem]">
                        {step.id}
                      </div>
                    </div>
                    <h3 className="mb-3 text-xl font-semibold tracking-tight text-white">{step.title}</h3>
                    <p className="mb-6 flex-1 text-base leading-7 text-white/75 md:mb-8 md:leading-8">
                      {step.description}
                    </p>
                    <div className="space-y-3 pt-2 text-sm">
                      <p>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                          Tiempo:
                        </span>{" "}
                        <span className="text-white">{step.time}</span>
                      </p>
                      <p>
                        <span className="font-mono text-[11px] uppercase tracking-wider text-primary">
                          Resultado:
                        </span>{" "}
                        <span className="text-white">{step.result}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <SurfaceBox className="form-panel-dots muga-surface--static p-6 sm:p-8 lg:p-10">
            <div className="relative z-10">
              <SectionIntro
                badge="Contacto"
                title="Contanos tu caso y te guiamos en la compra"
                lead="No hace falta que sepas qué formato elegir. Con tu objetivo alcanza para empezar."
                className="mb-10 max-w-3xl"
                leadClassName="mt-4"
              />

              <ContactForm />
            </div>
          </SurfaceBox>

          <div className="mt-12 max-w-3xl">
            <p className="mb-4 text-sm text-muted-foreground">
              Si querés más contexto antes de escribirnos, revisá el modelo de trabajo, los formatos
              y algunas referencias.
            </p>
            <div className="flex flex-wrap gap-6">
              <SecondaryArrowLink href="/formatos">Formatos</SecondaryArrowLink>
              <SecondaryArrowLink href="/casos">Referencias</SecondaryArrowLink>
              <SecondaryArrowLink href="/modelo">Modelo</SecondaryArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
