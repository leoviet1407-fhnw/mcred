import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'

const SCHEMA = `{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "MicrocredentialCertificate"],
  "issuer": "https://credentials.m-cred.ch/bfh",
  "credentialSubject": {
    "id": "did:example:learner",
    "achievement": {
      "type": "Microcredential",
      "name": "Digital Marketing Fundamentals",
      "eqfLevel": 5,
      "ects": 3,
      "skills": ["SEO Basics", "Campaign Analytics"],
      "outcomes": ["Understand digital marketing channels"]
    }
  }
}`

export default async function SchemaPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role !== 'developer') redirect('/dashboard')

  return (
    <div style={{ maxWidth:760 }}>
      <PageHeader title="Schema Import / Export" subtitle="Import or export credential schemas and data definitions."/>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        {['Import','Export'].map(dir => (
          <div key={dir} className="panel" style={{ padding:24 }}>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>{dir} Schema</div>
            <div style={{ fontSize:12, color:'var(--mute)', marginBottom:16, lineHeight:1.5 }}>
              {dir === 'Import' ? 'Upload a JSON or YAML credential schema to use as a template.' : 'Export current schemas and data for backup or migration.'}
            </div>
            {dir === 'Import' ? (
              <div style={{ border:'2px dashed var(--line)', borderRadius:10, padding:24, textAlign:'center', cursor:'pointer' }}>
                <div style={{ fontSize:24, marginBottom:8 }}>📁</div>
                <div style={{ fontSize:12, color:'var(--mute)' }}>Drop JSON / YAML here or <span style={{ color:'var(--ember)', cursor:'pointer' }}>browse</span></div>
              </div>
            ) : (
              ['Credential Schema (JSON)','Course Data (CSV)','All Platform Data (ZIP)'].map(f => (
                <button key={f} className="btn btn-ghost btn-sm" style={{ width:'100%', justifyContent:'space-between', marginBottom:8 }}>
                  <span>⬇ {f}</span>
                  <span style={{ fontFamily:'monospace', fontSize:10, color:'var(--mute)' }}>.{f.split('(')[1].replace(')','').toLowerCase()}</span>
                </button>
              ))
            )}
          </div>
        ))}
      </div>
      <div className="panel" style={{ padding:24 }}>
        <div style={{ fontSize:14, fontWeight:600, marginBottom:12 }}>Current Credential Schema</div>
        <pre style={{ fontFamily:'monospace', fontSize:11, background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8, padding:16, overflowX:'auto', color:'var(--ink-3)', lineHeight:1.7 }}>{SCHEMA}</pre>
      </div>
    </div>
  )
}
