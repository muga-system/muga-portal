import { PageHero } from "@/components/page-hero"
import { SecondaryArrowLink } from "@/components/secondary-arrow-link"
import { SurfaceBox } from "@/components/surface-box"

export default function ContactoEnviadoPage() {
  return (
    <>
      <PageHero
        badge="MUGA"
        title="Consulta enviada"
        description="Gracias por escribirnos. Te vamos a responder por email con los próximos pasos dentro de 48 horas hábiles."
        variant="minimal"
      />

      <section className="relative layout-divider-bottom pt-12 pb-12">
        <div className="page-container">
          <SurfaceBox className="max-w-3xl p-8">
            <p className="text-sm text-muted-foreground">
              Revisamos tu caso y te contactamos por correo para coordinar la conversación inicial.
            </p>
            <div className="mt-8 flex flex-wrap gap-6">
              <SecondaryArrowLink href="/">Volver al inicio</SecondaryArrowLink>
              <SecondaryArrowLink href="/modelo">Ver cómo trabajamos</SecondaryArrowLink>
            </div>
          </SurfaceBox>
        </div>
      </section>
    </>
  )
}
