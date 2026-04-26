import { getCredentialByCredentialId, appendVerification, saveCredential } from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { BrandLogo } from '@/components/ui/BrandLogo'
import { nanoid } from 'nanoid'
import Link from 'next/link'

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cred = await getCredentialByCredentialId(id)

  if (cred) {
    // Track verification server-side
    await appendVerification({ id: nanoid(), credentialId: cred.id, verifiedAt: new Date().toISOString() })
    await saveCredential({ ...cred, verificationCount: cred.verificationCount + 1 })
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--paper)', display:'flex', flexDirection:'column' }}>
      {/* Header */}
      <div style={{ background:'var(--ink)', padding:'16px 48px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/"><BrandLogo size={28} textColor="var(--paper)" textSize={16}/></Link>
        <span style={{ fontSize:12, color:'rgba(246,243,236,.5)', letterSpacing:'.08em', textTransform:'uppercase' }}>Credential Verification</span>
      </div>

      <div style={{ flex:1, display:'grid', placeItems:'center', padding:'48px 24px' }}>
        <div style={{ maxWidth:560, width:'100%' }}>
          {!cred ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:64, marginBottom:20 }}>❌</div>
              <h1 style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.025em', marginBottom:8, color:'var(--ember)' }}>Credential Not Found</h1>
              <p style={{ fontSize:15, color:'var(--mute)', marginBottom:24 }}>
                No credential found for ID: <code style={{ fontFamily:'monospace', background:'var(--white)', padding:'2px 6px', borderRadius:4 }}>{id}</code>
              </p>
              <Link href="/" className="btn btn-ghost">Return to Homepage</Link>
            </div>
          ) : (
            <div>
              {/* Status banner */}
              <div style={{ padding:'16px 20px', borderRadius:10, marginBottom:24, display:'flex', alignItems:'center', gap:14, background: cred.status==='issued' ? 'var(--sage-soft)' : 'var(--ember-soft)', border:`1px solid ${cred.status==='issued'?'rgba(60,110,71,.2)':'rgba(200,66,30,.2)'}` }}>
                <div style={{ fontSize:28 }}>{cred.status==='issued' ? '✅' : '🚫'}</div>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color: cred.status==='issued' ? 'var(--sage)' : 'var(--ember)' }}>
                    {cred.status==='issued' ? 'Valid Credential' : cred.status==='revoked' ? 'Credential Revoked' : 'Credential Expired'}
                  </div>
                  <div style={{ fontSize:13, color:'var(--mute)' }}>
                    {cred.status==='issued' && `Issued ${formatDate(cred.issuedAt)} · Expires ${cred.expiresAt ? formatDate(cred.expiresAt) : 'Never'}`}
                    {cred.status==='revoked' && `Revoked ${cred.revokedAt ? formatDate(cred.revokedAt) : 'Unknown'}${cred.revokedReason ? ` · ${cred.revokedReason}` : ''}`}
                  </div>
                </div>
              </div>

              {/* Credential card */}
              <div style={{ background:'var(--ink)', borderRadius:16, padding:32, color:'var(--paper)', marginBottom:20 }}>
                <div style={{ fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(246,243,236,.5)', marginBottom:6 }}>{cred.institutionName}</div>
                <div style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>{cred.courseTitle}</div>
                <div style={{ fontSize:14, color:'rgba(246,243,236,.6)', marginBottom:28 }}>Microcredential Certificate · EQF {cred.eqfLevel} · {cred.ects} ECTS</div>
                <div style={{ fontSize:12, color:'rgba(246,243,236,.4)', marginBottom:4 }}>Awarded to</div>
                <div style={{ fontSize:22, fontWeight:600, marginBottom:4 }}>{cred.studentName}</div>
                <div style={{ fontSize:13, color:'rgba(246,243,236,.5)' }}>{cred.studentEmail}</div>
              </div>

              {/* Details grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:20 }}>
                {[
                  ['Credential ID', cred.credentialId],
                  ['Issued By', cred.issuedByName],
                  ['Issue Date', formatDate(cred.issuedAt)],
                  ['Expiry Date', cred.expiresAt ? formatDate(cred.expiresAt) : 'No expiry'],
                ].map(([l, v]) => (
                  <div key={l} style={{ padding:'14px 16px', background:'var(--white)', border:'1px solid var(--line)', borderRadius:8 }}>
                    <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:4 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:500, fontFamily: l==='Credential ID'?'monospace':undefined }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Skills */}
              {cred.skills.length > 0 && (
                <div style={{ padding:'16px 20px', background:'var(--white)', border:'1px solid var(--line)', borderRadius:10, marginBottom:12 }}>
                  <div style={{ fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:10 }}>Validated Skills</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {cred.skills.map(s => <span key={s} style={{ padding:'4px 10px', background:'var(--ember-soft)', color:'var(--ember)', borderRadius:999, fontSize:12, fontWeight:500 }}>{s}</span>)}
                  </div>
                </div>
              )}

              <div style={{ textAlign:'center', paddingTop:16, fontSize:12, color:'var(--mute)' }}>
                Verified by M-CRED · Verification #{cred.verificationCount + 1}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
