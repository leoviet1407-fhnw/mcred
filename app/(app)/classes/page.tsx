import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getClassesByInstitution } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function ClassesPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const classes = await getClassesByInstitution(session.user.institutionId)
  const canCreate = ['secretariat','admin','developer'].includes(session.user.role)

  return (
    <div>
      <PageHeader
        title="Classes"
        subtitle="Manage class cohorts linked to official courses."
        actions={canCreate ? <Link href="/classes/new" className="btn btn-ember">+ Add Class</Link> : undefined}
      />
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Class Name</th><th>Course</th><th>Lecturer</th><th>Period</th><th>Students</th><th>Mode</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {classes.map(cl => (
              <tr key={cl.id}>
                <td className="fw">{cl.name}</td>
                <td style={{maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',fontSize:13}}>{cl.courseTitle}</td>
                <td style={{fontSize:13}}>{cl.lecturerName??'—'}</td>
                <td className="mono">{formatDate(cl.startDate)} – {formatDate(cl.endDate)}</td>
                <td>{cl.studentCount}</td>
                <td>{cl.mode}</td>
                <td><StatusPill status={cl.status}/></td>
                <td><Link href={`/classes/${cl.id}`} className="btn btn-ghost btn-sm">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
