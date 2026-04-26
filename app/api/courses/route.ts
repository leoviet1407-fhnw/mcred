import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { auth } from '@/lib/auth'
import { getCoursesByInstitution, saveCourse } from '@/lib/data'
import { logAction } from '@/lib/audit'
import type { Course } from '@/lib/types'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const courses = await getCoursesByInstitution(session.user.institutionId)
  return NextResponse.json(courses)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { role } = session.user
  if (!['secretariat', 'admin', 'developer'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const now = new Date().toISOString()
  const course: Course = {
    id: nanoid(),
    title: body.title,
    description: body.description ?? '',
    department: body.department ?? '',
    eqfLevel: Number(body.eqfLevel) || 5,
    ects: Number(body.ects) || 3,
    workloadHours: Number(body.workloadHours) || 75,
    language: body.language ?? 'English',
    mode: body.mode ?? 'Online',
    evaluation: body.evaluation ?? '',
    grading: body.grading ?? 'Pass/Fail',
    status: role === 'lecturer' ? 'pending' : 'active',
    institutionId: session.user.institutionId,
    createdById: session.user.id,
    skills: body.skills ?? [],
    outcomes: body.outcomes ?? [],
    color: body.color ?? 'ember',
    createdAt: now,
    updatedAt: now,
  }

  await saveCourse(course)
  await logAction({
    userId: session.user.id, userName: session.user.name,
    userEmail: session.user.email, userRole: session.user.role,
    action: 'Course Created', objectType: 'Course',
    objectName: course.title, objectId: course.id, newValue: course,
  })

  return NextResponse.json(course, { status: 201 })
}
