'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'

export default function NewStudentPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', studentNumber:'', password:'' })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/students', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form),
    })
    if (res.ok) { const s = await res.json(); router.push(`/students/${s.id}`) }
    else { setSaving(false); alert('Failed to add student') }
  }

  return (
    <div style={{ maxWidth:560 }}>
      <PageHeader title="Add Student" subtitle="Add a new student to your institution."/>
      <form onSubmit={handleSubmit}>
        <div className="panel" style={{ padding:28, marginBottom:20 }}>
          <div className="field-row">
            <div className="field" style={{ margin:0 }}>
              <label>First Name *</label>
              <input required value={form.firstName} onChange={e=>set('firstName',e.target.value)} placeholder="Sarah"/>
            </div>
            <div className="field" style={{ margin:0 }}>
              <label>Last Name *</label>
              <input required value={form.lastName} onChange={e=>set('lastName',e.target.value)} placeholder="Keller"/>
            </div>
          </div>
          <div className="field">
            <label>Email Address *</label>
            <input type="email" required value={form.email} onChange={e=>set('email',e.target.value)} placeholder="sarah.keller@student.bfh.ch"/>
          </div>
          <div className="field">
            <label>Student Number</label>
            <input value={form.studentNumber} onChange={e=>set('studentNumber',e.target.value)} placeholder="STU-2026-001 (auto-generated if empty)"/>
          </div>
          <div className="field">
            <label>Temporary Password (for wallet access)</label>
            <input type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="Student will be asked to change this"/>
          </div>
          <div style={{ padding:'12px 14px', background:'var(--paper-2)', border:'1px solid var(--line)', borderRadius:8, fontSize:12, color:'var(--mute)' }}>
            The student will receive a wallet invitation email and can log in at <strong>/wallet</strong> to view their credentials.
          </div>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button type="submit" className="btn btn-ember" disabled={saving}>{saving?'Saving…':'Add Student'}</button>
          <button type="button" className="btn btn-ghost" onClick={()=>router.back()}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
