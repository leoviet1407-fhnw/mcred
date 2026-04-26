import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { auth } from '@/lib/auth'
import { getScores, saveScore, getClassesByInstitution } from '@/lib/data'
import { logAction } from '@/lib/audit'
import type { Score } from '@/lib/types'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = await getScores()
  if (session.user.role === 'lecturer') {
    return NextResponse.json(all.filter(s => s.lecturerId === session.user.id))
  }
  // For others: filter by institution's classes
  const classes = await getClassesByInstitution(session.user.institutionId)
  const classIds = new Set(classes.map(c => c.id))
  return NextResponse.json(all.filter(s => classIds.has(s.classId)))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['lecturer', 'secretariat', 'admin', 'developer'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const now = new Date().toISOString()

  // Check if score already exists for this student+class
  const all = await getScores()
  const existing = all.find(s => s.studentId === body.studentId && s.classId === body.classId)

  const prev = existing ? { ...existing } : null
  const score: Score = {
    id: existing?.id ?? nanoid(),
    studentId: body.studentId,
    studentName: body.studentName,
    classId: body.classId,
    className: body.className,
    courseTitle: body.courseTitle,
    lecturerId: session.user.id,
    score: body.score,
    grade: body.grade,
    completion: body.completion ?? 'in_progress',
    comment: body.comment,
    readyForCredential: body.readyForCredential ?? false,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }

  await saveScore(score)
  await logAction({
    userId: session.user.id, userName: session.user.name,
    userEmail: session.user.email, userRole: session.user.role,
    action: existing ? 'Score Updated' : 'Score Entered',
    objectType: 'Student', objectName: body.studentName,
    objectId: body.studentId,
    prevValue: prev ? { completion: prev.completion } : undefined,
    newValue: { score: score.score, grade: score.grade, completion: score.completion, readyForCredential: score.readyForCredential },
    reason: body.comment,
  })

  return NextResponse.json(score, { status: existing ? 200 : 201 })
}
