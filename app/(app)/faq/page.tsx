import { PageHeader } from '@/components/ui/PageHeader'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

const FAQ = [
  { q:'What is a microcredential?', a:'A microcredential is a short, focused learning unit that results in a verifiable digital credential. Unlike full degrees, microcredentials are targeted, stackable, and can be issued for specific skills or competencies.' },
  { q:'How are credentials issued?', a:'Lecturers enter scores and mark students as completed. The Secretariat then issues credentials through the Issue Credential wizard. Each credential is cryptographically signed and stored immutably.' },
  { q:'How can employers verify a credential?', a:'Each credential has a unique public verification URL (e.g. /verify/MCRED-BFH-2026-00482). Anyone with this URL can verify the credential instantly without requiring an account.' },
  { q:'Can a credential be revoked?', a:'Yes. Admin and Developer roles can revoke credentials. Revoked credentials remain in the log and are clearly marked as revoked on the public verification page. The reason for revocation is recorded.' },
  { q:'What is the Learner Wallet?', a:'The Learner Wallet is a secure personal space where students can view all their credentials, share verification links, and download PDFs. Students log in with their student email.' },
  { q:'How does the audit log work?', a:'Every action in the CMS is automatically recorded in the immutable Log. Entries cannot be edited or deleted. Admins can export the log for compliance purposes.' },
  { q:'What EQF levels are supported?', a:'M-CRED supports EQF levels 3–8, matching the Swiss qualifications framework. EQF level and ECTS credits are stored on each credential.' },
  { q:'Can I import students in bulk?', a:'Yes. The Secretariat can import students via CSV. The required format is: first_name, last_name, email, student_id, class_id.' },
]

export default async function FaqPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div style={{ maxWidth:720 }}>
      <PageHeader title="FAQ" subtitle="Frequently asked questions about M-CRED."/>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {FAQ.map((item, i) => (
          <div key={i} className="panel" style={{ padding:'20px 24px' }}>
            <div style={{ fontSize:15, fontWeight:600, marginBottom:8 }}>{item.q}</div>
            <div style={{ fontSize:13, color:'var(--ink-3)', lineHeight:1.6 }}>{item.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
