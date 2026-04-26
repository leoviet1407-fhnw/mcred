import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getCredentialById, getVerificationsByCredential } from '@/lib/data'
import { StatusPill } from '@/components/ui/StatusPill'
import { formatDate, formatDateTime } from '@/lib/utils'
import Link from 'next/link'

export default async function CredentialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const [cred, verifications] = await Promise.all([
    getCredentialById(id),
    getVerificationsByCredential(id),
  ])
  if (!cred || cred.institutionId !== session.user.institutionId) notFound()

  const canRevoke = ['admin','developer'].includes(session.user.role) && cred.status === 'issued'
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/verify/${cred.credentialId}`

  return (
    <div>
      <Link href="/credentials" className="back-btn">← Back to Credentials</Link>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, gap:20 }}>
        <div>
          <div style={{ fontFamily:'monospace', fontSize:11, color:'var(--mute)', marginBottom:8 }}>{cred.credentialId}</div>
          <h1 style={{ fontSize:32, fontWeight:700, letterSpacing:'-0.025em', marginBottom:6 }}>{cred.courseTitle}</h1>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <StatusPill status={cred.status}/>
            <span style={{ fontSize:13, color:'var(--mute)' }}>Issued to {cred.studentName}</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:10, flexShrink:0 }}>
          <Link href={verifyUrl} target="_blank" className="btn btn-ghost btn-sm">🔗 View Public Verification</Link>
          <button className="btn btn-ghost btn-sm" onClick={async()=>{await navigator.clipboard.writeText(verifyUrl)}}>Copy Link</button>
          {canRevoke && (
            <button className="btn btn-sm" style={{ background:'var(--ember)', color:'#fff' }}>Revoke</button>
          )}
        </div>
      </div>

      {cred.status === 'revoked' && (
        <div style={{ padding:'14px 18px', background:'var(--ember-soft)', border:'1px solid rgba(200,66,30,.2)', borderRadius:10, marginBottom:24, fontSize:13 }}>
          <strong style={{ color:'var(--ember)' }}>Credential Revoked</strong>
          {cred.revokedAt && <span style={{ color:'var(--mute)' }}> on {formatDate(cred.revokedAt)}</span>}
          {cred.revokedReason && <div style={{ color:'var(--mute)', marginTop:4 }}>{cred.revokedReason}</div>}
        </div>
      )}

      {/* Credential preview */}
      <div style={{ background:'var(--ink)', borderRadius:16, padding:32, color:'var(--paper)', marginBottom:24 }}>
        <div style={{ fontSize:10, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(246,243,236,.5)', marginBottom:6 }}>{cred.institutionName}</div>
        <div style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.02em', marginBottom:4 }}>{cred.courseTitle}</div>
        <div style={{ fontSize:14, color:'rgba(246,243,236,.6)', marginBottom:24 }}>Microcredential Certificate · EQF {cred.eqfLevel} · {cred.ects} ECTS</div>
        <div style={{ fontSize:12, color:'rgba(246,243,236,.4)', marginBottom:4 }}>Awarded to</div>
        <div style={{ fontSize:22, fontWeight:600, marginBottom:2 }}>{cred.studentName}</div>
        <div style={{ fontSize:13, color:'rgba(246,243,236,.5)' }}>{cred.studentEmail}</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Details */}
          <div className="panel" style={{ padding:24 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Credential Details</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[
                ['Credential ID', cred.credentialId, true],
                ['Student', cred.studentName, false],
                ['Student Email', cred.studentEmail, true],
                ['Issued By', cred.issuedByName, false],
                ['Issue Date', formatDate(cred.issuedAt), false],
                ['Expiry Date', cred.expiresAt ? formatDate(cred.expiresAt) : 'No expiry', false],
                ['EQF Level', String(cred.eqfLevel), false],
                ['ECTS Credits', String(cred.ects), false],
              ].map(([l, v, mono]) => (
                <div key={String(l)} style={{ padding:'12px 14px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8 }}>
                  <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)', marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:13, fontWeight:500, fontFamily: mono ? 'monospace' : undefined, wordBreak:'break-all' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="panel" style={{ padding:20 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Validated Skills</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {cred.skills.map(s => (
                <span key={s} style={{ padding:'4px 10px', background:'var(--ember-soft)', color:'var(--ember)', borderRadius:999, fontSize:12, fontWeight:500 }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Outcomes */}
          <div className="panel" style={{ padding:20 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Learning Outcomes</div>
            {cred.outcomes.map((o, i) => (
              <div key={i} style={{ fontSize:13, padding:'6px 0', borderBottom:'1px solid var(--line-2)', display:'flex', gap:8 }}>
                <span style={{ color:'var(--ember)', fontWeight:700, flexShrink:0 }}>→</span> {o}
              </div>
            ))}
          </div>
        </div>

        {/* Verification history */}
        <div>
          <div className="panel" style={{ padding:20 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Verification History</div>
            <div style={{ fontSize:12, color:'var(--mute)', marginBottom:14 }}>{verifications.length} verification{verifications.length !== 1 ? 's' : ''} recorded</div>
            {verifications.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {verifications.slice(-10).reverse().map((v, i) => (
                  <div key={v.id} style={{ padding:'8px 0', borderBottom:'1px solid var(--line-2)', fontSize:12 }}>
                    <div style={{ fontWeight:500, marginBottom:2 }}>Verification #{verifications.length - i}</div>
                    <div style={{ color:'var(--mute)', fontFamily:'monospace' }}>{formatDateTime(v.verifiedAt)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color:'var(--mute)', fontSize:12 }}>No verifications recorded yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
