import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLog } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatDateTime } from '@/lib/utils'

export default async function SystemLogsPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role !== 'developer') redirect('/dashboard')

  const log = await getLog()
  const levelColor: Record<string,string> = { INFO:'var(--sage)', WARN:'var(--amber)', ERROR:'var(--ember)' }

  return (
    <div>
      <PageHeader title="System Logs" subtitle="Full audit trail of platform events and system activity."
        actions={<button className="btn btn-ghost btn-sm">Export Logs</button>}/>
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Level</th><th>Action</th><th>Object</th><th>User</th><th>Timestamp</th></tr></thead>
          <tbody>
            {log.map(e => {
              const level = e.status === 'success' ? 'INFO' : e.status === 'pending' ? 'WARN' : 'ERROR'
              return (
                <tr key={e.id}>
                  <td><span style={{ fontFamily:'monospace', fontSize:10, fontWeight:700, color:levelColor[level], background:level==='INFO'?'var(--sage-soft)':level==='WARN'?'var(--amber-soft)':'var(--ember-soft)', padding:'2px 8px', borderRadius:4 }}>{level}</span></td>
                  <td style={{ fontFamily:'monospace', fontSize:12 }}>{e.action}</td>
                  <td style={{ fontSize:12, color:'var(--mute)' }}>{e.objectName}</td>
                  <td style={{ fontSize:12, color:'var(--mute)' }}>{e.userEmail}</td>
                  <td style={{ fontSize:12, fontFamily:'monospace', color:'var(--mute)', whiteSpace:'nowrap' }}>{formatDateTime(e.createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
