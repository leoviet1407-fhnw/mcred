'use client'
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BrandLogo } from '@/components/ui/BrandLogo'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState<'staff'|'student'>('staff')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const result = await signIn('credentials', {
      email, password, userType, redirect: false,
    })
    if (result?.ok) {
      router.push(userType === 'student' ? '/wallet' : (params.get('callbackUrl') ?? '/dashboard'))
    } else {
      setError('Invalid email or password.'); setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'100vh', display:'grid', placeItems:'center', background:'var(--paper)' }}>
      <div style={{ width:'100%', maxWidth:420, padding:'0 24px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
            <BrandLogo size={36} textColor="var(--ink)" textSize={22}/>
          </div>
          <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:'-0.02em', marginBottom:6 }}>Sign in to M-CRED</h1>
          <p style={{ fontSize:14, color:'var(--mute)' }}>Digital credential platform for Swiss institutions</p>
        </div>

        <div style={{ display:'flex', gap:4, padding:4, background:'var(--white)', border:'1px solid var(--line)', borderRadius:10, marginBottom:24 }}>
          {(['staff','student'] as const).map(t => (
            <button key={t} onClick={() => setUserType(t)}
              style={{ flex:1, padding:'8px', borderRadius:7, fontSize:13, fontWeight:500, background:userType===t?'var(--ink)':'transparent', color:userType===t?'var(--paper)':'var(--mute)', border:'none', cursor:'pointer', transition:'all .15s' }}>
              {t === 'staff' ? 'Institution Staff' : 'Learner / Student'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ background:'var(--white)', border:'1px solid var(--line)', borderRadius:12, padding:28 }}>
          {error && <div style={{ padding:'10px 14px', background:'var(--ember-soft)', color:'var(--ember)', borderRadius:8, fontSize:13, marginBottom:16 }}>{error}</div>}
          <div className="field">
            <label>Email address</label>
            <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder={userType==='staff'?'admin@bfh.ch':'sarah.keller@student.bfh.ch'} autoComplete="email"/>
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"/>
          </div>
          <button type="submit" className="btn btn-ember" style={{ width:'100%', justifyContent:'center', marginTop:8 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div style={{ marginTop:24, padding:16, background:'var(--white)', border:'1px solid var(--line)', borderRadius:10, fontSize:12, color:'var(--mute)' }}>
          <div style={{ fontWeight:600, marginBottom:8, fontSize:11, letterSpacing:'.08em', textTransform:'uppercase' }}>Demo Credentials</div>
          {[
            ['Admin','admin@bfh.ch','password123'],
            ['Secretariat','secretariat@bfh.ch','password123'],
            ['Lecturer','a.steiner@bfh.ch','password123'],
            ['Developer','dev@m-cred.ch','password123'],
            ['Student','sarah.keller@student.bfh.ch','student123'],
          ].map(([role, em, pw]) => (
            <div key={role} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:'1px solid var(--line-2)', cursor:'pointer' }}
              onClick={() => { setEmail(em); setPassword(pw); setUserType(role==='Student'?'student':'staff') }}>
              <span style={{ fontWeight:500, color:'var(--ink)' }}>{role}</span>
              <span style={{ fontFamily:'monospace', color:'var(--mute)' }}>{em}</span>
            </div>
          ))}
          <div style={{ marginTop:8, fontSize:11 }}>Click any row to auto-fill. Run <code style={{background:'var(--paper)',padding:'1px 4px',borderRadius:3}}>/api/seed</code> first to seed data.</div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
