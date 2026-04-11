import { LegalPage } from "@/components/legal-page"

const sections = [
  {
    title: "1. Uso del sitio",
    body: "El contenido publicado es informativo sobre servicios, enfoque y criterios de trabajo. El uso del sitio debe ser lícito y de buena fe.",
  },
  {
    title: "2. Propiedad intelectual",
    body: "Textos, estructura, marca y recursos visuales de MUGA están protegidos. No se permite reproducción total o parcial sin autorización.",
  },
  {
    title: "3. Sin garantía absoluta",
    body: "Buscamos mantener información actualizada y funcionamiento estable, pero no garantizamos disponibilidad ininterrumpida ni ausencia total de errores.",
  },
  {
    title: "4. Enlaces externos",
    body: "Podemos incluir enlaces a sitios de terceros. Cada sitio externo se rige por sus propias políticas y términos.",
  },
  {
    title: "5. Cambios",
    body: "Podemos actualizar estos términos para reflejar cambios legales u operativos. La versión vigente es la publicada en esta página.",
  },
]

export default function TerminosPage() {
  return (
    <LegalPage
      title="Términos de uso"
      lead="Reglas generales para navegar y utilizar este sitio."
      updatedAt="16/03/2026"
      sections={sections}
    />
  )
}
