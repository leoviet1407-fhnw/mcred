import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CH', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('en-CH', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export const AVATAR_COLORS = [
  '#C8421E', '#3C6E47', '#B88A2B', '#2563EB',
  '#8B5CF6', '#EC4899', '#0891B2', '#059669',
]

export function avatarColor(index: number) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

export function roleColor(role: string): string {
  const map: Record<string, string> = {
    lecturer: '#3C6E47',
    secretariat: '#B88A2B',
    admin: '#C8421E',
    developer: '#2563EB',
    student: '#0891B2',
  }
  return map[role] ?? '#6B7280'
}

export function roleLabel(role: string): string {
  return role.charAt(0).toUpperCase() + role.slice(1)
}

export function canIssueCredentials(role: string) {
  return ['secretariat', 'admin', 'developer'].includes(role)
}

export function canManageUsers(role: string) {
  return ['admin', 'developer'].includes(role)
}

export function canAproveCourses(role: string) {
  return ['admin', 'developer'].includes(role)
}

export function canAccessSettings(role: string) {
  return ['admin', 'developer'].includes(role)
}

export function canRevokeCredentials(role: string) {
  return ['admin', 'developer'].includes(role)
}

export function canAccessDevTools(role: string) {
  return role === 'developer'
}
