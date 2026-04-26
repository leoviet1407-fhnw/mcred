import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getLog } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'
import { RoleBadge } from '@/components/ui/RoleBadge'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import type { Role } from '@/lib/types'

export default async function LogPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const role = session.user.role as Role
  const all = await getLog()

  let entries = all
  if (role === 'lecturer') entries = all.filter(e => e.userId === session.user.id || e.scope === 'lecturer')
  else if (role === 'secretariat') entries = all.filter(e => ['operational','lecturer'].includes(e.scope))

  const canExport = ['admin','developer'].includes(role)
  const showTech = role === 'developer'

  const typeColor: Record<string,string> = {
    Credential:'credential',Course:'course',Student:'student',
    User:'user',Class:'class',Settings:'settings',
    'Institution Profile':'institution-profile',Layout:'layout',Template:'template',
  }

  return (
    <div>
      <PageHeader
        title="Log"
        subtitle="Immutable audit trail of all institutional actions."
        actions={canExport ? <div style={{display:'flex',gap:10}}><button className="btn btn-ghost btn-sm">Export CSV</button><button className="btn btn-ghost btn-sm">Export PDF</button></div> : undefined}
      />

      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 16px', background:'var(--ink)', color:'var(--paper)', borderRadius:8, fontSize:12, marginBottom:20 }}>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', background:'var(--ember)', color:'#fff', padding:'2px 7px', borderRadius:3, flexShrink:0 }}>Immutable</span>
        Log entries cannot be edited, deleted, or cleared. This record is permanent and tamper-evident.
        {role === 'lecturer' && ' You are viewing entries related to your activity only.'}
        {role === 'secretariat' && ' You are viewing operational entries for courses, classes, students, and credentials.'}
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp</th><th>User</th><th>Role</th><th>Action</th>
              <th>Object Type</th><th>Object</th><th>Status</th>
              {showTech && <th>Session / IP</th>}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {entries.map(e => (
              <tr key={e.id}>
                <td style={{fontFamily:'monospace',fontSize:11,color:'var(--mute)',whiteSpace:'nowrap'}}>{formatDateTime(e.createdAt)}</td>
                <td>
                  <div style={{fontSize:13,fontWeight:500}}>{e.userName}</div>
                  <div style={{fontSize:11,color:'var(--mute)'}}>{e.userEmail}</div>
                </td>
                <td><RoleBadge role={e.userRole}/></td>
                <td style={{fontSize:13,fontWeight:500,whiteSpace:'nowrap'}}>{e.action}</td>
                <td><span className={`log-action-tag ${typeColor[e.objectType]??'settings'}`}>{e.objectType}</span></td>
                <td>
                  <div style={{fontSize:12,fontWeight:500,maxWidth:180,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{e.objectName}</div>
                  <div style={{fontSize:10,fontFamily:'monospace',color:'var(--mute)'}}>{e.objectId}</div>
                </td>
                <td><StatusPill status={e.status === 'success' ? 'active' : e.status === 'pending' ? 'pending' : 'revoked'}/></td>
                {showTech && <td style={{fontSize:10,fontFamily:'monospace',color:'var(--mute)'}}>{e.sessionId}<br/>{e.ipAddress}</td>}
                <td><Link href={`/log/${e.id}`} className="btn btn-ghost btn-sm">Detail</Link></td>
              </tr>
            ))}
            {entries.length === 0 && <tr><td colSpan={showTech ? 9 : 8} style={{textAlign:'center',padding:'40px',color:'var(--mute)'}}>No log entries found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
