import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getStudentsByInstitution } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'
import { avatarColor } from '@/lib/utils'
import Link from 'next/link'

export default async function StudentsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const students = await getStudentsByInstitution(session.user.institutionId)
  const canAdd = ['secretariat', 'admin', 'developer'].includes(session.user.role)

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle={session.user.role === 'lecturer' ? 'Students in your assigned classes.' : 'All enrolled students across your institution.'}
        actions={canAdd ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/import-students" className="btn btn-ghost btn-sm">Import CSV</Link>
            <Link href="/students/new" className="btn btn-ember">+ Add Student</Link>
          </div>
        ) : undefined}
      />
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th><th>Student No.</th><th>Email</th>
              <th>Wallet</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: avatarColor(i), display: 'grid', placeItems: 'center', fontSize: 13, fontStyle: 'italic', color: '#fff', flexShrink: 0 }}>
                      {s.firstName[0]}
                    </div>
                    <span className="fw">{s.firstName} {s.lastName}</span>
                  </div>
                </td>
                <td className="mono">{s.studentNumber}</td>
                <td className="mono" style={{ fontSize: 12 }}>{s.email}</td>
                <td><StatusPill status={s.walletStatus} /></td>
                <td>
                  <div className="actions-cell">
                    <Link href={`/students/${s.id}`} className="btn btn-ghost btn-sm">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
