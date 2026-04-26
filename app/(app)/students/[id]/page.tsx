import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getStudentById, getCredentialsByStudent, getScores } from '@/lib/data'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatDate, avatarColor } from '@/lib/utils'
import Link from 'next/link'

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const [student, creds, allScores] = await Promise.all([
    getStudentById(id),
    getCredentialsByStudent(id),
    getScores(),
  ])
  if (!student || student.institutionId !== session.user.institutionId) notFound()

  const scores = allScores.filter(s => s.studentId === id)
  const canIssue = ['secretariat','admin','developer'].includes(session.user.role)

  return (
    <div>
      <Link href="/students" className="back-btn">← Back to Students</Link>

      {/* Hero */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, gap:20, paddingBottom:28, borderBottom:'1px solid var(--line)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:avatarColor(0), display:'grid', placeItems:'center', fontSize:28, fontStyle:'italic', fontWeight:700, color:'#fff', flexShrink:0 }}>
            {student.firstName[0]}
          </div>
          <div>
            <h1 style={{ fontSize:36, fontWeight:700, letterSpacing:'-0.025em', marginBottom:4 }}>{student.firstName} {student.lastName}</h1>
            <div style={{ fontSize:14, color:'var(--mute)', display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontFamily:'monospace' }}>{student.studentNumber}</span>
              <span>·</span>
              <span>{student.email}</span>
              <span>·</span>
              <StatusPill status={student.walletStatus}/>
            </div>
          </div>
        </div>
        {canIssue && (
          <Link href={`/issue`} className="btn btn-ember btn-sm">Issue Credential</Link>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, border:'1px solid var(--line)', borderRadius:12, overflow:'hidden', background:'var(--white)', marginBottom:28 }}>
        {[
          ['Credentials Issued', creds.filter(c=>c.status==='issued').length],
          ['Courses Completed', scores.filter(s=>s.completion==='completed').length],
          ['Verifications', creds.reduce((a,c)=>a+c.verificationCount,0)],
        ].map(([l,v]) => (
          <div key={String(l)} style={{ padding:'20px 24px', borderRight:'1px solid var(--line)' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:10 }}>{l}</div>
            <div style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.02em' }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24 }}>
        {/* Credentials */}
        <div className="panel">
          <div className="panel-head"><h3>Credentials ({creds.length})</h3></div>
          {creds.length > 0 ? (
            <table className="data-table">
              <thead><tr><th>Credential ID</th><th>Course</th><th>Issued</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {creds.map(c => (
                  <tr key={c.id}>
                    <td className="mono" style={{ fontSize:11 }}>{c.credentialId}</td>
                    <td style={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:13 }}>{c.courseTitle}</td>
                    <td style={{ fontSize:12 }}>{formatDate(c.issuedAt)}</td>
                    <td><StatusPill status={c.status}/></td>
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
          ) : (
            <div style={{ padding:'32px', textAlign:'center', color:'var(--mute)', fontSize:13 }}>No credentials issued yet.</div>
          )}
        </div>

        {/* Scores & Info */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="panel" style={{ padding:20 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:14 }}>Student Info</div>
            {[
              ['Student Number', student.studentNumber],
              ['Email', student.email],
              ['Wallet Status', student.walletStatus],
              ['Enrolled Since', formatDate(student.createdAt)],
            ].map(([l,v]) => (
              <div key={String(l)} style={{ display:'flex', flexDirection:'column', padding:'8px 0', borderBottom:'1px solid var(--line-2)', fontSize:13 }}>
                <span style={{ color:'var(--mute)', fontSize:10, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>{l}</span>
                <span style={{ fontWeight:500, fontFamily: l==='Student Number'||l==='Email' ?'monospace':undefined }}>{v}</span>
              </div>
            ))}
          </div>

          {scores.length > 0 && (
            <div className="panel" style={{ padding:20 }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:12 }}>Course Scores</div>
              {scores.map(s => (
                <div key={s.id} style={{ padding:'10px 0', borderBottom:'1px solid var(--line-2)' }}>
                  <div style={{ fontSize:12, fontWeight:500, marginBottom:4 }}>{s.courseTitle}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:11, color:'var(--mute)' }}>{s.score ?? '—'} · {s.grade ?? '—'}</span>
                    <StatusPill status={s.completion}/>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
