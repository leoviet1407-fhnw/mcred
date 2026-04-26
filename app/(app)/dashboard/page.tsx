import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import {
  getCredentialsByInstitution, getCoursesByInstitution,
  getStudentsByInstitution, getClassesByInstitution,
  getScores, getLog, getUsersByInstitution,
} from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { KpiCard } from '@/components/ui/KpiCard'
import { StatusPill } from '@/components/ui/StatusPill'
import { RoleBadge } from '@/components/ui/RoleBadge'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const institutionId = session.user.institutionId
  const role = session.user.role

  const [creds, courses, students, classes, scores, log, users] = await Promise.all([
    getCredentialsByInstitution(institutionId),
    getCoursesByInstitution(institutionId),
    getStudentsByInstitution(institutionId),
    getClassesByInstitution(institutionId),
    getScores(),
    getLog(),
    role === 'admin' || role === 'developer' ? getUsersByInstitution(institutionId) : Promise.resolve([]),
  ])

  const issuedCreds = creds.filter(c => c.status === 'issued')
  const readyScores = scores.filter(s => s.readyForCredential)
  const recentLog = log.slice(0, 6)

  const ROLE_DESC: Record<string, string> = {
    lecturer: 'Enter scores and mark students as completed so Secretariat can issue credentials.',
    secretariat: 'You can issue credentials to students marked as completed by lecturers.',
    admin: 'Full institution access — manage users, approve courses, and configure settings.',
    developer: 'Full platform access including system logs, integrations, and schema tools.',
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${session.user.name}.`}
        actions={
          (role === 'secretariat' || role === 'developer') ? (
            <Link href="/issue" className="btn btn-ember">Issue Credential</Link>
          ) : undefined
        }
      />

      {/* Role banner */}
      <div className={`role-banner ${role}`} style={{ marginBottom: 32 }}>
        <div className="rb-icon">{session.user.name[0]}</div>
        <div>
          <div className="rb-title"><RoleBadge role={role} /> — {session.user.name}</div>
          <div className="rb-desc">{ROLE_DESC[role]}</div>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)', marginBottom: 32 }}>
        <KpiCard label="Credentials Issued" value={issuedCreds.length} delta={`${creds.length} total`} />
        <KpiCard label="Courses" value={courses.filter(c => c.status === 'active').length} delta={`${courses.length} total`} />
        <KpiCard label="Students" value={students.length} delta="Enrolled" />
        <KpiCard label="Ready to Issue" value={readyScores.length} delta="Completed, awaiting credential" />
      </div>

      <div className="dash-grid">
        {/* Recent log */}
        <div className="panel">
          <div className="panel-head">
            <h3>Recent Activity</h3>
            <Link href="/log" className="btn btn-ghost btn-sm view-all">View Log</Link>
          </div>
          <div className="panel-body">
            {recentLog.map(entry => (
              <div key={entry.id} className="activity-row">
                <div className="ava">{entry.userName[0]}</div>
                <div className="msg">
                  {entry.userName} — {entry.action}
                  <div className="sub">{entry.objectName} · {entry.objectType}</div>
                </div>
                <div className="when">{formatDateTime(entry.createdAt).split(',')[0]}</div>
              </div>
            ))}
            {recentLog.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--mute)', fontSize: 13 }}>No activity yet</div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 12 }}>Quick Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {role === 'lecturer' && <>
                <Link href="/scores" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Enter Scores / Completion</Link>
                <Link href="/courses" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>View My Courses</Link>
                <Link href="/proposals" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Propose New Course</Link>
              </>}
              {role === 'secretariat' && <>
                <Link href="/issue" className="btn btn-ember btn-sm" style={{ justifyContent: 'flex-start' }}>Issue Credential</Link>
                <Link href="/students" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Add Students</Link>
                <Link href="/import-students" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Import Students CSV</Link>
                <Link href="/credentials" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>All Credentials</Link>
              </>}
              {role === 'admin' && <>
                <Link href="/users" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Manage Users & Roles</Link>
                <Link href="/approvals" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Course Approvals</Link>
                <Link href="/credentials" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>All Credentials</Link>
                <Link href="/settings" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Institution Settings</Link>
              </>}
              {role === 'developer' && <>
                <Link href="/system-logs" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>System Logs</Link>
                <Link href="/integrations" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Integrations</Link>
                <Link href="/schema" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Schema Import/Export</Link>
                <Link href="/users" className="btn btn-ghost btn-sm" style={{ justifyContent: 'flex-start' }}>Users & Roles</Link>
              </>}
            </div>
          </div>

          {/* Ready to issue */}
          {(role === 'secretariat' || role === 'admin' || role === 'developer') && readyScores.length > 0 && (
            <div className="panel">
              <div className="panel-head">
                <h3>Ready to Issue</h3>
                <Link href="/issue" className="btn btn-ember btn-sm">Issue Now</Link>
              </div>
              <div className="panel-body">
                {readyScores.slice(0, 4).map(s => (
                  <div key={s.id} className="activity-row">
                    <div className="ava">{s.studentName[0]}</div>
                    <div className="msg">
                      {s.studentName}
                      <div className="sub">{s.courseTitle} · {s.grade}</div>
                    </div>
                    <StatusPill status="completed" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
