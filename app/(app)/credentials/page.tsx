import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCredentialsByInstitution } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function CredentialsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role
  const all = await getCredentialsByInstitution(session.user.institutionId)
  // Lecturers see limited view (in real app filtered by class)
  const creds = all

  const canIssue = ['secretariat', 'admin', 'developer'].includes(role)
  const canRevoke = ['admin', 'developer'].includes(role)

  const issued = creds.filter(c => c.status === 'issued').length
  const revoked = creds.filter(c => c.status === 'revoked').length
  const verifications = creds.reduce((a, c) => a + c.verificationCount, 0)

  return (
    <div>
      <PageHeader
        title="Credentials"
        subtitle="All credentials issued by your institution."
        actions={canIssue ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm">Export CSV</button>
            <Link href="/issue" className="btn btn-ember">+ Issue Credential</Link>
          </div>
        ) : undefined}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0, border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)', marginBottom: 28 }}>
        {[['Total', creds.length], ['Issued', issued], ['Revoked', revoked], ['Verifications', verifications]].map(([l, v]) => (
          <div key={String(l)} style={{ padding: '20px 24px', borderRight: '1px solid var(--line)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 10 }}>{l}</div>
            <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>{v}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Credential ID</th><th>Student</th><th>Course</th>
              <th>Issued</th><th>Expires</th><th>Status</th><th>Verifications</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {creds.map(c => (
              <tr key={c.id}>
                <td className="mono" style={{ fontSize: 11 }}>{c.credentialId}</td>
                <td className="fw">{c.studentName}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.courseTitle}</td>
                <td>{formatDate(c.issuedAt)}</td>
                <td>{c.expiresAt ? formatDate(c.expiresAt) : '—'}</td>
                <td><StatusPill status={c.status} /></td>
                <td>{c.verificationCount}</td>
                <td>
                  <div className="actions-cell">
                    <Link href={`/credentials/${c.id}`} className="btn btn-ghost btn-sm">View</Link>
                    <Link href={`/verify/${c.credentialId}`} target="_blank" className="btn btn-ghost btn-sm">Verify</Link>
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
