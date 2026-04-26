import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getCourseById, getClassesByCourse } from '@/lib/data'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const [course, classes] = await Promise.all([getCourseById(id), getClassesByCourse(id)])
  if (!course || course.institutionId !== session.user.institutionId) notFound()

  const colorMap: Record<string, string> = {
    ember: 'var(--ember)', sage: 'var(--sage)', amber: 'var(--amber)', ink: 'var(--ink)',
  }

  const canEdit = ['secretariat', 'admin', 'developer'].includes(session.user.role)

  return (
    <div>
      <Link href="/courses" className="back-btn">← Back to Courses</Link>

      <div className="detail-hero">
        <div className="dh-top">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <StatusPill status={course.status} />
              <span style={{ fontSize: 11, color: 'var(--mute)' }}>{course.department}</span>
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em' }}>{course.title}</h2>
          </div>
          {canEdit && (
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href={`/classes/new?courseId=${id}`} className="btn btn-ember btn-sm">+ Add Class</Link>
            </div>
          )}
        </div>
        <p style={{ fontSize: 15, color: 'var(--ink-3)', lineHeight: 1.6, maxWidth: 640, marginTop: 12 }}>{course.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 0, border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', background: 'var(--white)', marginTop: 24 }}>
          {[
            ['EQF Level', course.eqfLevel],
            ['ECTS', course.ects],
            ['Workload', `${course.workloadHours}h`],
            ['Language', course.language],
            ['Mode', course.mode],
          ].map(([l, v]) => (
            <div key={String(l)} style={{ padding: '16px 20px', borderRight: '1px solid var(--line)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 6 }}>{l}</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginTop: 28 }}>
        <div>
          {/* Classes */}
          <div className="panel" style={{ marginBottom: 20 }}>
            <div className="panel-head">
              <h3>Classes ({classes.length})</h3>
              {canEdit && <Link href={`/classes/new?courseId=${id}`} className="btn btn-ghost btn-sm">+ Add Class</Link>}
            </div>
            {classes.length > 0 ? (
              <table className="data-table">
                <thead><tr><th>Name</th><th>Lecturer</th><th>Period</th><th>Students</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {classes.map(cl => (
                    <tr key={cl.id}>
                      <td className="fw">{cl.name}</td>
                      <td>{cl.lecturerName ?? '—'}</td>
                      <td className="mono">{formatDate(cl.startDate)} – {formatDate(cl.endDate)}</td>
                      <td>{cl.studentCount}</td>
                      <td><StatusPill status={cl.status} /></td>
                      <td><Link href={`/classes/${cl.id}`} className="btn btn-ghost btn-sm">View</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--mute)', fontSize: 13 }}>No classes yet</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Skills */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 12 }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {course.skills.map(s => (
                <span key={s} style={{ padding: '4px 10px', background: 'var(--ember-soft)', color: 'var(--ember)', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>{s}</span>
              ))}
            </div>
          </div>
          {/* Outcomes */}
          <div className="panel" style={{ padding: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mute)', marginBottom: 12 }}>Learning Outcomes</div>
            {course.outcomes.map((o, i) => (
              <div key={i} style={{ fontSize: 13, padding: '6px 0', borderBottom: '1px solid var(--line-2)', display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--ember)', fontWeight: 700, flexShrink: 0 }}>→</span> {o}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
