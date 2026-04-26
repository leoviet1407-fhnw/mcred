import type { Role } from '@/lib/types'

export function RoleBadge({ role }: { role: Role | string }) {
  return <span className={`role-badge ${role}`}>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
}
