import { DELIVERABLE_STATUS_KEYS, PROJECT_STAGE_KEYS } from '@/lib/portal-constants'
import {
  getPortalActivityByProject,
  getPortalClientById,
  getPortalCommentsByProject,
  getPortalDeliverablesByProject,
  getPortalFilesByProject,
  getPortalProjectById,
  getPortalStagesByProject,
  portalMockProjects,
} from '@/lib/portal-mock'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { createSupabaseAdminClient } from '@/lib/supabase-admin'
import type {
  DeliverableStatus,
  PortalActivity,
  PortalClient,
  PortalComment,
  PortalDeliverable,
  PortalFile,
  PortalProject,
  PortalProjectStage,
  ProjectStageKey,
} from '@/types/portal'

export interface InternalProjectListItem {
  project: PortalProject
  client: PortalClient | null
}

export interface InternalProjectDetail {
  project: PortalProject
  client: PortalClient | null
  stages: PortalProjectStage[]
  deliverables: PortalDeliverable[]
  activity: PortalActivity[]
  comments: PortalComment[]
  files: PortalFile[]
}

export interface AdminMetricsSummary {
  totalClients: number
  totalProjects: number
  activeProjects: number
  publishedProjects: number
  totalSites: number
  totalLeads: number
  recentLeads: number
}

export interface AdminAnalyticsSummary {
  views: number
  sessions: number
  bounceRate: number
  ctaClicks: number
  formStarts: number
  formSubmits: number
  ctr: number
  leadConversion: number
  dailyViews: Array<{ day: string; total: number }>
  activityByHour: Array<{ hour: number; total: number }>
  topReferrers: Array<{ referrer: string; count: number }>
  topCountries: Array<{ country: string; count: number }>
  topProvinces: Array<{ province: string; count: number }>
  topPages: Array<{ pagePath: string; views: number }>
  topZones: Array<{ zoneId: string; clicks: number }>
}

export interface ClientPortalSnapshot {
  client: PortalClient
  detail: InternalProjectDetail
}

export interface AdminLeadIntake {
  id: number
  name: string
  email: string
  phone: string | null
  project: string | null
  budget: string | null
  message: string
  status: string | null
  createdAt: string
  source?: string | null
  utmSource?: string | null
  utmCampaign?: string | null
  firstContactAt?: string | null
  lastContactAt?: string | null
  nextAction?: string | null
  nextActionAt?: string | null
}

export interface AdminLeadFilters {
  days: number
  status: string
  source: string
  utmSource: string
  utmCampaign: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface PaginatedLeadsResult {
  leads: AdminLeadIntake[]
  pagination: PaginationMeta
}

export interface AdminClientRow {
  id: string
  name: string
  company: string
  email: string
  portalStatus: string
  acceptedAt: string | null
  createdAt: string
}

const ARGENTINA_PROVINCE_BY_CODE: Record<string, string> = {
  A: 'Salta',
  B: 'Buenos Aires',
  C: 'CABA',
  D: 'San Luis',
  E: 'Entre Rios',
  F: 'La Rioja',
  G: 'Santiago del Estero',
  H: 'Chaco',
  J: 'San Juan',
  K: 'Catamarca',
  L: 'La Pampa',
  M: 'Mendoza',
  N: 'Misiones',
  P: 'Formosa',
  Q: 'Neuquen',
  R: 'Rio Negro',
  S: 'Santa Fe',
  T: 'Tucuman',
  U: 'Chubut',
  V: 'Tierra del Fuego',
  W: 'Corrientes',
  X: 'Cordoba',
  Y: 'Jujuy',
  Z: 'Santa Cruz',
}

const ARGENTINA_PROVINCE_ALIASES: Record<string, string> = {
  'buenos aires': 'Buenos Aires',
  caba: 'CABA',
  'ciudad autonoma de buenos aires': 'CABA',
  'capital federal': 'CABA',
  catamarca: 'Catamarca',
  chaco: 'Chaco',
  chubut: 'Chubut',
  cordoba: 'Cordoba',
  corrientes: 'Corrientes',
  'entre rios': 'Entre Rios',
  formosa: 'Formosa',
  jujuy: 'Jujuy',
  'la pampa': 'La Pampa',
  'la rioja': 'La Rioja',
  mendoza: 'Mendoza',
  misiones: 'Misiones',
  neuquen: 'Neuquen',
  'rio negro': 'Rio Negro',
  salta: 'Salta',
  'san juan': 'San Juan',
  'san luis': 'San Luis',
  'santa cruz': 'Santa Cruz',
  'santa fe': 'Santa Fe',
  'santiago del estero': 'Santiago del Estero',
  'tierra del fuego': 'Tierra del Fuego',
  tucuman: 'Tucuman',
}

function normalizeRegionKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function normalizeArgentinaProvince(rawValue: string) {
  const raw = rawValue.trim()
  if (!raw) return ''

  const upper = raw.toUpperCase()
  if (upper.length === 1 && ARGENTINA_PROVINCE_BY_CODE[upper]) {
    return ARGENTINA_PROVINCE_BY_CODE[upper]
  }

  const key = normalizeRegionKey(raw)
  return ARGENTINA_PROVINCE_ALIASES[key] || raw
}

function normalizeCountryCode(rawValue: unknown): string {
  const value = String(rawValue || '').trim().toUpperCase()
  if (!value) return ''
  if (/^[A-Z]{2}$/.test(value)) return value
  if (value === 'ARGENTINA' || value === 'ARG') return 'AR'
  if (value === 'BRAZIL' || value === 'BRASIL' || value === 'BRA') return 'BR'
  if (value === 'URUGUAY' || value === 'URY') return 'UY'
  if (value === 'CHILE' || value === 'CHL') return 'CL'
  if (value === 'PARAGUAY' || value === 'PRY') return 'PY'
  if (value === 'BOLIVIA' || value === 'BOL') return 'BO'
  return ''
}

function inferCountryCodeFromLeadRecord(lead: Record<string, unknown>) {
  const direct = normalizeCountryCode(lead.country || lead.country_code)
  if (direct) return direct

  const locale = String(lead.locale || '').toUpperCase()
  const timezone = String(lead.timezone || '').toLowerCase()
  const province = normalizeArgentinaProvince(String(lead.province || lead.region || ''))

  if (locale.endsWith('-AR') || locale.includes('_AR') || timezone.includes('argentina') || Boolean(province)) {
    return 'AR'
  }

  return ''
}

function toProjectStageKey(value: string | null | undefined): ProjectStageKey {
  if (value && PROJECT_STAGE_KEYS.includes(value as ProjectStageKey)) {
    return value as ProjectStageKey
  }

  return 'brief'
}

function toDeliverableStatus(value: string | null | undefined): DeliverableStatus {
  if (value && DELIVERABLE_STATUS_KEYS.includes(value as DeliverableStatus)) {
    return value as DeliverableStatus
  }

  return 'pendiente'
}

function toCommentAuthor(value: string | null | undefined): 'muga' | 'cliente' {
  if (value === 'muga' || value === 'cliente') {
    return value
  }

  return 'muga'
}

function toFileKind(value: string | null | undefined): 'brief' | 'asset' | 'entregable' {
  if (value === 'brief' || value === 'asset' || value === 'entregable') {
    return value
  }

  return 'asset'
}

function fallbackProjectList(): InternalProjectListItem[] {
  return portalMockProjects.map((project) => ({
    project,
    client: getPortalClientById(project.clientId),
  }))
}

function fallbackProjectDetail(projectId: string): InternalProjectDetail | null {
  const project = getPortalProjectById(projectId)

  if (!project) {
    return null
  }

  return {
    project,
    client: getPortalClientById(project.clientId),
    stages: getPortalStagesByProject(project.id),
    deliverables: getPortalDeliverablesByProject(project.id),
    activity: getPortalActivityByProject(project.id),
    comments: getPortalCommentsByProject(project.id),
    files: getPortalFilesByProject(project.id),
  }
}

export async function getInternalProjectList(): Promise<InternalProjectListItem[]> {
  try {
    const supabase = await createSupabaseServerClient()

    const [{ data: projects, error: projectsError }, { data: clients, error: clientsError }] =
      await Promise.all([
        supabase
          .from('projects')
          .select('id, client_id, name, description, current_stage, created_at, updated_at')
          .order('updated_at', { ascending: false }),
        supabase.from('clients').select('id, auth_user_id, name, company_name, email, portal_status, accepted_at, created_at'),
      ])

    if (projectsError || clientsError || !projects || !clients) {
      return fallbackProjectList()
    }

    const clientsById = new Map(
      clients.map((client) => [
        client.id,
        {
          id: client.id,
          authUserId: client.auth_user_id,
          name: client.name || client.company_name || 'Cliente',
          company: client.company_name || client.name || 'Sin empresa',
          email: client.email || '',
          portalStatus: client.portal_status || 'invited',
          acceptedAt: client.accepted_at,
          createdAt: client.created_at || new Date().toISOString(),
        } satisfies PortalClient,
      ])
    )

    return projects.map((project) => ({
      project: {
        id: project.id,
        clientId: project.client_id,
        name: project.name,
        description: project.description || '',
        stage: toProjectStageKey(project.current_stage),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      },
      client: clientsById.get(project.client_id) ?? null,
    }))
  } catch {
    return fallbackProjectList()
  }
}

export async function getAdminProjectList(): Promise<InternalProjectListItem[]> {
  try {
    const supabase = createSupabaseAdminClient()

    const [{ data: projects, error: projectsError }, { data: clients, error: clientsError }] =
      await Promise.all([
        supabase
          .from('projects')
          .select('id, client_id, name, description, current_stage, created_at, updated_at')
          .order('updated_at', { ascending: false }),
        supabase
          .from('clients')
          .select('id, auth_user_id, name, company_name, email, portal_status, accepted_at, created_at'),
      ])

    if (projectsError || clientsError || !projects || !clients) {
      return fallbackProjectList()
    }

    const clientsById = new Map(
      clients.map((client) => [
        client.id,
        {
          id: client.id,
          authUserId: client.auth_user_id,
          name: client.name || client.company_name || 'Cliente',
          company: client.company_name || client.name || 'Sin empresa',
          email: client.email || '',
          portalStatus: client.portal_status || 'invited',
          acceptedAt: client.accepted_at,
          createdAt: client.created_at || new Date().toISOString(),
        } satisfies PortalClient,
      ])
    )

    return projects.map((project) => ({
      project: {
        id: project.id,
        clientId: project.client_id,
        name: project.name,
        description: project.description || '',
        stage: toProjectStageKey(project.current_stage),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      },
      client: clientsById.get(project.client_id) ?? null,
    }))
  } catch {
    return fallbackProjectList()
  }
}

export async function getInternalProjectDetail(projectId: string): Promise<InternalProjectDetail | null> {
  try {
    const supabase = await createSupabaseServerClient()

    const {
      data: project,
      error: projectError,
    } = await supabase
      .from('projects')
      .select('id, client_id, name, description, current_stage, created_at, updated_at')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return fallbackProjectDetail(projectId)
    }

    const [
      clientResponse,
      stagesResponse,
      deliverablesResponse,
      activityResponse,
      commentsResponse,
      filesResponse,
    ] = await Promise.all([
      supabase
        .from('clients')
        .select('id, auth_user_id, name, company_name, email, portal_status, accepted_at, created_at')
        .eq('id', project.client_id)
        .maybeSingle(),
      supabase
        .from('project_stages')
        .select('id, project_id, stage_key, position, completed_at')
        .eq('project_id', projectId)
        .order('position', { ascending: true }),
      supabase
        .from('deliverables')
        .select('id, project_id, stage_key, title, description, status, due_date, updated_at')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true }),
      supabase
        .from('project_activity')
        .select('id, project_id, event_type, title, description, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('project_comments')
        .select('id, project_id, deliverable_id, author_role, content, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('project_files')
        .select('id, project_id, stage_key, file_kind, file_name, file_path, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
    ])

    const stages: PortalProjectStage[] = (stagesResponse.data || []).map((stage) => ({
      id: stage.id,
      projectId: stage.project_id,
      key: toProjectStageKey(stage.stage_key),
      position: stage.position,
      completedAt: stage.completed_at,
    }))

    const deliverables: PortalDeliverable[] = (deliverablesResponse.data || []).map((deliverable) => ({
      id: deliverable.id,
      projectId: deliverable.project_id,
      stage: toProjectStageKey(deliverable.stage_key),
      title: deliverable.title,
      description: deliverable.description || '',
      status: toDeliverableStatus(deliverable.status),
      dueDate: deliverable.due_date || new Date().toISOString(),
      updatedAt: deliverable.updated_at || new Date().toISOString(),
    }))

    const activity: PortalActivity[] = (activityResponse.data || []).map((event) => ({
      id: event.id,
      projectId: event.project_id,
      eventType: event.event_type,
      title: event.title,
      description: event.description || '',
      createdAt: event.created_at,
    }))

    const comments: PortalComment[] = (commentsResponse.data || []).map((comment) => ({
      id: comment.id,
      projectId: comment.project_id,
      deliverableId: comment.deliverable_id,
      author: toCommentAuthor(comment.author_role),
      message: comment.content,
      createdAt: comment.created_at,
    }))

    const files: PortalFile[] = (filesResponse.data || []).map((file) => ({
      id: file.id,
      projectId: file.project_id,
      stage: toProjectStageKey(file.stage_key),
      name: file.file_name,
      kind: toFileKind(file.file_kind),
      url: file.file_path || '#',
      uploadedAt: file.created_at,
    }))

    const client = clientResponse.data
        ? {
          id: clientResponse.data.id,
          authUserId: clientResponse.data.auth_user_id,
          name: clientResponse.data.name || clientResponse.data.company_name || 'Cliente',
          company: clientResponse.data.company_name || clientResponse.data.name || 'Sin empresa',
          email: clientResponse.data.email || '',
          portalStatus: clientResponse.data.portal_status || 'invited',
          acceptedAt: clientResponse.data.accepted_at,
          createdAt: clientResponse.data.created_at || new Date().toISOString(),
        }
      : null

    const normalizedStages =
      stages.length > 0 ? stages : getPortalStagesByProject(projectId)
    const normalizedDeliverables =
      deliverables.length > 0 ? deliverables : getPortalDeliverablesByProject(projectId)
    const normalizedActivity =
      activity.length > 0 ? activity : getPortalActivityByProject(projectId)
    const normalizedComments =
      comments.length > 0 ? comments : getPortalCommentsByProject(projectId)
    const normalizedFiles =
      files.length > 0 ? files : getPortalFilesByProject(projectId)

    return {
      project: {
        id: project.id,
        clientId: project.client_id,
        name: project.name,
        description: project.description || '',
        stage: toProjectStageKey(project.current_stage),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      },
      client,
      stages: normalizedStages,
      deliverables: normalizedDeliverables,
      activity: normalizedActivity,
      comments: normalizedComments,
      files: normalizedFiles,
    }
  } catch {
    return fallbackProjectDetail(projectId)
  }
}

export async function getAdminProjectDetail(projectId: string): Promise<InternalProjectDetail | null> {
  try {
    const supabase = createSupabaseAdminClient()

    const {
      data: project,
      error: projectError,
    } = await supabase
      .from('projects')
      .select('id, client_id, name, description, current_stage, created_at, updated_at')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return fallbackProjectDetail(projectId)
    }

    const [
      clientResponse,
      stagesResponse,
      deliverablesResponse,
      activityResponse,
      commentsResponse,
      filesResponse,
    ] = await Promise.all([
      supabase
        .from('clients')
        .select('id, auth_user_id, name, company_name, email, portal_status, accepted_at, created_at')
        .eq('id', project.client_id)
        .maybeSingle(),
      supabase
        .from('project_stages')
        .select('id, project_id, stage_key, position, completed_at')
        .eq('project_id', projectId)
        .order('position', { ascending: true }),
      supabase
        .from('deliverables')
        .select('id, project_id, stage_key, title, description, status, due_date, updated_at')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true }),
      supabase
        .from('project_activity')
        .select('id, project_id, event_type, title, description, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('project_comments')
        .select('id, project_id, deliverable_id, author_role, content, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('project_files')
        .select('id, project_id, stage_key, file_kind, file_name, file_path, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
    ])

    const stages: PortalProjectStage[] = (stagesResponse.data || []).map((stage) => ({
      id: stage.id,
      projectId: stage.project_id,
      key: toProjectStageKey(stage.stage_key),
      position: stage.position,
      completedAt: stage.completed_at,
    }))

    const deliverables: PortalDeliverable[] = (deliverablesResponse.data || []).map((deliverable) => ({
      id: deliverable.id,
      projectId: deliverable.project_id,
      stage: toProjectStageKey(deliverable.stage_key),
      title: deliverable.title,
      description: deliverable.description || '',
      status: toDeliverableStatus(deliverable.status),
      dueDate: deliverable.due_date || new Date().toISOString(),
      updatedAt: deliverable.updated_at || new Date().toISOString(),
    }))

    const activity: PortalActivity[] = (activityResponse.data || []).map((event) => ({
      id: event.id,
      projectId: event.project_id,
      eventType: event.event_type,
      title: event.title,
      description: event.description || '',
      createdAt: event.created_at,
    }))

    const comments: PortalComment[] = (commentsResponse.data || []).map((comment) => ({
      id: comment.id,
      projectId: comment.project_id,
      deliverableId: comment.deliverable_id,
      author: toCommentAuthor(comment.author_role),
      message: comment.content,
      createdAt: comment.created_at,
    }))

    const files: PortalFile[] = (filesResponse.data || []).map((file) => ({
      id: file.id,
      projectId: file.project_id,
      stage: toProjectStageKey(file.stage_key),
      name: file.file_name,
      kind: toFileKind(file.file_kind),
      url: file.file_path || '#',
      uploadedAt: file.created_at,
    }))

    const client = clientResponse.data
      ? {
          id: clientResponse.data.id,
          authUserId: clientResponse.data.auth_user_id,
          name: clientResponse.data.name || clientResponse.data.company_name || 'Cliente',
          company: clientResponse.data.company_name || clientResponse.data.name || 'Sin empresa',
          email: clientResponse.data.email || '',
          portalStatus: clientResponse.data.portal_status || 'invited',
          acceptedAt: clientResponse.data.accepted_at,
          createdAt: clientResponse.data.created_at || new Date().toISOString(),
        }
      : null

    const normalizedStages = stages.length > 0 ? stages : getPortalStagesByProject(projectId)
    const normalizedDeliverables =
      deliverables.length > 0 ? deliverables : getPortalDeliverablesByProject(projectId)
    const normalizedActivity = activity.length > 0 ? activity : getPortalActivityByProject(projectId)
    const normalizedComments = comments.length > 0 ? comments : getPortalCommentsByProject(projectId)
    const normalizedFiles = files.length > 0 ? files : getPortalFilesByProject(projectId)

    return {
      project: {
        id: project.id,
        clientId: project.client_id,
        name: project.name,
        description: project.description || '',
        stage: toProjectStageKey(project.current_stage),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      },
      client,
      stages: normalizedStages,
      deliverables: normalizedDeliverables,
      activity: normalizedActivity,
      comments: normalizedComments,
      files: normalizedFiles,
    }
  } catch {
    return fallbackProjectDetail(projectId)
  }
}

export async function getAdminMetricsSummary(): Promise<AdminMetricsSummary> {
  const fallback: AdminMetricsSummary = {
    totalClients: 0,
    totalProjects: portalMockProjects.length,
    activeProjects: portalMockProjects.filter((project) => project.stage !== 'publicado').length,
    publishedProjects: portalMockProjects.filter((project) => project.stage === 'publicado').length,
    totalSites: 0,
    totalLeads: 0,
    recentLeads: 0,
  }

  try {
    const supabase = await createSupabaseServerClient()
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [
      clientsCountResponse,
      projectsCountResponse,
      activeProjectsCountResponse,
      publishedProjectsCountResponse,
      sitesCountResponse,
      leadsCountResponse,
      recentLeadsCountResponse,
    ] = await Promise.all([
      supabase.from('clients').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }).neq('current_stage', 'publicado'),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('current_stage', 'publicado'),
      supabase.from('sites').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo),
    ])

    return {
      totalClients: clientsCountResponse.count || 0,
      totalProjects: projectsCountResponse.count || 0,
      activeProjects: activeProjectsCountResponse.count || 0,
      publishedProjects: publishedProjectsCountResponse.count || 0,
      totalSites: sitesCountResponse.count || 0,
      totalLeads: leadsCountResponse.count || 0,
      recentLeads: recentLeadsCountResponse.count || 0,
    }
  } catch {
    return fallback
  }
}

export async function getClientPortalSnapshotByAuthUserId(
  authUserId: string,
  userFullName?: string | null
): Promise<ClientPortalSnapshot | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: client } = await supabase
      .from('clients')
      .select('id, auth_user_id, name, company_name, email, portal_status, accepted_at, portal_onboarding_seen_at, portal_onboarding_version, created_at')
      .eq('auth_user_id', authUserId)
      .eq('portal_status', 'accepted')
      .maybeSingle()

    if (!client) {
      return null
    }

    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('client_id', client.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!project) {
      return null
    }

    const detail = await getInternalProjectDetail(project.id)

    if (!detail) {
      return null
    }

    return {
      client: {
        id: client.id,
        authUserId: client.auth_user_id,
        name: client.name || client.company_name || 'Cliente',
        userFullName: userFullName || null,
        company: client.company_name || client.name || 'Sin empresa',
        email: client.email || '',
        portalStatus: client.portal_status || 'invited',
        acceptedAt: client.accepted_at,
        portalOnboardingSeenAt: client.portal_onboarding_seen_at || null,
        portalOnboardingVersion: client.portal_onboarding_version || null,
        createdAt: client.created_at || new Date().toISOString(),
      },
      detail,
    }
  } catch {
    return null
  }
}

export async function getAdminLeadIntake(limit = 20): Promise<AdminLeadIntake[]> {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('leads')
      .select('id, name, email, phone, project, budget, message, status, first_contact_at, last_contact_at, next_action, next_action_at, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error?.message?.includes('next_action')) {
      const fallback = await supabase
        .from('leads')
        .select('id, name, email, phone, project, budget, message, status, first_contact_at, last_contact_at, created_at')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (fallback.error || !fallback.data) return []

      return fallback.data.map((lead) => ({
        id: lead.id,
        name: lead.name || 'Sin nombre',
        email: lead.email || '',
        phone: lead.phone || null,
        project: lead.project || null,
        budget: lead.budget || null,
        message: lead.message || '',
        status: lead.status || null,
        firstContactAt: lead.first_contact_at || null,
        lastContactAt: lead.last_contact_at || null,
        nextAction: null,
        nextActionAt: null,
        createdAt: lead.created_at || new Date().toISOString(),
      }))
    }

    if (error || !data) {
      return []
    }

    return data.map((lead) => ({
      id: lead.id,
      name: lead.name || 'Sin nombre',
      email: lead.email || '',
      phone: lead.phone || null,
      project: lead.project || null,
      budget: lead.budget || null,
      message: lead.message || '',
      status: lead.status || null,
      firstContactAt: lead.first_contact_at || null,
      lastContactAt: lead.last_contact_at || null,
      nextAction: lead.next_action || null,
      nextActionAt: lead.next_action_at || null,
      createdAt: lead.created_at || new Date().toISOString(),
    }))
  } catch {
    return []
  }
}

export async function getAdminLeadsFiltered(filters: AdminLeadFilters, limit = 500): Promise<AdminLeadIntake[]> {
  try {
    const supabase = createSupabaseAdminClient()
    const since = new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000).toISOString()

    let query = supabase
      .from('leads')
      .select(
        'id, name, email, phone, project, budget, message, status, source, utm_source, utm_campaign, first_contact_at, last_contact_at, next_action, next_action_at, created_at'
      )
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters.source !== 'all') {
      query = query.eq('source', filters.source)
    }

    if (filters.utmSource !== 'all') {
      query = query.eq('utm_source', filters.utmSource)
    }

    if (filters.utmCampaign !== 'all') {
      query = query.eq('utm_campaign', filters.utmCampaign)
    }

    const { data, error } = await query

    if (error?.message?.includes('next_action')) {
      let fallbackQuery = supabase
        .from('leads')
        .select('id, name, email, phone, project, budget, message, status, source, utm_source, utm_campaign, first_contact_at, last_contact_at, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (filters.status !== 'all') {
        fallbackQuery = fallbackQuery.eq('status', filters.status)
      }

      if (filters.source !== 'all') {
        fallbackQuery = fallbackQuery.eq('source', filters.source)
      }

      if (filters.utmSource !== 'all') {
        fallbackQuery = fallbackQuery.eq('utm_source', filters.utmSource)
      }

      if (filters.utmCampaign !== 'all') {
        fallbackQuery = fallbackQuery.eq('utm_campaign', filters.utmCampaign)
      }

      const fallback = await fallbackQuery

      if (fallback.error || !fallback.data) return []

      return fallback.data.map((lead) => ({
        id: lead.id,
        name: lead.name || 'Sin nombre',
        email: lead.email || '',
        phone: lead.phone || null,
        project: lead.project || null,
        budget: lead.budget || null,
        message: lead.message || '',
        status: lead.status || 'new',
        source: lead.source || null,
        utmSource: lead.utm_source || null,
        utmCampaign: lead.utm_campaign || null,
        firstContactAt: lead.first_contact_at || null,
        lastContactAt: lead.last_contact_at || null,
        nextAction: null,
        nextActionAt: null,
        createdAt: lead.created_at || new Date().toISOString(),
      }))
    }

    if (error || !data) {
      return []
    }

    return data.map((lead) => ({
      id: lead.id,
      name: lead.name || 'Sin nombre',
      email: lead.email || '',
      phone: lead.phone || null,
      project: lead.project || null,
      budget: lead.budget || null,
      message: lead.message || '',
      status: lead.status || 'new',
      source: lead.source || null,
      utmSource: lead.utm_source || null,
      utmCampaign: lead.utm_campaign || null,
      firstContactAt: lead.first_contact_at || null,
      lastContactAt: lead.last_contact_at || null,
      nextAction: lead.next_action || null,
      nextActionAt: lead.next_action_at || null,
      createdAt: lead.created_at || new Date().toISOString(),
    }))
  } catch {
    return []
  }
}

export async function getAdminLeadsPaginated(
  filters: AdminLeadFilters,
  page = 1,
  limit = 20
): Promise<PaginatedLeadsResult> {
  const DEFAULT_LIMIT = 20
  const MAX_LIMIT = 100

  const safeLimit = Math.min(Math.max(Math.floor(limit) || DEFAULT_LIMIT, 1), MAX_LIMIT)
  const safePage = Math.max(Math.floor(page) || 1, 1)
  const offset = (safePage - 1) * safeLimit

  try {
    const supabase = createSupabaseAdminClient()
    const since = new Date(Date.now() - filters.days * 24 * 60 * 60 * 1000).toISOString()

    const countQuery = supabase
      .from('leads')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', since)

    if (filters.status !== 'all') {
      countQuery.eq('status', filters.status)
    }
    if (filters.source !== 'all') {
      countQuery.eq('source', filters.source)
    }
    if (filters.utmSource !== 'all') {
      countQuery.eq('utm_source', filters.utmSource)
    }
    if (filters.utmCampaign !== 'all') {
      countQuery.eq('utm_campaign', filters.utmCampaign)
    }

    const { count: total, error: countError } = await countQuery

    if (countError || typeof total !== 'number') {
      console.error('[getAdminLeadsPaginated] Count error:', countError)
      return {
        leads: [],
        pagination: {
          page: safePage,
          limit: safeLimit,
          total: 0,
          totalPages: 0,
          hasMore: false,
        },
      }
    }

    const totalPages = Math.ceil(total / safeLimit)
    const hasMore = safePage < totalPages

    let query = supabase
      .from('leads')
      .select(
        'id, name, email, phone, project, budget, message, status, source, utm_source, utm_campaign, first_contact_at, last_contact_at, next_action, next_action_at, created_at'
      )
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .range(offset, offset + safeLimit - 1)

    if (filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }
    if (filters.source !== 'all') {
      query = query.eq('source', filters.source)
    }
    if (filters.utmSource !== 'all') {
      query = query.eq('utm_source', filters.utmSource)
    }
    if (filters.utmCampaign !== 'all') {
      query = query.eq('utm_campaign', filters.utmCampaign)
    }

    const { data, error } = await query

    if (error || !data) {
      console.error('[getAdminLeadsPaginated] Query error:', error)
      return {
        leads: [],
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          totalPages,
          hasMore,
        },
      }
    }

    const leads = data.map((lead) => ({
      id: lead.id,
      name: lead.name || 'Sin nombre',
      email: lead.email || '',
      phone: lead.phone || null,
      project: lead.project || null,
      budget: lead.budget || null,
      message: lead.message || '',
      status: lead.status || 'new',
      source: lead.source || null,
      utmSource: lead.utm_source || null,
      utmCampaign: lead.utm_campaign || null,
      firstContactAt: lead.first_contact_at || null,
      lastContactAt: lead.last_contact_at || null,
      nextAction: lead.next_action || null,
      nextActionAt: lead.next_action_at || null,
      createdAt: lead.created_at || new Date().toISOString(),
    }))

    return {
      leads,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasMore,
      },
    }
  } catch (err) {
    console.error('[getAdminLeadsPaginated] Unexpected error:', err)
    return {
      leads: [],
      pagination: {
        page: safePage,
        limit: safeLimit,
        total: 0,
        totalPages: 0,
        hasMore: false,
      },
    }
  }
}

export async function getAdminClients(limit = 400): Promise<AdminClientRow[]> {
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('clients')
      .select('id, name, company_name, email, portal_status, accepted_at, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data.map((client) => ({
      id: client.id,
      name: client.name || client.company_name || 'Cliente',
      company: client.company_name || client.name || 'Sin empresa',
      email: client.email || '',
      portalStatus: client.portal_status || 'invited',
      acceptedAt: client.accepted_at,
      createdAt: client.created_at || new Date().toISOString(),
    }))
  } catch {
    return []
  }
}

export async function getAdminAnalyticsSummary(days = 7): Promise<AdminAnalyticsSummary> {
  const fallback: AdminAnalyticsSummary = {
    views: 0,
    sessions: 0,
    bounceRate: 0,
    ctaClicks: 0,
    formStarts: 0,
    formSubmits: 0,
    ctr: 0,
    leadConversion: 0,
    dailyViews: [],
    activityByHour: Array.from({ length: 24 }, (_, hour) => ({ hour, total: 0 })),
    topReferrers: [],
    topCountries: [],
    topProvinces: [],
    topPages: [],
    topZones: [],
  }

  try {
    const supabase = createSupabaseAdminClient()
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('site_events')
      .select('event_type, page_path, zone_id, created_at, session_id, metadata')
      .gte('created_at', since)

    if (error || !data) {
      return fallback
    }

    let views = 0
    let ctaClicks = 0
    let formStarts = 0
    let formSubmits = 0
    const dailyCounter = new Map<string, number>()
    const referrerCounter = new Map<string, number>()
    const countryCounter = new Map<string, number>()
    const provinceCounter = new Map<string, number>()
    const sessionPageViews = new Map<string, number>()
    const hourlyCounter = Array.from({ length: 24 }, () => 0)
    const pageCounter = new Map<string, number>()
    const zoneCounter = new Map<string, number>()

    data.forEach((event) => {
      const eventType = event.event_type || ''
      const pagePath = event.page_path || '/'

      if (eventType === 'page_view') {
        views += 1
        pageCounter.set(pagePath, (pageCounter.get(pagePath) || 0) + 1)

        const createdAt = new Date(event.created_at || '')
        if (!Number.isNaN(createdAt.getTime())) {
          const day = createdAt.toISOString().slice(0, 10)
          dailyCounter.set(day, (dailyCounter.get(day) || 0) + 1)
          const hour = createdAt.getUTCHours()
          hourlyCounter[hour] += 1
        }

        const metadata = event.metadata && typeof event.metadata === 'object' ? event.metadata : {}
        const referrer = String((metadata as Record<string, unknown>).referrerHost || 'directo').toLowerCase()
        referrerCounter.set(referrer, (referrerCounter.get(referrer) || 0) + 1)

        const country = String((metadata as Record<string, unknown>).country || '').toUpperCase()
        if (country) {
          countryCounter.set(country, (countryCounter.get(country) || 0) + 1)
        }

        if (country === 'AR') {
          const provinceRaw = String((metadata as Record<string, unknown>).region || (metadata as Record<string, unknown>).province || '')
          const province = normalizeArgentinaProvince(provinceRaw)

          if (province) {
            provinceCounter.set(province, (provinceCounter.get(province) || 0) + 1)
          }
        }

        const sessionId = String(event.session_id || '').trim()
        if (sessionId) {
          sessionPageViews.set(sessionId, (sessionPageViews.get(sessionId) || 0) + 1)
        }
      }

      if (eventType === 'cta_click') {
        ctaClicks += 1
        const zone = event.zone_id || 'sin-zona'
        zoneCounter.set(zone, (zoneCounter.get(zone) || 0) + 1)
      }

      if (eventType === 'form_start') {
        formStarts += 1
      }

      if (eventType === 'form_submit') {
        formSubmits += 1
      }
    })

    const topPages = Array.from(pageCounter.entries())
      .map(([pagePath, count]) => ({ pagePath, views: count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)

    const topZones = Array.from(zoneCounter.entries())
      .map(([zoneId, count]) => ({ zoneId, clicks: count }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)

    const dailyViews = Array.from(dailyCounter.entries())
      .map(([day, total]) => ({ day, total }))
      .sort((a, b) => a.day.localeCompare(b.day))

    const activityByHour = hourlyCounter.map((total, hour) => ({ hour, total }))

    const topReferrers = Array.from(referrerCounter.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    if (countryCounter.size === 0 || provinceCounter.size === 0) {
      const { data: leadsFallback, error: leadsFallbackError } = await supabase
        .from('leads')
        .select('*')
        .gte('created_at', since)
        .limit(2000)

      if (!leadsFallbackError && Array.isArray(leadsFallback)) {
        leadsFallback.forEach((leadRow) => {
          const lead = leadRow as Record<string, unknown>
          const country = inferCountryCodeFromLeadRecord(lead)
          if (country) {
            countryCounter.set(country, (countryCounter.get(country) || 0) + 1)
          }

          if (country === 'AR') {
            const province = normalizeArgentinaProvince(String(lead.province || lead.region || ''))
            if (province) {
              provinceCounter.set(province, (provinceCounter.get(province) || 0) + 1)
            }
          }
        })
      }
    }

    const topCountries = Array.from(countryCounter.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const topProvinces = Array.from(provinceCounter.entries())
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 12)

    const sessions = sessionPageViews.size
    const singlePageSessions = Array.from(sessionPageViews.values()).filter((count) => count === 1).length
    const bounceRate = sessions > 0 ? Number(((singlePageSessions / sessions) * 100).toFixed(2)) : 0

    return {
      views,
      sessions,
      bounceRate,
      ctaClicks,
      formStarts,
      formSubmits,
      ctr: views > 0 ? Number(((ctaClicks / views) * 100).toFixed(2)) : 0,
      leadConversion: views > 0 ? Number(((formSubmits / views) * 100).toFixed(2)) : 0,
      dailyViews,
      activityByHour,
      topReferrers,
      topCountries,
      topProvinces,
      topPages,
      topZones,
    }
  } catch {
    return fallback
  }
}
