import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect('/login')
  if (!['admin','developer'].includes(session.user.role)) redirect('/dashboard')

  const settings = [
    { section:'Credential Rules', items:[
      { label:'Default Credential Validity', value:'3 years', type:'select', options:['1 year','2 years','3 years','5 years','No expiry'] },
      { label:'Require Score for Issuance', value:'Yes', type:'select', options:['Yes','No'] },
      { label:'Auto-expire Credentials', value:'Yes', type:'select', options:['Yes','No'] },
    ]},
    { section:'Notifications', items:[
      { label:'Email on Credential Issued', value:'Yes', type:'select', options:['Yes','No'] },
      { label:'Email on Credential Revoked', value:'Yes', type:'select', options:['Yes','No'] },
      { label:'Email on Verification', value:'No', type:'select', options:['Yes','No'] },
    ]},
    { section:'Platform', items:[
      { label:'Default Language', value:'English', type:'select', options:['English','German','French'] },
      { label:'Date Format', value:'DD/MM/YYYY', type:'select', options:['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'] },
      { label:'Timezone', value:'Europe/Zurich', type:'select', options:['Europe/Zurich','Europe/London','UTC'] },
    ]},
  ]

  return (
    <div style={{ maxWidth:720 }}>
      <PageHeader title="Settings" subtitle="Platform-wide configuration for your institution."
        actions={<button className="btn btn-ember">Save Settings</button>}/>
      {settings.map(({ section, items }) => (
        <div key={section} className="panel" style={{ padding:28, marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:20 }}>{section}</div>
          {items.map(item => (
            <div key={item.label} className="field">
              <label>{item.label}</label>
              <select defaultValue={item.value}>
                {item.options.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
