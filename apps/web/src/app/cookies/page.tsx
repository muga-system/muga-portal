import { LegalPage } from "@/components/legal-page"

const sections = [
  {
    title: "1. Qué usamos",
    bullets: [
      "Almacenamiento local para guardar tu preferencia de consentimiento de analítica.",
      "Session storage para identificar sesión de navegación cuando aceptás analítica.",
      "Eventos first-party para medición de visitas y conversión.",
    ],
  },
  {
    title: "2. Para qué se usa",
    bullets: [
      "Conocer rendimiento de páginas y origen de tráfico.",
      "Medir conversión de visitas a formularios y leads.",
      "Mejorar estructura y contenido en base a uso real.",
    ],
  },
  {
    title: "3. Consentimiento",
    body: "La analítica no esencial se ejecuta solo cuando aceptás en el banner. Si rechazás, el sitio sigue funcionando sin analítica de comportamiento.",
  },
  {
    title: "4. Cómo cambiar tu decisión",
    body: "Podés limpiar almacenamiento del navegador para volver a mostrar el banner y redefinir tu preferencia de analítica.",
  },
]

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies y analítica"
      lead="Explicamos de forma simple qué almacenamos y cómo podés gestionarlo."
      updatedAt="16/03/2026"
      sections={sections}
    />
  )
}
