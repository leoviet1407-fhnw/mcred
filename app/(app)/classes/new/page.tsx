'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import type { Course, User } from '@/lib/types'

export default function NewClassPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [courses, setCourses] = useState<Course[]>([])
  const [lecturers, setLecturers] = useState<User[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name:'', courseId: params.get('courseId') ?? '',
    lecturerId:'', lecturerName:'',
    startDate:'', endDate:'', mode:'Online', template:'clean',
  })

  useEffect(() => {
    fetch('/api/courses').then(r=>r.json()).then((c: Course[]) => setCourses(c.filter(x=>x.status==='active')))
    fetch('/api/users').then(r=>r.json()).then((u: User[]) => setLecturers(u.filter((x: User)=>x.role==='lecturer')))
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const lec = lecturers.find(l => l.id === form.lecturerId)
    const res = await fetch('/api/classes', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ...form, lecturerName: lec?.name }),
    })
    if (res.ok) { const cls = await res.json(); router.push(`/classes/${cls.id}`) }
    else { setSaving(false); alert('Failed to create class') }
  }

  return (
    <div style={{ maxWidth:640 }}>
      <PageHeader title="New Class" subtitle="Create a class cohort linked to an official course."/>
      <form onSubmit={handleSubmit}>
        <div className="panel" style={{ padding:28, marginBottom:20 }}>
          <div className="field">
            <label>Class Name *</label>
            <input required value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Digital Marketing — Spring 2026"/>
          </div>
          <div className="field">
            <label>Course *</label>
            <select required value={form.courseId} onChange={e=>set('courseId',e.target.value)}>
              <option value="">Select a course…</option>
              {courses.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Assigned Lecturer</label>
            <select value={form.lecturerId} onChange={e=>set('lecturerId',e.target.value)}>
              <option value="">No lecturer assigned</option>
              {lecturers.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </div>
          <div className="field-row">
            <div className="field" style={{ margin:0 }}>
              <label>Start Date *</label>
              <input type="date" required value={form.startDate} onChange={e=>set('startDate',e.target.value)}/>
            </div>
            <div className="field" style={{ margin:0 }}>
              <label>End Date *</label>
              <input type="date" required value={form.endDate} onChange={e=>set('endDate',e.target.value)}/>
            </div>
          </div>
          <div className="field-row">
            <div className="field" style={{ margin:0 }}>
              <label>Mode</label>
              <select value={form.mode} onChange={e=>set('mode',e.target.value)}>
                {['Online','On-site','Blended'].map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin:0 }}>
              <label>Certificate Template</label>
              <select value={form.template} onChange={e=>set('template',e.target.value)}>
                <option value="clean">Clean White</option>
                <option value="bold">Bold Dark</option>
                <option value="warm">Warm Ember</option>
              </select>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button type="submit" className="btn btn-ember" disabled={saving}>{saving?'Saving…':'Create Class'}</button>
          <button type="button" className="btn btn-ghost" onClick={()=>router.back()}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
