import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getInstitution } from '@/lib/data'
import { PageHeader } from '@/components/ui/PageHeader'

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect('/login')
  const institution = await getInstitution(session.user.institutionId)
  const canEdit = ['admin','developer'].includes(session.user.role)

  return (
    <div style={{ maxWidth:720 }}>
      <PageHeader title="Institution Profile" subtitle="Your institution's identity on the M-CRED platform."
        actions={canEdit ? <button className="btn btn-ember">Save Changes</button> : undefined}/>
      <div className="panel" style={{ padding:28 }}>
        {institution ? (
          <>
            {[
              ['Institution Name', institution.name], ['Abbreviation', institution.abbr],
              ['Country', institution.country], ['Website', institution.website??'—'],
              ['Email', institution.email??'—'], ['Location', institution.location??'—'],
              ['Accreditation', institution.accreditation??'—'], ['Tagline', institution.tagline??'—'],
              ['Credential URL Base', institution.credentialUrlBase],
            ].map(([l,v]) => (
              <div key={String(l)} className="field" style={{ marginBottom:16 }}>
                <label>{l}</label>
                {canEdit
                  ? <input defaultValue={String(v)} style={{ border:'1px solid var(--line)', borderRadius:8, padding:'10px 14px', fontSize:14, width:'100%' }}/>
                  : <div style={{ padding:'10px 14px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8, fontSize:14 }}>{v}</div>}
              </div>
            ))}
          </>
        ) : <div style={{ color:'var(--mute)', fontSize:13 }}>Institution data not found. Run /api/seed to initialise.</div>}
      </div>
    </div>
  )
}
