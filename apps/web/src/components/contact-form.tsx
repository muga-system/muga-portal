"use client"

import { useEffect, useState } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"

type SubmitState = "idle" | "submitting" | "success" | "error"

function getAttributionValue(param: string) {
  if (typeof window === "undefined") return ""
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get(param) || ""
}

export function ContactForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [metaFields, setMetaFields] = useState({
    page: "",
    landing_page: "",
    referrer: "",
    locale: "",
    timezone: "",
    user_agent: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
    gclid: "",
    fbclid: "",
  })

  useEffect(() => {
    setMetaFields({
      page: window.location.pathname,
      landing_page: window.location.href,
      referrer: document.referrer || "",
      locale: navigator.language || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      user_agent: navigator.userAgent || "",
      utm_source: getAttributionValue("utm_source"),
      utm_medium: getAttributionValue("utm_medium"),
      utm_campaign: getAttributionValue("utm_campaign"),
      utm_term: getAttributionValue("utm_term"),
      utm_content: getAttributionValue("utm_content"),
      gclid: getAttributionValue("gclid"),
      fbclid: getAttributionValue("fbclid"),
    })
  }, [])

  const submitLabel = submitState === "submitting" ? "Enviando…" : "Enviar consulta"
  const liveMessage =
    submitState === "submitting"
      ? "Enviando consulta"
      : submitState === "error"
        ? "No pudimos enviar el formulario"
        : ""

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitState("submitting")
    setErrorMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)
    const payload: Record<string, string> = {}

    formData.forEach((value, key) => {
      if (typeof value === "string") {
        payload[key] = value
      }
    })

    payload.created_at = new Date().toISOString()

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = (await response.json()) as { redirectTo?: string; error?: string }

      if (!response.ok) {
        if (data.error === "rate_limited") {
          window.location.assign("/contacto/enviado")
          return
        }

        if (data.error === "lead_not_stored") {
          throw new Error("lead_not_stored")
        }

        throw new Error(`request_failed_${response.status}`)
      }

      setSubmitState("success")

      if (data.redirectTo) {
        window.location.assign(data.redirectTo)
        return
      }

      form.reset()
      setSubmitState("idle")
    } catch {
      setSubmitState("error")
      setErrorMessage("No pudimos completar el envio. Volve a intentar en unos segundos.")
    }
  }

  return (
    <>
      <p className="sr-only" aria-live="polite">
        {liveMessage}
      </p>

      <div className={`mb-6 ${submitState === "error" ? "block" : "hidden"}`} aria-live="polite">
        <div className="border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{errorMessage}</div>
      </div>

      <form className="space-y-6" method="post" action="/api/contacto" noValidate onSubmit={handleSubmit} aria-busy={submitState === "submitting"}>
        <input type="hidden" name="created_at" value="" />
        <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-white">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Tu nombre…"
              className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              autoCapitalize="off"
              spellCheck={false}
              required
              placeholder="tu@email.com…"
              className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-sm font-medium text-white">
            Telefono o WhatsApp
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+54 9 11 1234-5678…"
            className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="province" className="mb-2 block text-sm font-medium text-white">
            Provincia (opcional)
          </label>
          <input
            id="province"
            name="province"
            type="text"
            autoComplete="address-level1"
            placeholder="Ej: Buenos Aires, Cordoba, CABA"
            className="muga-field h-10 w-full border border-white/15 px-3 text-sm text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="project" className="mb-2 block text-sm font-medium text-white">
            ¿Qué tipo de sitio creés que necesitás? (opcional)
          </label>
          <div className="relative">
            <select
              id="project"
              name="project"
              defaultValue=""
              className="muga-field muga-select h-10 w-full appearance-none border border-white/15 px-3 pr-10 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">No lo sé todavía</option>
              <option value="landing">Landing de conversión</option>
              <option value="corporativo">Sitio corporativo</option>
              <option value="institucional">Sitio institucional</option>
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="budget" className="mb-2 block text-sm font-medium text-white">
            Rango de inversión orientativo (opcional)
          </label>
          <div className="relative">
            <select
              id="budget"
              name="budget"
              defaultValue=""
              className="muga-field muga-select h-10 w-full appearance-none border border-white/15 px-3 pr-10 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="">No lo sé todavía</option>
              <option value="start">Base</option>
              <option value="business">Intermedio</option>
              <option value="premium">Avanzado</option>
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-white">
            Objetivo y problema actual
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder="Contanos qué vendés, qué querés lograr y qué te está frenando hoy…"
            className="muga-field w-full border border-white/15 px-3 py-2 text-sm text-white placeholder:text-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        <input type="hidden" name="page" value={metaFields.page} />
        <input type="hidden" name="landing_page" value={metaFields.landing_page} />
        <input type="hidden" name="referrer" value={metaFields.referrer} />
        <input type="hidden" name="locale" value={metaFields.locale} />
        <input type="hidden" name="timezone" value={metaFields.timezone} />
        <input type="hidden" name="user_agent" value={metaFields.user_agent} />
        <input type="hidden" name="source" value="website" />
        <input type="hidden" name="utm_source" value={metaFields.utm_source} />
        <input type="hidden" name="utm_medium" value={metaFields.utm_medium} />
        <input type="hidden" name="utm_campaign" value={metaFields.utm_campaign} />
        <input type="hidden" name="utm_term" value={metaFields.utm_term} />
        <input type="hidden" name="utm_content" value={metaFields.utm_content} />
        <input type="hidden" name="gclid" value={metaFields.gclid} />
        <input type="hidden" name="fbclid" value={metaFields.fbclid} />
        <input type="hidden" name="status" value="new" />
        <input type="hidden" name="lead_tier" value="undecided" />
        <input type="hidden" name="lead_stage" value="discovery" />
        <input type="hidden" name="lead_route" value="unspecified:undecided" />

        <button
          type="submit"
          data-track-zone="contact-form-submit"
          disabled={submitState === "submitting"}
          className="inline-flex items-center gap-2 border border-primary/70 bg-primary px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
          <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </form>
    </>
  )
}
