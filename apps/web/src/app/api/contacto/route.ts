import nodemailer from "nodemailer"

const requiredFields = ["name", "email", "message"]
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 3

function normalizeText(value: unknown) {
  return String(value || "").trim()
}

function normalizeLower(value: unknown) {
  return normalizeText(value).toLowerCase()
}

async function isRateLimitedBySupabase({
  supabaseUrl,
  supabaseServiceRoleKey,
  leadsTable,
  email,
}: {
  supabaseUrl: string
  supabaseServiceRoleKey: string
  leadsTable: string
  email: string
}) {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const url = new URL(`${supabaseUrl}/rest/v1/${leadsTable}`)

  url.searchParams.set("select", "id")
  url.searchParams.set("email", `eq.${email}`)
  url.searchParams.set("created_at", `gte.${since}`)

  try {
    const response = await fetch(url.toString(), {
      method: "HEAD",
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Prefer: "count=exact",
      },
    })

    if (!response.ok) {
      return false
    }

    const contentRange = response.headers.get("content-range") || ""
    const countSegment = contentRange.split("/")[1]
    const count = Number.parseInt(countSegment || "0", 10)

    if (!Number.isFinite(count)) {
      return false
    }

    return count >= RATE_LIMIT_MAX_REQUESTS
  } catch {
    return false
  }
}

function inferSource(payload: Record<string, string | null>) {
  const utmSource = normalizeLower(payload.utm_source)
  if (utmSource) return utmSource
  if (normalizeLower(payload.gclid)) return "google"
  if (normalizeLower(payload.fbclid)) return "facebook"

  const referrer = normalizeText(payload.referrer)
  if (!referrer) return "direct"

  try {
    return new URL(referrer).hostname.toLowerCase()
  } catch {
    return "referral"
  }
}

function inferMedium(payload: Record<string, string | null>) {
  const utmMedium = normalizeLower(payload.utm_medium)
  if (utmMedium) return utmMedium
  if (normalizeLower(payload.gclid) || normalizeLower(payload.fbclid)) return "cpc"
  if (normalizeText(payload.referrer)) return "referral"
  return "none"
}

function getLeadTier(payload: Record<string, string | null>) {
  const leadTier = normalizeLower(payload.lead_tier)
  const budget = normalizeLower(payload.budget)
  const leadStage = normalizeLower(payload.lead_stage)

  if (leadTier === "premium" || budget === "premium" || leadStage === "high-intent") {
    return "premium"
  }

  if (leadTier === "business" || budget === "business" || leadStage === "qualified") {
    return "business"
  }

  return "start"
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function getReplyTemplate(name: string) {
  const safeName = escapeHtml(name || "")

  return {
    subject: "Recibimos tu consulta en MUGA",
    text: [
      `Hola ${name || ""},`,
      "",
      "Recibimos tu consulta y ya estamos revisando tu caso.",
      "Te respondemos dentro de 48 horas habiles con una devolucion clara sobre el mejor siguiente paso.",
      "",
      "Equipo MUGA",
      "muga.dev",
    ].join("\n"),
    html: `<div style="font-family: Arial, sans-serif; background:#ffffff; color:#111111; padding:24px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:420px; margin:0 auto;"><tr><td style="border:1px solid #e8e8e8; padding:30px 24px; background:#ffffff;"><p style="margin:0 0 10px; font-size:12px; letter-spacing:1px; color:#ff5353; text-transform:uppercase;">MUGA</p><h2 style="margin:0 0 20px; font-size:28px; line-height:1.2; color:#111111;">Recibimos tu consulta</h2><p style="margin:0 0 16px; line-height:1.8; color:#222222;">Hola ${safeName},</p><p style="margin:0 0 16px; line-height:1.8; color:#222222;">Recibimos tu consulta y ya estamos revisando tu caso.</p><p style="margin:0 0 16px; line-height:1.8; color:#222222;">Te respondemos dentro de 48 horas habiles con una devolucion clara sobre el mejor siguiente paso.</p><p style="margin:0; padding-top:14px; border-top:1px solid #ececec; color:#666666; font-size:13px;">Equipo MUGA · <a href="https://muga.dev" style="color:#ff5353; text-decoration:none;">muga.dev</a></p></td></tr></table></div>`,
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || ""

  if (!contentType.includes("application/json")) {
    return Response.json({ error: "invalid_content_type" }, { status: 400 })
  }

  let payload: Record<string, unknown>

  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 })
  }

  const cleanedPayload: Record<string, string | null> = {}

  Object.entries(payload).forEach(([key, value]) => {
    cleanedPayload[key] = typeof value === "string" ? value.trim() : null
  })

  if (normalizeText(cleanedPayload.company_website)) {
    return Response.json({ ok: true, redirectTo: "/contacto/enviado" })
  }

  delete cleanedPayload.company_website

  for (const field of requiredFields) {
    if (!normalizeText(cleanedPayload[field])) {
      return Response.json({ error: `missing_${field}` }, { status: 400 })
    }
  }

  cleanedPayload.email = normalizeLower(cleanedPayload.email)

  cleanedPayload.utm_source = inferSource(cleanedPayload)
  cleanedPayload.utm_medium = inferMedium(cleanedPayload)
  cleanedPayload.source = cleanedPayload.source || "website"
  cleanedPayload.status = cleanedPayload.status || "new"
  cleanedPayload.lead_tier = cleanedPayload.lead_tier || getLeadTier(cleanedPayload)
  cleanedPayload.lead_stage = cleanedPayload.lead_stage || "discovery"

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const leadsTable = process.env.SUPABASE_LEADS_TABLE || "leads"

  if (supabaseUrl && supabaseServiceRoleKey && cleanedPayload.email) {
    const isRateLimited = await isRateLimitedBySupabase({
      supabaseUrl,
      supabaseServiceRoleKey,
      leadsTable,
      email: cleanedPayload.email,
    })

    if (isRateLimited) {
      return Response.json({ ok: true, redirectTo: "/contacto/enviado", rateLimited: true })
    }
  }

  const leadStored = await (async () => {
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return false
    }

    try {
      const supabaseResponse = await fetch(`${supabaseUrl}/rest/v1/${leadsTable}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseServiceRoleKey,
          Authorization: `Bearer ${supabaseServiceRoleKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(cleanedPayload),
      })

      if (!supabaseResponse.ok) {
        const failureDetail = await supabaseResponse.text().catch(() => "")
        console.error("[contacto] lead insert failed", {
          status: supabaseResponse.status,
          detail: failureDetail,
        })
      }

      return supabaseResponse.ok
    } catch (error) {
      console.error("[contacto] lead insert threw", error)
      return false
    }
  })()

  if (!leadStored) {
    return Response.json(
      {
        error: "lead_not_stored",
        emailPipelineEnabled: false,
      },
      { status: 502 }
    )
  }

  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || "")
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const alertFromEmail = process.env.ALERT_FROM_EMAIL || "Notificaciones MUGA <notificaciones@muga.dev>"
  const alertToEmail = process.env.ALERT_TO_EMAIL
  const emailPipelineEnabled = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && alertToEmail)

  let emailResultsPromise: Promise<{ alertEmailSent: boolean; customerReplySent: boolean }> = Promise.resolve({
    alertEmailSent: false,
    customerReplySent: false,
  })

  if (emailPipelineEnabled) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: smtpPort !== 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: { minVersion: "TLSv1.2" },
    })

    const leadSummary = [
      `Nombre: ${cleanedPayload.name || "-"}`,
      `Email: ${cleanedPayload.email || "-"}`,
      `Telefono: ${cleanedPayload.phone || "-"}`,
      `Proyecto: ${cleanedPayload.project || "-"}`,
      `Presupuesto: ${cleanedPayload.budget || "-"}`,
      `Etapa lead: ${cleanedPayload.lead_stage || "-"}`,
      `Fuente: ${cleanedPayload.utm_source || "-"}`,
      `Pagina: ${cleanedPayload.page || "-"}`,
      "",
      "Mensaje:",
      `${cleanedPayload.message || "-"}`,
    ].join("\n")
    const customerEmail = cleanedPayload.email || ""
    const customerReply = customerEmail.includes("@") ? getReplyTemplate(cleanedPayload.name || "") : null

    emailResultsPromise = (async () => {
      const [alertResult, customerResult] = await Promise.allSettled([
        transporter.sendMail({
          from: alertFromEmail,
          to: alertToEmail,
          replyTo: cleanedPayload.email || undefined,
          subject: `[LEAD MUGA] ${cleanedPayload.name || "Sin nombre"}`,
          text: leadSummary,
        }),
        customerReply
          ? transporter.sendMail({
              from: alertFromEmail,
              to: customerEmail,
              subject: customerReply.subject,
              text: customerReply.text,
              html: customerReply.html,
              replyTo: alertToEmail,
            })
          : Promise.resolve(null),
      ])

      if (alertResult.status === "rejected") {
        console.error("[contacto] alert email failed", alertResult.reason)
      }

      if (customerReply && customerResult.status === "rejected") {
        console.error("[contacto] customer reply failed", customerResult.reason)
      }

      return {
        alertEmailSent: alertResult.status === "fulfilled",
        customerReplySent: customerReply ? customerResult.status === "fulfilled" : false,
      }
    })()
  }

  const { alertEmailSent, customerReplySent } = await emailResultsPromise

  return Response.json({
    ok: true,
    redirectTo: "/contacto/enviado",
    leadStored,
    alertEmailSent,
    customerReplySent,
    emailPipelineEnabled,
  })
}
