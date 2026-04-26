'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusPill } from '@/components/ui/StatusPill'
import type { Course, Class, Student, Score } from '@/lib/types'

const STEPS = ['Select Course', 'Select Class', 'Select Students', 'Preview', 'Confirm & Issue']

export default function IssueCredentialPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [courses, setCourses] = useState<Course[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [scores, setScores] = useState<Score[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [issuing, setIssuing] = useState(false)
  const [result, setResult] = useState<{ issued: unknown[]; errors: string[] } | null>(null)

  useEffect(() => {
    fetch('/api/courses').then(r => r.json()).then(setCourses)
    fetch('/api/scores').then(r => r.json()).then(setScores)
  }, [])

  useEffect(() => {
    if (selectedCourse) {
      fetch('/api/classes').then(r => r.json()).then((all: Class[]) =>
        setClasses(all.filter(c => c.courseId === selectedCourse.id))
      )
    }
  }, [selectedCourse])

  const classScores = scores.filter(s => s.classId === selectedClass?.id && s.readyForCredential)
  const notReady = scores.filter(s => s.classId === selectedClass?.id && !s.readyForCredential)

  function toggleStudent(id: string) {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function issue() {
    setIssuing(true)
    const res = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: selectedCourse!.id,
        classId: selectedClass!.id,
        studentIds: selectedStudentIds,
      }),
    })
    const data = await res.json()
    setResult(data)
    setStep(5)
    setIssuing(false)
  }

  // Success screen
  if (step === 5 && result) {
    return (
      <div style={{ maxWidth: 640 }}>
        <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎓</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 8 }}>
            {result.issued.length} Credential{result.issued.length !== 1 ? 's' : ''} Issued
          </h1>
          <p style={{ fontSize: 15, color: 'var(--mute)', marginBottom: 32 }}>
            The credentials have been issued and the learners have been notified.
          </p>
          {result.errors.length > 0 && (
            <div style={{ background: 'var(--ember-soft)', border: '1px solid rgba(200,66,30,.2)', borderRadius: 10, padding: 16, marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Some students could not be issued:</div>
              {result.errors.map((e, i) => <div key={i} style={{ fontSize: 13, color: 'var(--ember)' }}>• {e}</div>)}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-ember" onClick={() => router.push('/credentials')}>View All Credentials</button>
            <button className="btn btn-ghost" onClick={() => { setStep(0); setSelectedCourse(null); setSelectedClass(null); setSelectedStudentIds([]); setResult(null) }}>Issue More</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <PageHeader title="Issue Credential" subtitle="Issue digital credentials to students who have completed a course." />

      {/* Stepper */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--white)' }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex: 1, padding: '14px 10px', textAlign: 'center', fontSize: 12, fontWeight: i === step ? 600 : 400, color: i === step ? 'var(--ember)' : i < step ? 'var(--sage)' : 'var(--mute)', borderRight: i < STEPS.length - 1 ? '1px solid var(--line)' : 'none', background: i === step ? 'var(--ember-soft)' : 'transparent', transition: 'all .15s' }}>
            <div style={{ fontSize: 10, marginBottom: 2 }}>Step {i + 1}</div>
            {s}
          </div>
        ))}
      </div>

      {/* Step 0: Course */}
      {step === 0 && (
        <div className="panel">
          <div className="panel-head"><h3>Select Course</h3></div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {courses.filter(c => c.status === 'active').map(c => (
              <div key={c.id} onClick={() => { setSelectedCourse(c); setStep(1) }}
                style={{ padding: '16px 20px', border: `2px solid ${selectedCourse?.id === c.id ? 'var(--ember)' : 'var(--line)'}`, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ember)', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0 }}>{c.title[0]}</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{c.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--mute)' }}>{c.department} · EQF {c.eqfLevel} · {c.ects} ECTS</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Class */}
      {step === 1 && (
        <div className="panel">
          <div className="panel-head"><h3>Select Class</h3><button className="btn btn-ghost btn-sm" onClick={() => setStep(0)}>← Back</button></div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {classes.length === 0 && <div style={{ color: 'var(--mute)', fontSize: 13, padding: '20px 0' }}>No classes found for this course.</div>}
            {classes.map(cl => (
              <div key={cl.id} onClick={() => { setSelectedClass(cl); setStep(2) }}
                style={{ padding: '16px 20px', border: `2px solid ${selectedClass?.id === cl.id ? 'var(--ember)' : 'var(--line)'}`, borderRadius: 10, cursor: 'pointer' }}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>{cl.name}</div>
                <div style={{ fontSize: 12, color: 'var(--mute)' }}>{cl.lecturerName} · {cl.studentCount} students · <StatusPill status={cl.status} /></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Students */}
      {step === 2 && (
        <div className="panel">
          <div className="panel-head">
            <h3>Select Students</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedStudentIds(classScores.map(s => s.studentId))}>Select All</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setStep(1)}>← Back</button>
            </div>
          </div>
          <div style={{ padding: '12px 20px 4px', background: 'var(--amber-soft)', borderBottom: '1px solid var(--line)', fontSize: 13, color: 'var(--amber)' }}>
            Only students marked as <strong>Ready for Credential</strong> by their lecturer are shown.
            {notReady.length > 0 && ` ${notReady.length} student${notReady.length > 1 ? 's are' : ' is'} not yet ready.`}
          </div>
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {classScores.length === 0 && <div style={{ color: 'var(--mute)', fontSize: 13 }}>No students are marked as ready yet. Ask the lecturer to enter scores first.</div>}
            {classScores.map(s => (
              <div key={s.studentId} onClick={() => toggleStudent(s.studentId)}
                style={{ padding: '14px 18px', border: `2px solid ${selectedStudentIds.includes(s.studentId) ? 'var(--ember)' : 'var(--line)'}`, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, background: selectedStudentIds.includes(s.studentId) ? 'var(--ember-soft)' : 'var(--white)' }}>
                <div style={{ width: 20, height: 20, border: `2px solid ${selectedStudentIds.includes(s.studentId) ? 'var(--ember)' : 'var(--line)'}`, borderRadius: 4, display: 'grid', placeItems: 'center', background: selectedStudentIds.includes(s.studentId) ? 'var(--ember)' : 'transparent', color: '#fff', fontSize: 13, flexShrink: 0 }}>
                  {selectedStudentIds.includes(s.studentId) && '✓'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{s.studentName}</div>
                  <div style={{ fontSize: 12, color: 'var(--mute)' }}>Score: {s.score ?? '—'} · Grade: {s.grade ?? '—'}</div>
                </div>
                <StatusPill status="completed" />
              </div>
            ))}
          </div>
          {classScores.length > 0 && (
            <div style={{ padding: '0 20px 20px' }}>
              <button className="btn btn-ember" disabled={selectedStudentIds.length === 0} onClick={() => setStep(3)}>
                Continue with {selectedStudentIds.length} student{selectedStudentIds.length !== 1 ? 's' : ''} →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && selectedCourse && selectedClass && (
        <div className="panel">
          <div className="panel-head"><h3>Preview Credential</h3><button className="btn btn-ghost btn-sm" onClick={() => setStep(2)}>← Back</button></div>
          <div style={{ padding: 24 }}>
            <div style={{ background: 'var(--ink)', borderRadius: 12, padding: 32, color: 'var(--paper)', marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(246,243,236,.5)', marginBottom: 8 }}>Bern University of Applied Sciences</div>
              <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{selectedCourse.title}</div>
              <div style={{ fontSize: 14, color: 'rgba(246,243,236,.7)', marginBottom: 24 }}>Microcredential Certificate · EQF {selectedCourse.eqfLevel} · {selectedCourse.ects} ECTS</div>
              <div style={{ fontSize: 12, color: 'rgba(246,243,236,.5)', marginBottom: 4 }}>Awarded to</div>
              <div style={{ fontSize: 18, fontWeight: 600 }}>{selectedStudentIds.length} student{selectedStudentIds.length !== 1 ? 's' : ''}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
              {selectedCourse.skills.map(s => (
                <span key={s} style={{ padding: '4px 10px', background: 'var(--ember-soft)', color: 'var(--ember)', borderRadius: 999, fontSize: 12 }}>{s}</span>
              ))}
            </div>
            <button className="btn btn-ember btn-lg" onClick={() => setStep(4)} style={{ width: '100%', justifyContent: 'center' }}>
              Looks good — continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && selectedCourse && selectedClass && (
        <div className="panel">
          <div className="panel-head"><h3>Confirm & Issue</h3><button className="btn btn-ghost btn-sm" onClick={() => setStep(3)}>← Back</button></div>
          <div style={{ padding: 24 }}>
            <div style={{ background: 'var(--ember-soft)', border: '1px solid rgba(200,66,30,.2)', borderRadius: 10, padding: 16, marginBottom: 20 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>You are about to issue {selectedStudentIds.length} credential{selectedStudentIds.length !== 1 ? 's' : ''}.</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Course: {selectedCourse.title} · Class: {selectedClass.name}</div>
              <div style={{ fontSize: 12, color: 'var(--mute)', marginTop: 6 }}>This action is logged and cannot be undone. Credentials can be revoked later by an Admin.</div>
            </div>
            <button className="btn btn-ember btn-lg" onClick={issue} disabled={issuing} style={{ width: '100%', justifyContent: 'center' }}>
              {issuing ? 'Issuing…' : `Issue ${selectedStudentIds.length} Credential${selectedStudentIds.length !== 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
