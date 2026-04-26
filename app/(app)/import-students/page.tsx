'use client'
import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { useRouter } from 'next/navigation'

export default function ImportStudentsPage() {
  const router = useRouter()
  const [csvText, setCsvText] = useState('')
  const [preview, setPreview] = useState<string[][]>([])
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<{ added: number; errors: string[] } | null>(null)

  function parseCSV(text: string) {
    const lines = text.trim().split('\n').filter(Boolean)
    return lines.map(l => l.split(',').map(v => v.trim().replace(/^"|"$/g,'')))
  }

  function handleTextChange(text: string) {
    setCsvText(text)
    const rows = parseCSV(text)
    setPreview(rows.slice(0, 6))
  }

  async function handleImport() {
    const rows = parseCSV(csvText)
    const headers = rows[0]
    const data = rows.slice(1)
    setImporting(true)
    const added: number[] = []
    const errors: string[] = []
    for (const row of data) {
      const student: Record<string,string> = {}
      headers.forEach((h,i) => { student[h.trim()] = row[i] ?? '' })
      const res = await fetch('/api/students', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          firstName: student.first_name ?? student.firstName,
          lastName: student.last_name ?? student.lastName,
          email: student.email,
          studentNumber: student.student_id ?? student.studentNumber ?? '',
          password: 'ChangeMe123!',
        }),
      })
      if (res.ok) added.push(1)
      else errors.push(`Row ${data.indexOf(row)+2}: ${student.email || 'unknown'}`)
    }
    setResult({ added: added.length, errors })
    setImporting(false)
  }

  return (
    <div style={{ maxWidth:720 }}>
      <PageHeader title="Import Students" subtitle="Upload a CSV file to add multiple students at once."/>

      {result ? (
        <div className="panel" style={{ padding:28 }}>
          <div style={{ fontSize:36, marginBottom:12 }}>{result.errors.length === 0 ? '✅' : '⚠️'}</div>
          <div style={{ fontSize:20, fontWeight:600, marginBottom:8 }}>{result.added} students imported</div>
          {result.errors.length > 0 && (
            <div style={{ background:'var(--ember-soft)', border:'1px solid rgba(200,66,30,.2)', borderRadius:8, padding:14, marginTop:12 }}>
              <div style={{ fontWeight:600, marginBottom:6, color:'var(--ember)' }}>Errors ({result.errors.length}):</div>
              {result.errors.map((e,i)=><div key={i} style={{ fontSize:12, color:'var(--ember)' }}>• {e}</div>)}
            </div>
          )}
          <div style={{ display:'flex', gap:12, marginTop:20 }}>
            <button className="btn btn-ember" onClick={()=>router.push('/students')}>View Students</button>
            <button className="btn btn-ghost" onClick={()=>{ setResult(null); setCsvText(''); setPreview([]) }}>Import More</button>
          </div>
        </div>
      ) : (
        <>
          <div className="panel" style={{ padding:28, marginBottom:20 }}>
            <div style={{ fontSize:13, fontWeight:600, marginBottom:12 }}>Paste CSV Data</div>
            <textarea value={csvText} onChange={e=>handleTextChange(e.target.value)}
              style={{ width:'100%', height:160, border:'1px solid var(--line)', borderRadius:8, padding:14, fontSize:12, fontFamily:'monospace', resize:'vertical' }}
              placeholder={'first_name,last_name,email,student_id\nSarah,Keller,sarah.keller@student.bfh.ch,STU-2026-001\nLuca,Meier,luca.meier@student.bfh.ch,STU-2026-002'}/>
            <div style={{ marginTop:12, fontSize:12, color:'var(--mute)' }}>
              Required columns: <code style={{ fontFamily:'monospace', background:'var(--paper)', padding:'1px 4px', borderRadius:3 }}>first_name, last_name, email</code> · Optional: <code style={{ fontFamily:'monospace', background:'var(--paper)', padding:'1px 4px', borderRadius:3 }}>student_id</code>
            </div>
          </div>

          {preview.length > 1 && (
            <div className="panel" style={{ marginBottom:20, overflow:'auto' }}>
              <div style={{ padding:'14px 20px', borderBottom:'1px solid var(--line)', fontSize:11, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mute)' }}>
                Preview ({preview.length - 1} rows)
              </div>
              <table className="data-table">
                <thead><tr>{preview[0].map((h,i)=><th key={i}>{h}</th>)}</tr></thead>
                <tbody>{preview.slice(1).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}

          <div style={{ display:'flex', gap:12 }}>
            <button className="btn btn-ember" disabled={!csvText.trim() || importing} onClick={handleImport}>
              {importing ? 'Importing…' : 'Import Students'}
            </button>
            <button className="btn btn-ghost" onClick={()=>router.back()}>Cancel</button>
          </div>
        </>
      )}
    </div>
  )
}
