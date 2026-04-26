import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { BrandLogo } from '@/components/ui/BrandLogo'
import Link from 'next/link'

export default async function HomePage() {
  const session = await auth()
  if (session) {
    if (session.user.role === 'student') redirect('/wallet')
    redirect('/dashboard')
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--ink)', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'20px 48px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <BrandLogo size={30} textColor="var(--paper)" textSize={18}/>
        <div style={{ display:'flex', gap:12 }}>
          <Link href="/verify/MCRED-BFH-2026-00482" className="btn btn-ghost" style={{ borderColor:'rgba(246,243,236,.2)', color:'var(--paper)' }}>Verify a Credential</Link>
          <Link href="/login" className="btn" style={{ background:'var(--ember)', color:'#fff' }}>Sign in</Link>
        </div>
      </div>

      <div style={{ flex:1, display:'grid', placeItems:'center', padding:'60px 48px' }}>
        <div style={{ textAlign:'center', maxWidth:760 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', background:'rgba(200,66,30,.2)', borderRadius:999, fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--ember)', marginBottom:28 }}>
            Swiss Microcredential Infrastructure
          </div>
          <h1 style={{ fontSize:'clamp(48px,7vw,88px)', fontWeight:800, letterSpacing:'-0.035em', lineHeight:.93, color:'var(--paper)', marginBottom:24 }}>
            Issue. Store.<br/><em style={{ fontStyle:'italic', color:'var(--ember)' }}>Verify.</em>
          </h1>
          <p style={{ fontSize:18, lineHeight:1.6, color:'rgba(246,243,236,.6)', maxWidth:520, margin:'0 auto 40px' }}>
            Digital credential infrastructure for Swiss institutions — issue tamper-evident microcredentials, let learners own their achievements, and let employers verify instantly.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/login" className="btn btn-lg" style={{ background:'var(--ember)', color:'#fff' }}>Get Started</Link>
            <Link href="/verify/MCRED-BFH-2026-00482" className="btn btn-lg" style={{ borderColor:'rgba(246,243,236,.2)', color:'var(--paper)', background:'transparent', border:'1px solid rgba(246,243,236,.2)' }}>
              See a Live Credential
            </Link>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, marginTop:80, paddingTop:40, borderTop:'1px solid rgba(246,243,236,.1)' }}>
            {[
              ['482+', 'Credentials Issued', 'Across 4 active courses at BFH'],
              ['3s', 'Verification Time', 'Instant, tamper-evident, public'],
              ['100%', 'Immutable Log', 'Every action is permanently recorded'],
            ].map(([n, l, d]) => (
              <div key={l}>
                <div style={{ fontSize:44, fontWeight:800, letterSpacing:'-0.03em', color:'var(--paper)', marginBottom:4 }}>{n}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'rgba(246,243,236,.7)', marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:12, color:'rgba(246,243,236,.4)' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding:'20px 48px', textAlign:'center', fontSize:12, color:'rgba(246,243,236,.3)', borderTop:'1px solid rgba(246,243,236,.08)' }}>
        M-CRED · Digital Credential Platform for Swiss Institutions · Built with Next.js + Vercel Blob
      </div>
    </div>
  )
}
