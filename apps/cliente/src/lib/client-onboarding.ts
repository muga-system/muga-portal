import nodemailer from 'nodemailer'
import { isInternalEmail } from '@/lib/internal-access'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

interface ApproveLeadResult {
  clientId: string
  projectId: string
  email: string
  temporaryPassword: string
}

function splitName(fullName: string) {
  const chunks = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = chunks[0] || 'Cliente'
  const lastName = chunks.slice(1).join(' ')
  return { firstName, lastName }
}

function generateTemporaryPassword(length = 14) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*'
  let output = ''
  for (let index = 0; index < length; index += 1) {
    output += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return output
}

function inferProjectName(projectType: string | null, fullName: string) {
  if (projectType === 'landing') return `Landing - ${fullName}`
  if (projectType === 'corporativo') return `Sitio corporativo - ${fullName}`
  if (projectType === 'institucional') return `Sitio institucional - ${fullName}`
  return `Sitio web - ${fullName}`
}

async function sendPortalAccessEmail({
  email,
  fullName,
  temporaryPassword,
}: {
  email: string
  fullName: string
  temporaryPassword: string
}) {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || '')
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const from = process.env.ALERT_FROM_EMAIL || 'Notificaciones MUGA <notificaciones@muga.dev>'
  const portalUrl = (process.env.CLIENT_PORTAL_URL || 'http://localhost:3001/acceso').replace(/\/login$/, '/acceso')

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    return false
  }

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
    tls: { minVersion: 'TLSv1.2' },
  })

  const { firstName } = splitName(fullName)

  try {
    await transporter.sendMail({
      from,
      to: email,
      subject: 'Acceso habilitado a tu portal de cliente MUGA',
      text: [
        `Hola ${firstName},`,
        '',
        'Tu acceso al portal de cliente ya está habilitado.',
        '',
        `URL: ${portalUrl}`,
        `Usuario: ${email}`,
        `Clave temporal: ${temporaryPassword}`,
        '',
        'Tambien puedes usar el botón "Continuar con Google" si ese correo esta habilitado en el portal.',
        'Si usas clave temporal, te recomendamos cambiarla en tu primer ingreso.',
        '',
        'Equipo MUGA',
      ].join('\n'),
      html: `<div style="font-family:Arial,sans-serif;background:#fff;color:#111;padding:24px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto"><tr><td style="border:1px solid #e8e8e8;padding:28px 24px;background:#fff"><p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;color:#ff5353;text-transform:uppercase">MUGA · Portal cliente</p><h2 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#111">Tu acceso ya está habilitado</h2><p style="margin:0 0 14px;line-height:1.7;color:#222">Hola ${firstName}, ya puedes ingresar al portal para seguir el avance de tu sitio en tiempo real.</p><p style="margin:0 0 8px;line-height:1.6;color:#222"><strong>URL portal:</strong> <a href="${portalUrl}" style="color:#ff5353;text-decoration:none">${portalUrl}</a></p><p style="margin:0 0 8px;line-height:1.6;color:#222"><strong>Usuario:</strong> ${email}</p><p style="margin:0 0 16px;line-height:1.6;color:#222"><strong>Clave temporal:</strong> ${temporaryPassword}</p><p style="margin:0 0 10px;line-height:1.6;color:#222">Tambien puedes usar <strong>Continuar con Google</strong> si ese correo está habilitado en el portal.</p><p style="margin:0 0 18px;line-height:1.6;color:#222">Si usas clave temporal, te recomendamos cambiarla en tu primer ingreso.</p><p style="margin:0;padding-top:12px;border-top:1px solid #ececec;color:#666;font-size:13px">Equipo MUGA · muga.dev</p></td></tr></table></div>`,
    })
    return true
  } catch {
    return false
  }
}

export async function approveLeadAndProvisionAccess({
  leadId,
  approvedByUserId,
}: {
  leadId: number
  approvedByUserId: string
}): Promise<ApproveLeadResult | null> {
  const supabase = createSupabaseAdminClient()

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id, name, email, project, message, status')
    .eq('id', leadId)
    .single()

  if (leadError || !lead || !lead.email) {
    console.error('approveLeadAndProvisionAccess: lead lookup failed', { leadId, leadError })
    return null
  }

  if (isInternalEmail(lead.email)) {
    console.error('approveLeadAndProvisionAccess: internal email blocked', { leadId, email: lead.email })
    return null
  }

  const fullName = lead.name || 'Cliente'
  const temporaryPassword = generateTemporaryPassword()

  const { data: usersPage, error: usersError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  })

  if (usersError) {
    console.error('approveLeadAndProvisionAccess: list users failed', usersError)
    return null
  }

  let authUser = usersPage.users.find((user) => (user.email || '').toLowerCase() === lead.email.toLowerCase())

  if (!authUser) {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email: lead.email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (createError || !created.user) {
      console.error('approveLeadAndProvisionAccess: create auth user failed', createError)
      return null
    }

    authUser = created.user
  } else {
    await supabase.auth.admin.updateUserById(authUser.id, {
      password: temporaryPassword,
      user_metadata: {
        ...(authUser.user_metadata || {}),
        full_name: fullName,
      },
    })
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      id: authUser.id,
      email: lead.email,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  )

  if (profileError) {
    console.error('approveLeadAndProvisionAccess: upsert profile failed', profileError)
    return null
  }

  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .or(`auth_user_id.eq.${authUser.id},email.eq.${lead.email}`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let clientId = existingClient?.id

  if (!clientId) {
    const { data: insertedClient, error: insertClientError } = await supabase
      .from('clients')
      .insert({
        owner_user_id: approvedByUserId,
        auth_user_id: authUser.id,
        name: fullName,
        company_name: fullName,
        email: lead.email,
        notes: lead.message || null,
        portal_status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (insertClientError || !insertedClient) {
      console.error('approveLeadAndProvisionAccess: insert client failed', insertClientError)
      return null
    }

    clientId = insertedClient.id
  } else {
    const { error: updateClientError } = await supabase
      .from('clients')
      .update({
        owner_user_id: approvedByUserId,
        auth_user_id: authUser.id,
        name: fullName,
        company_name: fullName,
        email: lead.email,
        portal_status: 'accepted',
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', clientId)

    if (updateClientError) {
      console.error('approveLeadAndProvisionAccess: update client failed', updateClientError)
      return null
    }
  }

  const { data: existingProject } = await supabase
    .from('projects')
    .select('id')
    .eq('client_id', clientId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  let projectId = existingProject?.id

  if (!projectId) {
    const { data: insertedProject, error: insertProjectError } = await supabase
      .from('projects')
      .insert({
        owner_user_id: approvedByUserId,
        client_id: clientId,
        name: inferProjectName(lead.project, fullName),
        description: lead.message || 'Proyecto habilitado desde flujo comercial.',
        status: 'active',
        current_stage: 'brief',
      })
      .select('id')
      .single()

    if (insertProjectError || !insertedProject) {
      console.error('approveLeadAndProvisionAccess: insert project failed', insertProjectError)
      return null
    }

    projectId = insertedProject.id

    await supabase.from('project_stages').insert([
      { project_id: projectId, stage_key: 'brief', position: 1 },
      { project_id: projectId, stage_key: 'diseno', position: 2 },
      { project_id: projectId, stage_key: 'desarrollo', position: 3 },
      { project_id: projectId, stage_key: 'qa', position: 4 },
      { project_id: projectId, stage_key: 'publicado', position: 5 },
    ])

    await supabase.from('deliverables').insert({
      project_id: projectId,
      stage_key: 'brief',
      title: 'Brief inicial',
      description: 'Recolección de objetivos y activos iniciales del cliente.',
      status: 'pendiente',
      created_by: approvedByUserId,
      due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  await supabase
    .from('leads')
    .update({
      status: 'approved',
      lead_stage: 'qualified',
      lead_tier: lead.project === 'corporativo' ? 'business' : 'start',
      first_contact_at: new Date().toISOString(),
      last_contact_at: new Date().toISOString(),
    })
    .eq('id', lead.id)

  await sendPortalAccessEmail({
    email: lead.email,
    fullName,
    temporaryPassword,
  })

  return {
    clientId,
    projectId,
    email: lead.email,
    temporaryPassword,
  }
}
