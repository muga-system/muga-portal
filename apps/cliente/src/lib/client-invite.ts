import crypto from 'node:crypto'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'

const INVITE_TOKEN_BYTES = 32
const INVITE_SLUG_SUFFIX_BYTES = 3
const DEFAULT_INVITE_TTL_HOURS = 72

type InviteValidationStatus = 'ok' | 'invalid' | 'expired' | 'used'

interface ConsumeInviteResult {
  status: InviteValidationStatus
  email?: string | null
}

interface InspectInviteResult {
  status: InviteValidationStatus
  email?: string | null
}

interface CreateClientInviteInput {
  clientId: string
  projectId: string | null
  fullName: string
  createdByUserId: string
}

interface CreateClientInviteResult {
  inviteUrl: string
  slug: string
  expiresAt: string
  accessCode: string
}

function getInviteTokenSecret() {
  const secret = process.env.INVITE_TOKEN_SECRET

  if (!secret) {
    throw new Error('Missing INVITE_TOKEN_SECRET')
  }

  return secret
}

function getInviteTtlHours() {
  const raw = Number(process.env.INVITE_TOKEN_TTL_HOURS ?? DEFAULT_INVITE_TTL_HOURS)

  if (!Number.isFinite(raw) || raw <= 0) {
    return DEFAULT_INVITE_TTL_HOURS
  }

  return raw
}

function getClientPortalBaseUrl() {
  const baseUrl = process.env.CLIENT_PORTAL_BASE_URL || process.env.CLIENT_PORTAL_URL

  if (!baseUrl) {
    throw new Error('Missing CLIENT_PORTAL_BASE_URL or CLIENT_PORTAL_URL')
  }

  const normalized = baseUrl.replace(/\/$/, '')
  if (normalized.endsWith('/login')) {
    return normalized.slice(0, -'/login'.length)
  }

  return normalized
}

function normalizeSlugPart(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/[\s-]+/g, '-')
}

function buildClientSlug(fullName: string) {
  const normalizedName = normalizeSlugPart(fullName)
  const base = normalizedName || 'cliente'
  return `${base}-${crypto.randomBytes(INVITE_SLUG_SUFFIX_BYTES).toString('hex')}`
}

function generateInviteToken() {
  return crypto.randomBytes(INVITE_TOKEN_BYTES).toString('hex')
}

function generateAccessCode() {
  const value = crypto.randomInt(0, 1_000_000)
  return String(value).padStart(6, '0')
}

function hashInviteToken(token: string) {
  return crypto.createHmac('sha256', getInviteTokenSecret()).update(token).digest('hex')
}

function buildInviteUrl(slug: string, token: string) {
  return `${getClientPortalBaseUrl()}/acceso/${slug}?inv=${encodeURIComponent(token)}`
}

export async function createClientPortalInvite({
  clientId,
  projectId,
  fullName,
  createdByUserId,
}: CreateClientInviteInput): Promise<CreateClientInviteResult | null> {
  try {
    const supabase = createSupabaseAdminClient()

    const nowIso = new Date().toISOString()
    await supabase.from('client_portal_invites').update({ used_at: nowIso }).eq('client_id', clientId).is('used_at', null)

    const ttlHours = getInviteTtlHours()
    const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString()

    const token = generateInviteToken()
    const tokenHash = hashInviteToken(token)
    const accessCode = generateAccessCode()
    const accessCodeHash = hashInviteToken(`code:${accessCode}`)

    for (let attempt = 0; attempt < 6; attempt += 1) {
      const slug = buildClientSlug(fullName)
      const { data, error } = await supabase
        .from('client_portal_invites')
        .insert({
          client_id: clientId,
          project_id: projectId,
          slug,
          token_hash: tokenHash,
          access_code_hash: accessCodeHash,
          token_expires_at: expiresAt,
          created_by_user_id: createdByUserId,
        })
        .select('slug')
        .single()

      if (error) {
        const isSlugConflict = error.code === '23505' && error.message.includes('client_portal_invites_slug_key')
        if (isSlugConflict) {
          continue
        }

        return null
      }

      return {
        inviteUrl: buildInviteUrl(data.slug, token),
        slug: data.slug,
        expiresAt,
        accessCode,
      }
    }

    return null
  } catch {
    return null
  }
}

export async function resolveClientPortalInviteByCode(code: string): Promise<{ id: string; email: string } | null> {
  try {
    const normalized = code.trim()
    if (!/^\d{6}$/.test(normalized)) {
      return null
    }

    const supabase = createSupabaseAdminClient()
    const accessCodeHash = hashInviteToken(`code:${normalized}`)

    const { data: invite, error } = await supabase
      .from('client_portal_invites')
      .select('id, client_id, used_at, token_expires_at')
      .eq('access_code_hash', accessCodeHash)
      .maybeSingle()

    if (error || !invite) {
      return null
    }

    if (invite.used_at) {
      return null
    }

    if (new Date(invite.token_expires_at).getTime() <= Date.now()) {
      return null
    }

    const { data: client } = await supabase
      .from('clients')
      .select('email')
      .eq('id', invite.client_id)
      .maybeSingle()

    if (!client?.email) {
      return null
    }

    return {
      id: invite.id,
      email: client.email,
    }
  } catch {
    return null
  }
}

export async function consumeClientPortalInviteById(inviteId: string) {
  try {
    const supabase = createSupabaseAdminClient()
    const { data: consumed, error } = await supabase
      .from('client_portal_invites')
      .update({ used_at: new Date().toISOString() })
      .eq('id', inviteId)
      .is('used_at', null)
      .select('id')
      .maybeSingle()

    if (error || !consumed) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function consumeClientPortalInvite({ slug, token }: { slug: string; token: string }): Promise<ConsumeInviteResult> {
  try {
    const supabase = createSupabaseAdminClient()
    const tokenHash = hashInviteToken(token)

    const { data: invite, error } = await supabase
      .from('client_portal_invites')
      .select('id, client_id, used_at, token_expires_at')
      .eq('slug', slug)
      .eq('token_hash', tokenHash)
      .maybeSingle()

    if (error || !invite) {
      return { status: 'invalid' }
    }

    if (invite.used_at) {
      return { status: 'used' }
    }

    if (new Date(invite.token_expires_at).getTime() <= Date.now()) {
      return { status: 'expired' }
    }

    const { data: consumed, error: consumeError } = await supabase
      .from('client_portal_invites')
      .update({ used_at: new Date().toISOString() })
      .eq('id', invite.id)
      .is('used_at', null)
      .select('id')
      .maybeSingle()

    if (consumeError || !consumed) {
      return { status: 'used' }
    }

    const { data: client } = await supabase
      .from('clients')
      .select('email')
      .eq('id', invite.client_id)
      .maybeSingle()

    return {
      status: 'ok',
      email: client?.email ?? null,
    }
  } catch {
    return { status: 'invalid' }
  }
}

export async function inspectClientPortalInvite({ slug, token }: { slug: string; token: string }): Promise<InspectInviteResult> {
  try {
    const supabase = createSupabaseAdminClient()
    const tokenHash = hashInviteToken(token)

    const { data: invite, error } = await supabase
      .from('client_portal_invites')
      .select('client_id, used_at, token_expires_at')
      .eq('slug', slug)
      .eq('token_hash', tokenHash)
      .maybeSingle()

    if (error || !invite) {
      return { status: 'invalid' }
    }

    if (invite.used_at) {
      return { status: 'used' }
    }

    if (new Date(invite.token_expires_at).getTime() <= Date.now()) {
      return { status: 'expired' }
    }

    const { data: client } = await supabase
      .from('clients')
      .select('email')
      .eq('id', invite.client_id)
      .maybeSingle()

    return {
      status: 'ok',
      email: client?.email ?? null,
    }
  } catch {
    return { status: 'invalid' }
  }
}
