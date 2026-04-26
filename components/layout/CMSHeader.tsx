'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/ui/Icon'
import { RoleBadge } from '@/components/ui/RoleBadge'
import type { Role } from '@/lib/types'

const CRUMB_MAP: Record<string, string> = {
  dashboard:'Dashboard',courses:'Courses',classes:'Classes',students:'Students',
  credentials:'Credentials',issue:'Issue Credential',scores:'Scores / Completion',
  log:'Log',users:'Users & Roles',profile:'Institution Profile',design:'Design',
  'layout-settings':'Certificate Layout',settings:'Settings',faq:'FAQ',
  'import-students':'Import Students',proposals:'Course Proposals',
  approvals:'Course Approvals',integrations:'Integrations',
  'system-logs':'System Logs',schema:'Schema Import/Export',
}

export function CMSHeader({ role, canIssue }: { role: Role; canIssue: boolean }) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1] ?? 'dashboard'
  const crumb = CRUMB_MAP[last] ?? last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <div className="cms-header">
      <div className="crumbs">
        <span>BFH</span><span className="sep">/</span>
        <span className="active">{crumb}</span>
      </div>
      <div className="right">
        <div className="cms-search">
          <Icon n="eye" size={14} />
          <input placeholder="Search…" style={{ border:'none', outline:'none', background:'transparent', width:'100%', fontSize:14 }} />
        </div>
        <RoleBadge role={role} />
        {canIssue && (
          <Link href="/issue" className="btn btn-ghost btn-sm" style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Icon n="plus" size={13} /> Issue Credential
          </Link>
        )}
      </div>
    </div>
  )
}
