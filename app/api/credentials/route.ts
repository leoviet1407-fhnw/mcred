import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getCredentialsByInstitution, saveCredential, getCourseById,
  getClassById, getStudentById, getInstitution, generateCredentialId,
  getScores, saveScore,
} from '@/lib/data'
import { logAction } from '@/lib/audit'
import type { Credential } from '@/lib/types'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const creds = await getCredentialsByInstitution(session.user.institutionId)
  return NextResponse.json(creds)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['secretariat', 'admin', 'developer'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  // body: { courseId, classId, studentIds: string[] }
  const { courseId, classId, studentIds } = body

  const [course, cls, institution] = await Promise.all([
    getCourseById(courseId),
    getClassById(classId),
    getInstitution(session.user.institutionId),
  ])

  if (!course || !cls || !institution)
    return NextResponse.json({ error: 'Invalid course, class, or institution' }, { status: 400 })

  const allScores = await getScores()
  const issued: Credential[] = []
  const errors: string[] = []

  for (const studentId of studentIds) {
    const student = await getStudentById(studentId)
    if (!student) { errors.push(`Student ${studentId} not found`); continue }

    // Check completion
    const score = allScores.find(s => s.studentId === studentId && s.classId === classId)
    if (!score?.readyForCredential) {
      errors.push(`${student.firstName} ${student.lastName} is not marked as ready`)
      continue
    }

    const credentialId = await generateCredentialId(institution.abbr)
    const now = new Date().toISOString()
    const expiresAt = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString()

    const credential: Credential = {
      id: `crd-${Date.now()}-${studentId.slice(-4)}`,
      credentialId,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      studentEmail: student.email,
      classId: cls.id,
      courseId: course.id,
      courseTitle: course.title,
      institutionId: institution.id,
      institutionName: institution.name,
      issuedById: session.user.id,
      issuedByName: session.user.name,
      status: 'issued',
      eqfLevel: course.eqfLevel,
      ects: course.ects,
      skills: course.skills,
      outcomes: course.outcomes,
      issuedAt: now,
      expiresAt,
      verificationCount: 0,
    }

    await saveCredential(credential)
    await logAction({
      userId: session.user.id, userName: session.user.name,
      userEmail: session.user.email, userRole: session.user.role,
      action: 'Credential Issued', objectType: 'Credential',
      objectName: credentialId, objectId: credential.id,
      newValue: { student: credential.studentName, course: credential.courseTitle },
    })
    issued.push(credential)
  }

  return NextResponse.json({ issued, errors }, { status: 201 })
}
