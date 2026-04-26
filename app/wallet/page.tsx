import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getCredentialsByStudent } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { StatusPill } from '@/components/ui/StatusPill'
import { BrandLogo } from '@/components/ui/BrandLogo'
import Link from 'next/link'

export default async function WalletPage() {
  const session = await auth()
  if (!session) redirect('/login?type=student')

  const creds = await getCredentialsByStudent(session.user.id)
  const issued = creds.filter(c => c.status === 'issued')

  return (
    <div style={{ minHeight:'100vh', background:'var(--paper)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:'rgba(251,248,240,.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--line)', padding:'0 40px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:50 }}>
        <BrandLogo size={28} textColor="var(--ink)" textSize={16}/>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:14, fontWeight:500 }}>{session.user.name}</div>
            <div style={{ fontSize:11, color:'var(--mute)', textTransform:'uppercase', letterSpacing:'.08em' }}>Learner Wallet</div>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button className="btn btn-ghost btn-sm">Sign out</button>
          </form>
        </div>
      </div>

      <div style={{ padding:40, maxWidth:1100, margin:'0 auto', width:'100%', flex:1 }}>
        {/* KPIs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, border:'1px solid var(--line)', borderRadius:12, overflow:'hidden', background:'var(--white)', marginBottom:40 }}>
          {[['Credentials', issued.length], ['Verified', creds.reduce((a,c)=>a+c.verificationCount,0)], ['Institutions', new Set(creds.map(c=>c.institutionId)).size]].map(([l,v])=>(
            <div key={String(l)} style={{ padding:'22px 24px', borderRight:'1px solid var(--line)' }}>
              <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:10 }}>{l}</div>
              <div style={{ fontSize:36, fontWeight:700, letterSpacing:'-0.02em' }}>{v}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize:24, fontWeight:600, letterSpacing:'-0.02em', marginBottom:20 }}>My Credentials</h2>

        {creds.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 24px', color:'var(--mute)' }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🎓</div>
            <div style={{ fontSize:17, fontWeight:500, marginBottom:6 }}>No credentials yet</div>
            <div style={{ fontSize:14 }}>Your digital credentials will appear here once issued by your institution.</div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
            {creds.map(c => (
              <div key={c.id} style={{ background:'var(--white)', border:'1px solid var(--line)', borderRadius:14, overflow:'hidden' }}>
                <div style={{ background:'var(--paper)', padding:'20px', display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid var(--line)' }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--ember)', display:'grid', placeItems:'center', fontSize:20, fontWeight:700, color:'#fff', fontStyle:'italic', flexShrink:0 }}>{c.courseTitle[0]}</div>
                  <div style={{ fontSize:11, fontWeight:500, color:'var(--ink-3)', letterSpacing:'.04em' }}>{c.institutionName}</div>
                </div>
                <div style={{ padding:'18px 20px' }}>
                  <h4 style={{ fontFamily:'var(--sans)', fontSize:17, fontWeight:500, letterSpacing:'-0.01em', marginBottom:4 }}>{c.courseTitle}</h4>
                  <div style={{ fontSize:11, color:'var(--mute)', marginBottom:12 }}>Issued {formatDate(c.issuedAt)} · EQF {c.eqfLevel}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <StatusPill status={c.status}/>
                    <div style={{ display:'flex', gap:6 }}>
                      <Link href={`/verify/${c.credentialId}`} target="_blank" className="btn btn-ghost btn-sm">Verify</Link>
                      <button className="btn btn-ghost btn-sm">Share</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
