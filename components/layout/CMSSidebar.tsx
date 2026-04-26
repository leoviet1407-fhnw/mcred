'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { Icon } from '@/components/ui/Icon'
import type { Role } from '@/lib/types'

interface NavItem { id: string; label: string; icon: string; href: string }
interface NavSection { label: string; items: NavItem[] }

function getNav(role: Role): NavSection[] {
  const item = (id: string, label: string, icon: string, href?: string): NavItem => ({
    id, label, icon, href: href ?? `/${id}`,
  })

  const shared = {
    dashboard:  item('dashboard',  'Dashboard',           'grid'),
    courses:    item('courses',    'Courses',             'book'),
    classes:    item('classes',    'Classes',             'classes'),
    students:   item('students',   'Students',            'users'),
    creds:      item('credentials','Credentials',         'shield'),
    issue:      item('issue',      'Issue Credential',    'award'),
    scores:     item('scores',     'Scores / Completion', 'star'),
    profile:    item('profile',    'Institution Profile', 'user'),
    design:     item('design',     'Design',              'palette'),
    layout:     item('layout-settings','Certificate Layout','layout'),
    settings:   item('settings',   'Settings',            'settings'),
    users:      item('users',      'Users & Roles',       'users'),
    log:        item('log',        'Log',                 'eye'),
    faq:        item('faq',        'FAQ',                 'help'),
    import:     item('import-students','Import Students', 'import'),
    proposals:  item('proposals',  'Course Proposals',    'edit'),
    approvals:  item('approvals',  'Course Approvals',    'verify'),
    integrations:item('integrations','Integrations',      'link'),
    syslog:     item('system-logs','System Logs',         'eye'),
    schema:     item('schema',     'Schema Import/Export','import'),
  }

  const maps: Record<string, NavSection[]> = {
    lecturer: [
      { label: 'Overview',     items: [shared.dashboard] },
      { label: 'Teaching',     items: [shared.courses, shared.proposals, shared.classes, shared.students, shared.scores] },
      { label: 'Credentials',  items: [shared.creds] },
      { label: 'Account',      items: [shared.profile, shared.log] },
    ],
    secretariat: [
      { label: 'Overview',     items: [shared.dashboard] },
      { label: 'Academic',     items: [shared.courses, shared.classes, shared.students, shared.import] },
      { label: 'Credentials',  items: [shared.issue, shared.creds] },
      { label: 'Help',         items: [shared.faq, shared.profile, shared.log] },
    ],
    admin: [
      { label: 'Overview',     items: [shared.dashboard] },
      { label: 'Management',   items: [shared.users, shared.approvals] },
      { label: 'Academic',     items: [shared.courses, shared.classes, shared.students, shared.creds] },
      { label: 'Institution',  items: [shared.profile, shared.design, shared.layout, shared.settings, shared.log] },
    ],
    developer: [
      { label: 'Overview',     items: [shared.dashboard] },
      { label: 'Academic',     items: [shared.courses, shared.classes, shared.students, shared.issue, shared.creds] },
      { label: 'Institution',  items: [shared.users, shared.profile, shared.design, shared.layout, shared.settings] },
      { label: 'Developer',    items: [shared.integrations, shared.syslog, shared.schema, shared.log] },
    ],
  }

  return maps[role] ?? []
}

interface Props {
  role: Role
  userName: string
  userDept?: string
  initial: string
  avatarColor: string
}

export function CMSSidebar({ role, userName, userDept, initial, avatarColor }: Props) {
  const pathname = usePathname()
  const sections = getNav(role)

  return (
    <div className="cms-sidebar">
      <div className="brand" style={{ padding: '8px 8px 24px', borderBottom: '1px solid rgba(246,243,236,.1)' }}>
        <BrandLogo size={28} textColor="var(--paper)" textSize={16} />
      </div>

      <div className="cms-user">
        <div className="avatar" style={{ background: avatarColor, fontStyle: 'italic', fontSize: 16, color: '#fff', display: 'grid', placeItems: 'center' }}>
          {initial}
        </div>
        <div>
          <div className="name">{userName}</div>
          <div className="role">{userDept ?? role}</div>
        </div>
      </div>

      <div className="cms-nav">
        {sections.map(sec => (
          <div key={sec.label}>
            <div className="sec-head">{sec.label}</div>
            {sec.items.map(item => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'))
              return (
                <Link
                  key={item.id} href={item.href}
                  className={active ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', fontSize: 14, color: active ? '#fff' : 'rgba(246,243,236,.75)', borderRadius: 8, transition: 'all .12s' }}
                >
                  <Icon n={item.icon} size={16} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      <div className="cms-foot">
        <span>BFH · v1.0</span>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          style={{ color: 'rgba(246,243,236,.4)', fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
