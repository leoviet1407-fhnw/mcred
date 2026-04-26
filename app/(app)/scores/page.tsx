'use client'
import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'
import type { Score } from '@/lib/types'

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([])
  const [saving, setSaving] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, Partial<Score>>>({})

  useEffect(() => { fetch('/api/scores').then(r=>r.json()).then(setScores) }, [])

  function edit(id: string, key: string, val: unknown) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [key]: val } }))
  }

  async function save(score: Score) {
    const updated = { ...score, ...edits[score.id] }
    setSaving(score.id)
    const res = await fetch('/api/scores', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(updated) })
    if (res.ok) {
      const saved = await res.json()
      setScores(prev => prev.map(s => s.id === saved.id ? saved : s))
      setEdits(prev => { const n={...prev}; delete n[score.id]; return n })
    }
    setSaving(null)
  }

  async function markReady(score: Score) {
    const updated = { ...score, completion:'completed' as const, readyForCredential:true }
    setSaving(score.id)
    const res = await fetch('/api/scores', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(updated) })
    if (res.ok) { const saved = await res.json(); setScores(prev => prev.map(s => s.id === saved.id ? saved : s)) }
    setSaving(null)
  }

  return (
    <div>
      <PageHeader title="Scores / Completion" subtitle="Enter scores and mark students as ready for credential issuance." />
      <div style={{ padding:'12px 16px', background:'var(--amber-soft)', border:'1px solid rgba(184,138,43,.25)', borderRadius:10, marginBottom:20, fontSize:13, color:'var(--amber)' }}>
        <strong>Workflow:</strong> Mark students as Completed. Secretariat can then issue credentials to ready students.
      </div>
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Student</th><th>Class</th><th>Score</th><th>Grade</th><th>Completion</th><th>Comment</th><th>Ready</th><th></th></tr></thead>
          <tbody>
            {scores.map(s => {
              const dirty = Object.keys(edits[s.id] ?? {}).length > 0
              return (
                <tr key={s.id}>
                  <td className="fw">{s.studentName}</td>
                  <td style={{fontSize:12,color:'var(--mute)'}}>{s.className}</td>
                  <td><input defaultValue={s.score??''} onChange={e=>edit(s.id,'score',e.target.value)} style={{border:'1px solid var(--line)',borderRadius:6,padding:'4px 8px',fontSize:13,width:80}} placeholder="87/100"/></td>
                  <td>
                    <select defaultValue={s.grade??''} onChange={e=>edit(s.id,'grade',e.target.value)} style={{border:'1px solid var(--line)',borderRadius:6,padding:'4px 8px',fontSize:13}}>
                      <option value="">—</option>
                      {['A+','A','B+','B','C+','C','D','F'].map(g=><option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                  <td>
                    <select defaultValue={s.completion} onChange={e=>edit(s.id,'completion',e.target.value)} style={{border:'1px solid var(--line)',borderRadius:6,padding:'4px 8px',fontSize:13}}>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="not_completed">Not Completed</option>
                    </select>
                  </td>
                  <td><input defaultValue={s.comment??''} onChange={e=>edit(s.id,'comment',e.target.value)} style={{border:'1px solid var(--line)',borderRadius:6,padding:'4px 8px',fontSize:13,width:160}} placeholder="Optional"/></td>
                  <td>{s.readyForCredential ? <StatusPill status="completed"/> : <button className="btn btn-ghost btn-sm" style={{fontSize:11}} onClick={()=>markReady(s)} disabled={saving===s.id}>{saving===s.id?'…':'Mark Ready'}</button>}</td>
                  <td>{dirty && <button className="btn btn-ember btn-sm" onClick={()=>save(s)} disabled={saving===s.id}>{saving===s.id?'Saving…':'Save'}</button>}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
