import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getClassById, getCourseById, getStudentsByInstitution, getScoresByClass } from '@/lib/data'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatDate, avatarColor } from '@/lib/utils'
import Link from 'next/link'

export default async function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const [cls, scores, allStudents] = await Promise.all([
    getClassById(id),
    getScoresByClass(id),
    getStudentsByInstitution(session.user.institutionId),
  ])
  if (!cls || cls.institutionId !== session.user.institutionId) notFound()

  const course = await getCourseById(cls.courseId)
  const canEdit = ['secretariat', 'admin', 'developer'].includes(session.user.role)

  // Students in this class (matched via scores)
  const studentIds = new Set(scores.map(s => s.studentId))
  const students = allStudents.filter(s => studentIds.has(s.id))

  return (
    <div>
      <Link href="/classes" className="back-btn">← Back to Classes</Link>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, gap:20 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <StatusPill status={cls.status}/>
            <span style={{ fontSize:11, color:'var(--mute)', fontFamily:'monospace' }}>{id}</span>
          </div>
          <h1 style={{ fontSize:36, fontWeight:700, letterSpacing:'-0.025em', marginBottom:4 }}>{cls.name}</h1>
          <div style={{ fontSize:14, color:'var(--mute)' }}>
            {cls.courseTitle} · {cls.mode} · {cls.lecturerName ?? 'No lecturer assigned'}
          </div>
        </div>
        {canEdit && (
          <div style={{ display:'flex', gap:10, flexShrink:0 }}>
            <Link href={`/issue?classId=${id}`} className="btn btn-ember btn-sm">Issue Credential</Link>
          </div>
        )}
      </div>

      {/* Meta grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0, border:'1px solid var(--line)', borderRadius:12, overflow:'hidden', background:'var(--white)', marginBottom:28 }}>
        {[
          ['Start Date', formatDate(cls.startDate)],
          ['End Date', formatDate(cls.endDate)],
          ['Students', students.length],
          ['Template', cls.template.charAt(0).toUpperCase() + cls.template.slice(1)],
        ].map(([l, v]) => (
          <div key={String(l)} style={{ padding:'18px 22px', borderRight:'1px solid var(--line)' }}>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:6 }}>{l}</div>
            <div style={{ fontSize:18, fontWeight:600 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24 }}>
        {/* Students table */}
        <div className="panel">
          <div className="panel-head">
            <h3>Students ({students.length})</h3>
            {canEdit && <Link href={`/students/new?classId=${id}`} className="btn btn-ghost btn-sm">+ Add Student</Link>}
          </div>
          {students.length > 0 ? (
            <table className="data-table">
              <thead><tr><th>Student</th><th>Score</th><th>Grade</th><th>Completion</th><th>Ready</th></tr></thead>
              <tbody>
                {students.map((s, i) => {
                  const score = scores.find(sc => sc.studentId === s.id)
                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:30, height:30, borderRadius:'50%', background:avatarColor(i), display:'grid', placeItems:'center', fontSize:12, fontStyle:'italic', color:'#fff', flexShrink:0 }}>{s.firstName[0]}</div>
                          <Link href={`/students/${s.id}`} style={{ fontWeight:500, fontSize:13 }}>{s.firstName} {s.lastName}</Link>
                        </div>
                      </td>
                      <td className="mono">{score?.score ?? '—'}</td>
                      <td>{score?.grade ?? '—'}</td>
                      <td><StatusPill status={score?.completion ?? 'in_progress'}/></td>
                      <td>{score?.readyForCredential ? '✅' : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div style={{ padding:'32px', textAlign:'center', color:'var(--mute)', fontSize:13 }}>
              No students enrolled yet.{canEdit && ' Add students to this class to get started.'}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="panel" style={{ padding:20 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:14 }}>Class Info</div>
            {[
              ['Course', cls.courseTitle],
              ['Lecturer', cls.lecturerName ?? '—'],
              ['Mode', cls.mode],
              ['Certificate Template', cls.template],
              ['EQF Level', course?.eqfLevel ?? '—'],
              ['ECTS', course?.ects ?? '—'],
            ].map(([l, v]) => (
              <div key={String(l)} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--line-2)', fontSize:13 }}>
                <span style={{ color:'var(--mute)' }}>{l}</span>
                <span style={{ fontWeight:500 }}>{v}</span>
              </div>
            ))}
          </div>

          <div className="panel" style={{ padding:20 }}>
            <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:12 }}>Completion Summary</div>
            {[
              ['Completed', scores.filter(s=>s.completion==='completed').length, 'var(--sage)'],
              ['In Progress', scores.filter(s=>s.completion==='in_progress').length, 'var(--blue)'],
              ['Not Completed', scores.filter(s=>s.completion==='not_completed').length, 'var(--ember)'],
              ['Ready for Credential', scores.filter(s=>s.readyForCredential).length, 'var(--ink)'],
            ].map(([l, v, c]) => (
              <div key={String(l)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--line-2)', fontSize:13 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:String(c), flexShrink:0 }}/>
                  {l}
                </div>
                <span style={{ fontWeight:700, fontSize:16 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
