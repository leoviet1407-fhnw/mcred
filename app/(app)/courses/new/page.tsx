'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'

export default function NewCoursePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', department: 'Business',
    eqfLevel: 5, ects: 3, workloadHours: 75,
    language: 'English', mode: 'Online',
    evaluation: '', grading: 'Pass/Fail', color: 'ember',
    skills: '', outcomes: '',
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        skills: form.skills.split('\n').filter(Boolean),
        outcomes: form.outcomes.split('\n').filter(Boolean),
      }),
    })
    if (res.ok) {
      const course = await res.json()
      router.push(`/courses/${course.id}`)
    } else {
      setSaving(false)
      alert('Failed to create course')
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <PageHeader title="New Course" subtitle="Create an official course for your institution." />
      <form onSubmit={handleSubmit}>
        <div className="panel" style={{ padding: 28, marginBottom: 20 }}>
          <div className="field">
            <label>Course Title *</label>
            <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Digital Marketing Fundamentals" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="What will students learn?" />
          </div>
          <div className="field-row">
            <div className="field" style={{ margin: 0 }}>
              <label>Department</label>
              <select value={form.department} onChange={e => set('department', e.target.value)}>
                {['Business','ICT','Engineering','Health','Architecture'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Colour</label>
              <select value={form.color} onChange={e => set('color', e.target.value)}>
                <option value="ember">Ember (Red)</option>
                <option value="sage">Sage (Green)</option>
                <option value="amber">Amber (Gold)</option>
                <option value="ink">Ink (Dark)</option>
              </select>
            </div>
          </div>
          <div className="field-row-3">
            <div className="field" style={{ margin: 0 }}>
              <label>EQF Level</label>
              <select value={form.eqfLevel} onChange={e => set('eqfLevel', Number(e.target.value))}>
                {[3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>ECTS Credits</label>
              <input type="number" min={1} max={30} value={form.ects} onChange={e => set('ects', Number(e.target.value))} />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Workload Hours</label>
              <input type="number" min={1} value={form.workloadHours} onChange={e => set('workloadHours', Number(e.target.value))} />
            </div>
          </div>
          <div className="field-row">
            <div className="field" style={{ margin: 0 }}>
              <label>Language</label>
              <select value={form.language} onChange={e => set('language', e.target.value)}>
                {['English','German','French','English / German','Multilingual'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Mode</label>
              <select value={form.mode} onChange={e => set('mode', e.target.value)}>
                {['Online','On-site','Blended'].map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field" style={{ margin: 0 }}>
              <label>Evaluation</label>
              <input value={form.evaluation} onChange={e => set('evaluation', e.target.value)} placeholder="e.g. Portfolio + Quiz" />
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>Grading</label>
              <select value={form.grading} onChange={e => set('grading', e.target.value)}>
                {['Pass/Fail','Grade (1–6)','Grade (A–F)','Percentage'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="field">
            <label>Skills (one per line)</label>
            <textarea value={form.skills} onChange={e => set('skills', e.target.value)} rows={3} placeholder="SEO Basics&#10;Campaign Analytics&#10;Content Strategy" />
          </div>
          <div className="field">
            <label>Learning Outcomes (one per line)</label>
            <textarea value={form.outcomes} onChange={e => set('outcomes', e.target.value)} rows={3} placeholder="Understand core digital marketing channels&#10;Interpret campaign performance metrics" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className="btn btn-ember" disabled={saving}>{saving ? 'Saving…' : 'Create Course'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => router.back()}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
