import { DELIVERABLE_STATUS_KEYS, PROJECT_STAGE_KEYS } from '@/lib/portal-constants'

export type ProjectStageKey = (typeof PROJECT_STAGE_KEYS)[number]
export type DeliverableStatus = (typeof DELIVERABLE_STATUS_KEYS)[number]

export interface PortalClient {
  id: string
  authUserId?: string | null
  name: string
  userFullName?: string | null
  company: string
  email: string
  portalStatus?: 'invited' | 'accepted' | 'disabled'
  acceptedAt?: string | null
  portalOnboardingSeenAt?: string | null
  portalOnboardingVersion?: string | null
  createdAt: string
}

export interface PortalProject {
  id: string
  clientId: string
  name: string
  description: string
  stage: ProjectStageKey
  createdAt: string
  updatedAt: string
}

export interface PortalProjectStage {
  id: string
  projectId: string
  key: ProjectStageKey
  position: number
  completedAt: string | null
}

export interface PortalDeliverable {
  id: string
  projectId: string
  stage: ProjectStageKey
  title: string
  description: string
  status: DeliverableStatus
  dueDate: string
  updatedAt: string
}

export interface PortalComment {
  id: string
  projectId: string
  deliverableId: string | null
  author: 'muga' | 'cliente'
  message: string
  createdAt: string
}

export interface PortalFile {
  id: string
  projectId: string
  stage: ProjectStageKey
  name: string
  kind: 'brief' | 'asset' | 'entregable'
  url: string
  uploadedAt: string
}

export interface PortalActivity {
  id: string
  projectId: string
  eventType: 'stage_change' | 'deliverable_status_change' | 'comment' | 'file_upload'
  title: string
  description: string
  createdAt: string
}
