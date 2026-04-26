import nodemailer from 'nodemailer'
import { isInternalEmail } from '@/lib/internal-access'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import { createClientPortalInvite } from '@/lib/client-invite'

interface ApproveLeadResult {
  clientId: string
  projectId: string
  email: string
  inviteUrl?: string
  accessCode?: string
}

interface OnboardingError {
  step: string
  error: string
  recoverable: boolean
}

type ApproveLeadOutcome = 
  | { success: true; data: ApproveLeadResult }
  | { success: false; error: OnboardingError }

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

interface SendInviteEmailParams {
  email: string
  fullName: string
  inviteUrl: string
  accessCode: string
  expiresAt: string
}

async function sendInviteEmail({
  email,
  fullName,
  inviteUrl,
  accessCode,
  expiresAt,
}: SendInviteEmailParams): Promise<SendEmailResult> {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || '')
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const from = process.env.ALERT_FROM_EMAIL || 'Notificaciones MUGA <notificaciones@muga.dev>'
  const portalUrl = (process.env.CLIENT_PORTAL_URL || 'http://localhost:3001/acceso').replace(/\/login$/, '/acceso')

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error('[Onboarding] SMTP not configured, skipping invite email')
    return { success: false, error: 'SMTP not configured' }
  }

  const { firstName } = splitName(fullName)
  const expiresDate = new Date(expiresAt)
  const expiresStr = expiresDate.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

  for (let attempt = 1; attempt <= 3; attempt++) {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: smtpPort !== 465,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: { minVersion: 'TLSv1.2' },
    })

    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: 'Invitacion a tu portal de cliente MUGA',
        text: [
          `Hola ${firstName},`,
          '',
          'Has sido invitado al portal de cliente de MUGA.',
          '',
          'Para acceder, haz clic en el siguiente enlace:',
          inviteUrl,
          '',
          `O ingresa el codigo: ${accessCode}`,
          '',
          `Esta invitacion expira el ${expiresStr}.`,
          '',
          'Equipo MUGA',
        ].join('\n'),
        html: `<div style="font-family:Arial,sans-serif;background:#fff;color:#111;padding:24px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto"><tr><td style="border:1px solid #e8e8e8;padding:28px 24px;background:#fff"><p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;color:#ff5353;text-transform:uppercase">MUGA · Portal cliente</p><h2 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#111">Has sido invitado</h2><p style="margin:0 0 14px;line-height:1.7;color:#222">Hola ${firstName}, ya puedes acceder al portal para seguir el avance de tu proyecto.</p><p style="margin:0 0 16px;line-height:1.6;color:#222"><strong>Enlace de acceso:</strong><br><a href="${inviteUrl}" style="color:#ff5353;text-decoration:none">${inviteUrl}</a></p><p style="margin:0 0 8px;line-height:1.6;color:#222"><strong> Codigo de acceso:</strong> ${accessCode}</p><p style="margin:0 0 16px;line-height:1.6;color:#666;font-size:13px">Esta invitacion expira el ${expiresStr}.</p><p style="margin:0;padding-top:12px;border-top:1px solid #ececec;color:#666;font-size:13px">Equipo MUGA · muga.dev</p></td></tr></table></div>`,
      })
      console.log(`[Onboarding] Invite email sent successfully to ${email}`)
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      console.error(`[Onboarding] Invite email failed (attempt ${attempt}):`, error.message)
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
      }
    }
  }

  return { success: false, error: 'Failed to send invite email after retries' }
}

interface SendEmailResult {
  success: boolean
  error?: string
}

async function sendPortalAccessEmailWithRetry({
  email,
  fullName,
  temporaryPassword,
  maxRetries = 3,
}: {
  email: string
  fullName: string
  temporaryPassword: string
  maxRetries?: number
}): Promise<SendEmailResult> {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = Number(process.env.SMTP_PORT || '')
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const from = process.env.ALERT_FROM_EMAIL || 'Notificaciones MUGA <notificaciones@muga.dev>'
  const portalUrl = (process.env.CLIENT_PORTAL_URL || 'http://localhost:3001/acceso').replace(/\/login$/, '/acceso')

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.error('[Onboarding] SMTP not configured, skipping email send')
    return { success: false, error: 'SMTP not configured' }
  }

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
          'También puedes usar el botón "Continuar con Google" si ese correo está habilitado en el portal.',
          'Si usas clave temporal, te recomendamos cambiarla en tu primer ingreso.',
          '',
          'Equipo MUGA',
        ].join('\n'),
        html: `<div style="font-family:Arial,sans-serif;background:#fff;color:#111;padding:24px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto"><tr><td style="border:1px solid #e8e8e8;padding:28px 24px;background:#fff"><p style="margin:0 0 8px;font-size:12px;letter-spacing:1px;color:#ff5353;text-transform:uppercase">MUGA · Portal cliente</p><h2 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:#111">Tu acceso ya está habilitado</h2><p style="margin:0 0 14px;line-height:1.7;color:#222">Hola ${firstName}, ya puedes ingresar al portal para seguir el avance de tu sitio en tiempo real.</p><p style="margin:0 0 8px;line-height:1.6;color:#222"><strong>URL portal:</strong> <a href="${portalUrl}" style="color:#ff5353;text-decoration:none">${portalUrl}</a></p><p style="margin:0 0 8px;line-height:1.6;color:#222"><strong>Usuario:</strong> ${email}</p><p style="margin:0 0 16px;line-height:1.6;color:#222"><strong>Clave temporal:</strong> ${temporaryPassword}</p><p style="margin:0 0 10px;line-height:1.6;color:#222">También puedes usar <strong>Continuar con Google</strong> si ese correo está habilitado en el portal.</p><p style="margin:0 0 18px;line-height:1.6;color:#222">Si usas clave temporal, te recomendamos cambiarla en tu primer ingreso.</p><p style="margin:0;padding-top:12px;border-top:1px solid #ececec;color:#666;font-size:13px">Equipo MUGA · muga.dev</p></td></tr></table></div>`,
      })
      
      console.log(`[Onboarding] Email sent successfully to ${email} (attempt ${attempt})`)
      return { success: true }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.error(`[Onboarding] Email send failed (attempt ${attempt}/${maxRetries}):`, lastError.message)
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000
        console.log(`[Onboarding] Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  return { 
    success: false, 
    error: lastError?.message || 'Failed to send email after all retries' 
  }
}

async function logOnboardingAlert({
  leadId,
  leadEmail,
  clientId,
  projectId,
  emailSendResult,
}: {
  leadId: number
  leadEmail: string
  clientId: string
  projectId: string
  emailSendResult: SendEmailResult
}) {
  const supabase = createSupabaseAdminClient()
  
  const alertMessage = emailSendResult.success
    ? `Lead ${leadId} approved successfully. Client ${clientId}, Project ${projectId} created.`
    : `CRITICAL: Lead ${leadId} approved but EMAIL FAILED. Client ${clientId}, Project ${projectId} created. Email error: ${emailSendResult.error}`

  const { error: logError } = await supabase.from('activity_log').insert({
    event_type: 'onboarding_alert',
    description: alertMessage,
    metadata: {
      lead_id: leadId,
      lead_email: leadEmail,
      client_id: clientId,
      project_id: projectId,
      email_success: emailSendResult.success,
      email_error: emailSendResult.error,
    },
  })

  if (logError) {
    console.error('[Onboarding] Failed to log alert:', logError)
  }
}

export async function approveLeadAndProvisionAccess({
  leadId,
  approvedByUserId,
}: {
  leadId: number
  approvedByUserId: string
}): Promise<ApproveLeadOutcome> {
  const supabase = createSupabaseAdminClient()
  const startTime = Date.now()

  console.log(`[Onboarding] Starting approval for lead ${leadId} by user ${approvedByUserId}`)

  try {
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, name, email, project, message, status')
      .eq('id', leadId)
      .single()

    if (leadError || !lead || !lead.email) {
      console.error('[Onboarding] Step 1 failed: lead lookup', { leadId, leadError })
      return { 
        success: false, 
        error: { step: 'lead_lookup', error: 'Lead not found or has no email', recoverable: false } 
      }
    }

    if (isInternalEmail(lead.email)) {
      console.error('[Onboarding] Step 1b failed: internal email blocked', { leadId, email: lead.email })
      return { 
        success: false, 
        error: { step: 'internal_email_check', error: 'Internal emails cannot be onboarded', recoverable: false } 
      }
    }

    const fullName = lead.name || 'Cliente'
    const temporaryPassword = generateTemporaryPassword()

    const { data: usersPage, error: usersError } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    })

    if (usersError) {
      console.error('[Onboarding] Step 2 failed: list users', usersError)
      return { 
        success: false, 
        error: { step: 'list_users', error: usersError.message, recoverable: true } 
      }
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
        console.error('[Onboarding] Step 3 failed: create auth user', createError)
        return { 
          success: false, 
          error: { step: 'create_auth_user', error: createError?.message || 'Failed to create user', recoverable: true } 
        }
      }

      authUser = created.user
      console.log(`[Onboarding] Created new auth user: ${authUser.id}`)
    } else {
      await supabase.auth.admin.updateUserById(authUser.id, {
        password: temporaryPassword,
        user_metadata: {
          ...(authUser.user_metadata || {}),
          full_name: fullName,
        },
      })
      console.log(`[Onboarding] Updated existing auth user: ${authUser.id}`)
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
      console.error('[Onboarding] Step 4 failed: upsert profile', profileError)
      return { 
        success: false, 
        error: { step: 'upsert_profile', error: profileError.message, recoverable: true } 
      }
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
          portal_status: 'invited',
          accepted_at: null,
        })
        .select('id')
        .single()

      if (insertClientError || !insertedClient) {
        console.error('[Onboarding] Step 5 failed: insert client', insertClientError)
        return { 
          success: false, 
          error: { step: 'insert_client', error: insertClientError?.message || 'Failed to create client', recoverable: true } 
        }
      }

      clientId = insertedClient.id
      console.log(`[Onboarding] Created new client: ${clientId}`)
    } else {
      const { error: updateClientError } = await supabase
        .from('clients')
        .update({
          owner_user_id: approvedByUserId,
          auth_user_id: authUser.id,
          name: fullName,
          company_name: fullName,
          email: lead.email,
          portal_status: 'invited',
          accepted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', clientId)

      if (updateClientError) {
        console.error('[Onboarding] Step 5b failed: update client', updateClientError)
        return { 
          success: false, 
          error: { step: 'update_client', error: updateClientError.message, recoverable: true } 
        }
      }
      console.log(`[Onboarding] Updated existing client: ${clientId}`)
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
        console.error('[Onboarding] Step 6 failed: insert project', insertProjectError)
        return { 
          success: false, 
          error: { step: 'insert_project', error: insertProjectError?.message || 'Failed to create project', recoverable: true } 
        }
      }

      projectId = insertedProject.id
      console.log(`[Onboarding] Created new project: ${projectId}`)

      const { error: stagesError } = await supabase.from('project_stages').insert([
        { project_id: projectId, stage_key: 'brief', position: 1 },
        { project_id: projectId, stage_key: 'diseno', position: 2 },
        { project_id: projectId, stage_key: 'desarrollo', position: 3 },
        { project_id: projectId, stage_key: 'qa', position: 4 },
        { project_id: projectId, stage_key: 'publicado', position: 5 },
      ])

      if (stagesError) {
        console.error('[Onboarding] Step 6b failed: insert stages', stagesError)
        return { 
          success: false, 
          error: { step: 'insert_stages', error: stagesError.message, recoverable: true } 
        }
      }

      const { error: deliverableError } = await supabase.from('deliverables').insert({
        project_id: projectId,
        stage_key: 'brief',
        title: 'Brief inicial',
        description: 'Recolección de objetivos y activos iniciales del cliente.',
        status: 'pendiente',
        created_by: approvedByUserId,
        due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      })

      if (deliverableError) {
        console.error('[Onboarding] Step 6c failed: insert deliverable', deliverableError)
        return { 
          success: false, 
          error: { step: 'insert_deliverable', error: deliverableError.message, recoverable: true } 
        }
      }
    }

    const { error: updateLeadError } = await supabase
      .from('leads')
      .update({
        status: 'approved',
        lead_stage: 'qualified',
        lead_tier: lead.project === 'corporativo' ? 'business' : 'start',
        first_contact_at: new Date().toISOString(),
        last_contact_at: new Date().toISOString(),
      })
      .eq('id', lead.id)

    if (updateLeadError) {
      console.error('[Onboarding] Step 7 failed: update lead', updateLeadError)
      return { 
        success: false, 
        error: { step: 'update_lead', error: updateLeadError.message, recoverable: true } 
      }
    }

    console.log(`[Onboarding] Creating invite for client ${clientId}...`)
    const inviteResult = await createClientPortalInvite({
      clientId,
      projectId,
      fullName,
      createdByUserId: approvedByUserId,
    })

    if (!inviteResult) {
      console.error('[Onboarding] Step 8 failed: create invite')
      return { 
        success: false, 
        error: { step: 'create_invite', error: 'Failed to create invitation', recoverable: true } 
      }
    }

    console.log(`[Onboarding] Sending invite email to ${lead.email}...`)
    const emailResult = await sendInviteEmail({
      email: lead.email,
      fullName,
      inviteUrl: inviteResult.inviteUrl,
      accessCode: inviteResult.accessCode,
      expiresAt: inviteResult.expiresAt,
    })

    console.log(`[Onboarding] Invite email send result:`, emailResult)

    await logOnboardingAlert({
      leadId,
      leadEmail: lead.email,
      clientId,
      projectId,
      emailSendResult: emailResult,
    })

    const duration = Date.now() - startTime
    console.log(`[Onboarding] Completed successfully in ${duration}ms`, { clientId, projectId })

    return {
      success: true,
      data: {
        clientId,
        projectId,
        email: lead.email,
        inviteUrl: inviteResult.inviteUrl,
        accessCode: inviteResult.accessCode,
      },
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('[Onboarding] Unexpected error:', error)
    
    return { 
      success: false, 
      error: { 
        step: 'unknown', 
        error: error.message, 
        recoverable: false 
      } 
    }
  }
}