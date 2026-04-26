import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getUserById } from '@/lib/data'
import { CMSSidebar } from '@/components/layout/CMSSidebar'
import { CMSHeader } from '@/components/layout/CMSHeader'
import { roleColor, getInitials, canIssueCredentials } from '@/lib/utils'
import type { Role } from '@/lib/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role === 'student') redirect('/wallet')

  const user = await getUserById(session.user.id)
  const role = session.user.role as Role

  return (
    <div className="cms-app" style={{ minHeight: '100vh' }}>
      <CMSSidebar
        role={role}
        userName={session.user.name}
        userDept={user?.department}
        initial={getInitials(session.user.name)}
        avatarColor={roleColor(role)}
      />
      <div className="cms-main">
        <CMSHeader role={role} canIssue={canIssueCredentials(role)} />
        <div className="cms-body">{children}</div>
      </div>
    </div>
  )
}
