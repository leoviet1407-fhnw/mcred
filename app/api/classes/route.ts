import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { auth } from '@/lib/auth'
import { getClassesByInstitution, saveClass, getCourseById } from '@/lib/data'
import { logAction } from '@/lib/audit'
import type { Class } from '@/lib/types'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const classes = await getClassesByInstitution(session.user.institutionId)
  return NextResponse.json(classes)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['secretariat', 'admin', 'developer'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const course = await getCourseById(body.courseId)

  const cls: Class = {
    id: nanoid(),
    name: body.name,
    courseId: body.courseId,
    courseTitle: course?.title ?? '',
    lecturerId: body.lecturerId,
    lecturerName: body.lecturerName,
    startDate: body.startDate,
    endDate: body.endDate,
    mode: body.mode ?? 'Online',
    template: body.template ?? 'clean',
    status: 'active',
    studentCount: 0,
    institutionId: session.user.institutionId,
    createdAt: new Date().toISOString(),
  }

  await saveClass(cls)
  await logAction({
    userId: session.user.id, userName: session.user.name,
    userEmail: session.user.email, userRole: session.user.role,
    action: 'Class Created', objectType: 'Class',
    objectName: cls.name, objectId: cls.id, newValue: cls,
  })
  return NextResponse.json(cls, { status: 201 })
}
