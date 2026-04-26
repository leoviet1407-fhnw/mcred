import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUsersByInstitution } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'
import { RoleBadge } from '@/components/ui/RoleBadge'
import { formatDate, roleColor } from '@/lib/utils'

export default async function UsersPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (!['admin','developer'].includes(session.user.role)) redirect('/dashboard')

  const users = await getUsersByInstitution(session.user.institutionId)

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Manage who has access to the M-CRED CMS and what they can do."
        actions={<button className="btn btn-ember">+ Invite User</button>}
      />
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Department</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:10}}>
                    <div style={{width:34,height:34,borderRadius:'50%',background:roleColor(u.role),display:'grid',placeItems:'center',fontSize:13,fontWeight:600,color:'#fff',flexShrink:0}}>{u.name[0]}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:500}}>{u.name}</div>
                      <div style={{fontSize:11,color:'var(--mute)'}}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td><RoleBadge role={u.role}/></td>
                <td style={{color:'var(--mute)',fontSize:13}}>{u.department??'—'}</td>
                <td><StatusPill status={u.isActive?'active':'revoked'}/></td>
                <td style={{fontSize:12,color:'var(--mute)'}}>{u.lastLoginAt ? formatDate(u.lastLoginAt) : 'Never'}</td>
                <td>
                  <div className="actions-cell">
                    <button className="btn btn-ghost btn-sm">Change Role</button>
                    <button className="btn btn-ghost btn-sm" style={{color:'var(--ember)'}}>{u.isActive?'Deactivate':'Activate'}</button>
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
