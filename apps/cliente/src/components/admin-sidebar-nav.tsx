'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Activity, Archive, BarChart3, BookOpenText, DoorOpen, FolderKanban, House, Inbox, MessageSquare, Milestone, Package, Settings, Users } from 'lucide-react'
import type { AdminNavItem } from '@/lib/admin-nav'

interface AdminSidebarNavProps {
  items: AdminNavItem[]
  onNavigate?: () => void
}

function toTitleCaseLabel(value: string) {
  const raw = value.trim().toLowerCase()
  if (!raw) return value
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}

function getIcon(name: AdminNavItem['icon']) {
  if (name === 'house') return House
  if (name === 'door-open') return DoorOpen
  if (name === 'chart') return BarChart3
  if (name === 'users') return Users
  if (name === 'message-square') return MessageSquare
  if (name === 'package') return Package
  if (name === 'activity') return Activity
  if (name === 'milestone') return Milestone
  if (name === 'archive') return Archive
  if (name === 'folder') return FolderKanban
  if (name === 'book') return BookOpenText
  if (name === 'settings') return Settings
  return Inbox
}

export function AdminSidebarNav({ items, onNavigate }: AdminSidebarNavProps) {
  const pathname = usePathname()
  const activeHref =
    items
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ?? ''

  return (
    <nav className="space-y-0">
      {items.map((item) => {
        const Icon = getIcon(item.icon)
        const isActive = item.href === activeHref

        return (
          <Link
            key={item.key}
            href={item.href}
            className="muga-admin-nav-link"
            data-active={isActive ? 'true' : 'false'}
            onClick={onNavigate}
            style={{ textTransform: 'none' }}
          >
            <Icon size={15} aria-hidden="true" className={isActive ? 'text-primary' : undefined} />
            <span className={isActive ? 'text-primary' : undefined} style={{ textTransform: 'capitalize' }}>
              {toTitleCaseLabel(item.label)}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
