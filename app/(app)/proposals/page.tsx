import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'

const PROPOSALS = [
  { title:'AI in Healthcare Management', dept:'ICT', eqf:6, ects:4, submitted:'2026-05-12', status:'pending', notes:'New interdisciplinary course combining AI tools with healthcare workflows.' },
  { title:'Circular Economy Fundamentals', dept:'Business', eqf:5, ects:3, submitted:'2026-05-11', status:'pending', notes:'Covers lifecycle assessment, material flows, and Swiss regulatory context.' },
  { title:'Advanced Data Visualisation', dept:'ICT', eqf:5, ects:3, submitted:'2026-04-28', status:'revoked', notes:'Admin feedback: overlaps with existing Data Analytics for Business course.' },
]

export default async function ProposalsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div style={{ maxWidth:800 }}>
      <PageHeader title="Course Proposals" subtitle="Propose new courses for review and approval by an Admin."
        actions={<button className="btn btn-ember">+ New Proposal</button>}/>
      {PROPOSALS.map((p,i) => (
        <div key={i} className="panel" style={{ padding:'22px 24px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <div>
              <div style={{ fontSize:17, fontWeight:600, marginBottom:4 }}>{p.title}</div>
              <div style={{ fontSize:12, color:'var(--mute)' }}>{p.dept} · EQF {p.eqf} · {p.ects} ECTS · Submitted {p.submitted}</div>
            </div>
            <StatusPill status={p.status === 'pending' ? 'pending' : 'revoked'}/>
          </div>
          <div style={{ fontSize:13, color:'var(--mute)', lineHeight:1.6, marginBottom:14 }}>{p.notes}</div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-ghost btn-sm">Edit</button>
            {p.status === 'pending' && <button className="btn btn-ghost btn-sm" style={{ color:'var(--ember)' }}>Withdraw</button>}
          </div>
        </div>
      ))}
    </div>
  )
}
