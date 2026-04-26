import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'

export default async function DesignPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (!['admin','developer'].includes(session.user.role)) redirect('/dashboard')

  return (
    <div style={{ maxWidth:720 }}>
      <PageHeader title="Design" subtitle="Customise the visual identity of your institution's credentials."
        actions={<button className="btn btn-ember">Save Design</button>}/>
      <div className="panel" style={{ padding:28, marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:20 }}>Colour Palette</div>
        {[['Primary Colour (Credential Accent)','#C8421E'],['Secondary Colour','#3C6E47'],['Background','#F6F3EC']].map(([l,v])=>(
          <div key={String(l)} className="field">
            <label>{l}</label>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <input type="color" defaultValue={String(v)} style={{ width:48, height:40, border:'1px solid var(--line)', borderRadius:8, padding:4, cursor:'pointer' }}/>
              <input defaultValue={String(v)} style={{ fontFamily:'monospace', border:'1px solid var(--line)', borderRadius:8, padding:'10px 14px', fontSize:14, flex:1 }}/>
            </div>
          </div>
        ))}
      </div>
      <div className="panel" style={{ padding:28, marginBottom:20 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:20 }}>Logo</div>
        <div style={{ border:'2px dashed var(--line)', borderRadius:12, padding:40, textAlign:'center', cursor:'pointer', background:'var(--paper-2)' }}>
          <div style={{ fontSize:32, marginBottom:12 }}>🏛️</div>
          <div style={{ fontSize:14, fontWeight:500, marginBottom:6 }}>Upload Institution Logo</div>
          <div style={{ fontSize:12, color:'var(--mute)', marginBottom:16 }}>PNG, SVG — max 2 MB · Appears on credentials and the institution profile</div>
          <button className="btn btn-ghost btn-sm">Browse Files</button>
        </div>
      </div>
      <div className="panel" style={{ padding:28 }}>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:20 }}>Typography</div>
        <div className="field">
          <label>Primary Font</label>
          <select defaultValue="Plus Jakarta Sans">
            {['Plus Jakarta Sans','Inter','DM Sans','IBM Plex Sans','Source Sans 3'].map(f=><option key={f}>{f}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
