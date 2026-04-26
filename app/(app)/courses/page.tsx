import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCoursesByInstitution } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'
import Link from 'next/link'

const COLOR_MAP: Record<string, string> = {
  ember: 'var(--ember)', sage: 'var(--sage)', amber: 'var(--amber)', ink: 'var(--ink)',
}

export default async function CoursesPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role
  const all = await getCoursesByInstitution(session.user.institutionId)
  // Lecturers see only active courses (in real app would filter by assignment)
  const courses = role === 'lecturer' ? all.filter(c => c.status === 'active') : all

  const canCreate = ['secretariat', 'admin', 'developer'].includes(role)

  return (
    <div>
      <PageHeader
        title={role === 'lecturer' ? 'My Courses' : 'Courses'}
        subtitle="Official courses used as the basis for classes and credentials."
        actions={
          canCreate
            ? <Link href="/courses/new" className="btn btn-ember">+ Add Course</Link>
            : <Link href="/proposals" className="btn btn-ghost btn-sm">+ Propose Course</Link>
        }
      />

      <div className="course-grid">
        {courses.map(c => (
          <Link key={c.id} href={`/courses/${c.id}`} className="course-card">
            <div className={`course-cover ${c.color}`}>
              <div className="seal" style={{ background: COLOR_MAP[c.color] ?? 'var(--ember)' }}>
                {c.title[0]}
              </div>
            </div>
            <div className="course-info">
              <h4>{c.title}</h4>
              <p>{c.description.slice(0, 90)}…</p>
              <div className="course-meta">
                <span>{c.department} · EQF {c.eqfLevel} · {c.ects} ECTS</span>
                <StatusPill status={c.status} />
              </div>
            </div>
          </Link>
        ))}
        {canCreate && (
          <Link href="/courses/new" className="add-card">
            <div className="plus">+</div>
            <h4>Add Course</h4>
            <p>Create a new official course</p>
          </Link>
        )}
      </div>
    </div>
  )
}
