import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'

export default async function LayoutPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (!['admin','developer'].includes(session.user.role)) redirect('/dashboard')

  const templates = [
    { id:'clean', name:'Clean White', desc:'Minimal white certificate with ember accent. Professional and modern.' },
    { id:'bold', name:'Bold Dark', desc:'Dark background with strong typography. High contrast and striking.' },
    { id:'warm', name:'Warm Ember', desc:'Warm beige tones with ember red. Approachable and premium.' },
  ]

  return (
    <div style={{ maxWidth:720 }}>
      <PageHeader title="Certificate Layout" subtitle="Choose and configure the default certificate template for your institution."
        actions={<button className="btn btn-ember">Save Layout</button>}/>
      <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:24 }}>
        {templates.map(t => (
          <div key={t.id} style={{ padding:'20px 24px', border:`2px solid ${t.id==='clean'?'var(--ember)':'var(--line)'}`, borderRadius:12, cursor:'pointer', display:'flex', alignItems:'center', gap:20, background:t.id==='clean'?'var(--ember-soft)':'var(--white)' }}>
            <div style={{ width:48, height:48, borderRadius:10, background:t.id==='clean'?'#fff':t.id==='bold'?'var(--ink)':'var(--paper)', border:'1px solid var(--line)', flexShrink:0 }}/>
            <div>
              <div style={{ fontWeight:600, marginBottom:2 }}>{t.name}</div>
              <div style={{ fontSize:12, color:'var(--mute)' }}>{t.desc}</div>
            </div>
            {t.id==='clean' && <span style={{ marginLeft:'auto', fontSize:11, fontWeight:600, color:'var(--ember)', background:'var(--ember-soft)', padding:'3px 10px', borderRadius:999, border:'1px solid rgba(200,66,30,.2)' }}>Active</span>}
          </div>
        ))}
      </div>
      <div className="panel" style={{ padding:28 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:20 }}>Layout Options</div>
        {[['Show QR Code','Yes'],['Show Institution Logo','Yes'],['Show EQF Level','Yes'],['Show ECTS Credits','Yes'],['Show Skills Section','Yes'],['Show Learning Outcomes','No']].map(([l,v])=>(
          <div key={String(l)} className="field">
            <label>{l}</label>
            <select defaultValue={String(v)}><option>Yes</option><option>No</option></select>
          </div>
        ))}
      </div>
    </div>
  )
}
