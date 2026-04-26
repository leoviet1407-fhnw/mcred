import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'

const INTEGRATIONS = [
  { name:'LinkedIn', desc:'Allow learners to add credentials to their LinkedIn profile.', status:'active', icon:'🔗' },
  { name:'Campusonline', desc:'Sync student and course data from Campusonline.', status:'active', icon:'🏛️' },
  { name:'Microsoft Teams', desc:'Send credential notifications directly via Teams.', status:'draft', icon:'💬' },
  { name:'Zapier', desc:'Automate credential workflows with Zapier triggers.', status:'draft', icon:'⚡' },
  { name:'REST API', desc:'Use the M-CRED REST API to integrate with your own systems.', status:'active', icon:'🛠️' },
  { name:'Webhook', desc:'Receive event-based notifications for credential lifecycle events.', status:'draft', icon:'📡' },
]

export default async function IntegrationsPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role !== 'developer') redirect('/dashboard')

  return (
    <div>
      <PageHeader title="Integrations" subtitle="Connect M-CRED with external platforms and services."/>
      {INTEGRATIONS.map(int => (
        <div key={int.name} className="panel" style={{ padding:'20px 24px', marginBottom:12, display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'var(--paper)', border:'1px solid var(--line)', display:'grid', placeItems:'center', fontSize:22, flexShrink:0 }}>{int.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:3 }}>{int.name}</div>
            <div style={{ fontSize:13, color:'var(--mute)' }}>{int.desc}</div>
          </div>
          <StatusPill status={int.status}/>
          <button className="btn btn-ghost btn-sm">{int.status==='active'?'Configure':'Connect'}</button>
        </div>
      ))}
    </div>
  )
}
