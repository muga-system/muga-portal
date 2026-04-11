import { PageHero } from "@/components/page-hero"
import { BentoGridEffect } from "@/components/bento-grid-effect"
import { BentoIcon } from "@/components/bento-icon"
import { SecondaryArrowLink } from "@/components/secondary-arrow-link"
import { SurfaceBox } from "@/components/surface-box"

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start">
      <span className="mr-2 text-primary">•</span>
      <span>{children}</span>
    </li>
  )
}

export default function ModeloPage() {
  return (
    <>
      <PageHero
        badge="Modelo"
        title="Cómo trabajamos y qué definimos"
        description="Para que sepas qué definimos antes de avanzar y qué te llevás en cada paso."
        variant="feature"
        aside={
          <>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Ruta de decisión</p>
            <ol className="mt-4 space-y-3 text-sm text-white/75">
              <li className="border-l border-primary/45 pl-3">Objetivo real del sitio</li>
              <li className="border-l border-primary/45 pl-3">Formato recomendado</li>
              <li className="border-l border-primary/45 pl-3">Alcance inicial razonable</li>
            </ol>
          </>
        }
      />
      <BentoGridEffect />

      <section className="relative layout-divider-bottom pt-12 pb-12">
        <div className="page-container">
          <div className="grid grid-cols-1 auto-rows-[minmax(200px,auto)] gap-0 md:grid-cols-4">
            <article className="bento-cell bento-card p-6 md:col-span-1">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Qué resolvemos</h3>
              <BentoIcon src="/icons/layers.svg" alt="Icono de base técnica" />
              <ul className="relative z-10 space-y-2 text-muted-foreground">
                <Bullet>Definimos qué tipo de sitio conviene según tu objetivo.</Bullet>
                <Bullet>Ordenamos la jerarquía y el contenido principal.</Bullet>
                <Bullet>Construimos una base clara para vender y crecer sin rehacer.</Bullet>
                <Bullet>Dejamos el siguiente paso definido.</Bullet>
              </ul>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-1">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Cuándo encaja</h3>
              <BentoIcon src="/icons/shield-user.svg" alt="Icono de encaje" />
              <ul className="relative z-10 space-y-2 text-muted-foreground">
                <Bullet>Necesitás salir con un sitio claro sin perder meses en vueltas.</Bullet>
                <Bullet>Tu web actual no explica bien lo que vendés o no convierte como debería.</Bullet>
                <Bullet>Querés una base seria antes de invertir más tráfico, contenido o campañas.</Bullet>
              </ul>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-2">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Cómo trabajamos</h3>
              <BentoIcon src="/icons/drafting-compass.svg" alt="Icono de sistema" />
              <div className="relative z-10">
                <p className="text-muted-foreground">
                  No arrancamos diseñando por intuición. Primero vemos qué tiene que lograr la web,
                  después recomendamos el formato y recién ahí avanzamos.
                </p>
                <p className="mt-4 text-muted-foreground">
                  Así sabés qué estás comprando, por qué tiene sentido y cuál es el alcance inicial.
                </p>
              </div>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-1">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Qué incluye</h3>
              <BentoIcon src="/icons/list-checks.svg" alt="Icono de checklist" />
              <ul className="relative z-10 space-y-2 text-muted-foreground">
                <Bullet>Recomendación del formato más conveniente.</Bullet>
                <Bullet>Jerarquía de contenido y acción principal.</Bullet>
                <Bullet>Alcance inicial para no sobredimensionar el sitio.</Bullet>
                <Bullet>Siguiente paso claro para avanzar con decisión.</Bullet>
              </ul>
            </article>

            <article className="bento-cell bento-card overflow-x-auto p-6 md:col-span-2">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Qué definimos</h3>
              <div className="relative z-10 max-w-full overflow-x-auto">
                <table className="min-w-[34rem] text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 text-left text-muted-foreground">Decisión</th>
                      <th className="py-2 text-left text-muted-foreground">Qué revisamos</th>
                      <th className="py-2 text-left text-muted-foreground">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/10">
                      <td className="py-2 pr-4 text-muted-foreground">Objetivo</td>
                      <td className="py-2 pr-4 text-muted-foreground">Qué tiene que pasar en la web</td>
                      <td className="py-2 font-semibold text-primary">Acción principal clara</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2 pr-4 text-muted-foreground">Formato</td>
                      <td className="py-2 pr-4 text-muted-foreground">Qué tipo de sitio conviene hoy</td>
                      <td className="py-2 font-semibold text-primary">Landing, corporativo o institucional</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2 pr-4 text-muted-foreground">Contenido</td>
                      <td className="py-2 pr-4 text-muted-foreground">Qué se ve primero y qué puede esperar</td>
                      <td className="py-2 font-semibold text-primary">Jerarquía y recorrido</td>
                    </tr>
                    <tr className="border-b border-white/10">
                      <td className="py-2 pr-4 text-muted-foreground">Alcance</td>
                      <td className="py-2 pr-4 text-muted-foreground">Qué conviene resolver ahora y qué después</td>
                      <td className="py-2 font-semibold text-primary">Versión inicial clara</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-muted-foreground">Implementación</td>
                      <td className="py-2 pr-4 text-muted-foreground">Cómo se ejecuta la versión elegida</td>
                      <td className="py-2 font-semibold text-primary">Próximo paso definido</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-1">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Qué ganás</h3>
              <BentoIcon src="/icons/badge-check.svg" alt="Icono de consecuencia" />
              <ul className="relative z-10 space-y-2 text-muted-foreground">
                <Bullet>Más claridad para vos y para quien entra al sitio</Bullet>
                <Bullet>Más claridad sobre qué conviene construir</Bullet>
                <Bullet>Menos rehacer y menos desorden a futuro</Bullet>
                <Bullet>Una base lista para crecer con criterio</Bullet>
              </ul>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-2">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Qué no hacemos</h3>
              <BentoIcon src="/icons/brain-cog.svg" alt="Icono de criterio" />
              <p className="text-muted-foreground">
                No empujamos un formato porque sí ni arrancamos a diseñar sin entender el objetivo.
                Si algo no está claro, primero lo definimos.
              </p>
              <p className="mt-4 text-muted-foreground">
                Preferimos frenar antes que hacerte comprar un sitio mal enfocado.
              </p>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-1">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Qué puede sumarse</h3>
              <BentoIcon src="/icons/package-plus.svg" alt="Icono de extensiones" />
              <ul className="relative z-10 space-y-2 text-muted-foreground">
                <Bullet>Blog o carga de contenido cuando el proyecto lo necesita</Bullet>
                <Bullet>Formularios e integraciones específicas</Bullet>
                <Bullet>Secciones nuevas según crecimiento del negocio</Bullet>
                <Bullet>Automatizaciones cuando el flujo lo justifica</Bullet>
              </ul>
            </article>

            <article className="bento-cell bento-card p-6 md:col-span-1">
              <div className="light-effect" />
              <h3 className="mb-4 max-w-[16ch] text-lg font-medium leading-tight text-white sm:max-w-none">Contacto</h3>
              <BentoIcon src="/icons/message-square-text.svg" alt="Icono de contacto" />
              <div className="relative z-10 flex flex-col space-y-4">
                <SecondaryArrowLink href="/contacto">Contar mi caso</SecondaryArrowLink>
                <SecondaryArrowLink href="/casos">Ver referencias</SecondaryArrowLink>
                <SecondaryArrowLink href="/criterios">Ver base técnica</SecondaryArrowLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="relative layout-divider-bottom pt-12 pb-12">
        <SurfaceBox className="page-container p-6 lg:p-8">
          <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
            El alcance y el presupuesto no se definen a ciegas. Primero vemos tu objetivo, después
            definimos qué conviene y recién ahí bajamos una propuesta.
          </p>
        </SurfaceBox>
      </section>
    </>
  )
}
