import { LegalPage } from "@/components/legal-page"

const sections = [
  {
    title: "1. Responsable",
    body: "MUGA (nosotros) es responsable del tratamiento de datos recogidos a través de este sitio para atención comercial, analítica operativa y mejora de experiencia.",
  },
  {
    title: "2. Datos que recolectamos",
    bullets: [
      "Datos de contacto enviados en formularios (nombre, email, teléfono, mensaje, proyecto).",
      "Datos de atribución comercial (utm_source, utm_medium, utm_campaign y campos relacionados).",
      "Datos de analítica web (eventos de navegación, página, referer, país aproximado, dispositivo y navegador).",
      "Datos técnicos de seguridad y operación (IP hasheada, timestamps, estado de envío).",
    ],
  },
  {
    title: "3. Finalidades",
    bullets: [
      "Responder consultas y gestionar oportunidades comerciales.",
      "Medir conversión y rendimiento de canales para decisiones operativas.",
      "Mejorar contenido, estructura y experiencia del sitio.",
      "Prevenir abuso técnico, spam y actividades maliciosas.",
    ],
  },
  {
    title: "4. Base y control del usuario",
    body: "El tratamiento para analítica no esencial se activa según tu elección en el banner de consentimiento. Podés aceptar o rechazar analítica y seguir usando el sitio.",
  },
  {
    title: "5. Conservación",
    bullets: [
      "Eventos web: retencion operativa de hasta 90 dias.",
      "Leads comerciales: segun ciclo comercial y requerimientos administrativos internos.",
    ],
  },
  {
    title: "6. Compartición",
    body: "Usamos proveedores técnicos para operar el servicio (hosting, base de datos, analítica y correo). No vendemos tus datos.",
  },
  {
    title: "7. Contacto",
    body: "Para consultas sobre privacidad o ejercicio de derechos, escribinos desde la sección de contacto del sitio.",
  },
]

export default function PrivacidadPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      lead="Resumen claro de qué datos tratamos, para qué y durante cuánto tiempo."
      updatedAt="16/03/2026"
      sections={sections}
    />
  )
}
