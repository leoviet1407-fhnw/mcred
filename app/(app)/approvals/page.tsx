import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'

export default async function ApprovalsPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (!['admin','developer'].includes(session.user.role)) redirect('/dashboard')

  const PENDING = [
    { title:'AI in Healthcare Management', by:'Dr. Priya Sharma', dept:'ICT', eqf:6, ects:4, notes:'New interdisciplinary course combining AI tools with healthcare workflows.' },
    { title:'Circular Economy Fundamentals', by:'Dr. Klaus Brönnimann', dept:'Business', eqf:5, ects:3, notes:'Covers lifecycle assessment, material flows, and Swiss regulatory context.' },
  ]

  return (
    <div style={{ maxWidth:800 }}>
      <PageHeader title="Course Approvals" subtitle="Review and approve course proposals submitted by lecturers."/>
      <div style={{ padding:'12px 16px', background:'var(--ember-soft)', border:'1px solid rgba(200,66,30,.2)', borderRadius:10, marginBottom:20, fontSize:13, color:'var(--ember)' }}>
        <strong>{PENDING.length} proposals</strong> awaiting your review.
      </div>
      {PENDING.map((p,i) => (
        <div key={i} className="panel" style={{ padding:'22px 24px', marginBottom:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <div>
              <div style={{ fontSize:17, fontWeight:600, marginBottom:4 }}>{p.title}</div>
              <div style={{ fontSize:12, color:'var(--mute)' }}>Proposed by {p.by} · {p.dept} · EQF {p.eqf} · {p.ects} ECTS</div>
            </div>
          </div>
          <div style={{ fontSize:13, color:'var(--mute)', lineHeight:1.6, marginBottom:14 }}>{p.notes}</div>
          <div style={{ display:'flex', gap:8 }}>
            <button className="btn btn-sm" style={{ background:'var(--sage)', color:'#fff' }}>✓ Approve</button>
            <button className="btn btn-ghost btn-sm">Request Changes</button>
            <button className="btn btn-ghost btn-sm" style={{ color:'var(--ember)' }}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  )
}
