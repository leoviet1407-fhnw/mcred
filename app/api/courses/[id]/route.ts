import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getCourseById, saveCourse, deleteCourse } from '@/lib/data'
import { logAction } from '@/lib/audit'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const course = await getCourseById(id)
  if (!course || course.institutionId !== session.user.institutionId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(course)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { role } = session.user
  if (!['secretariat', 'admin', 'developer'].includes(role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const course = await getCourseById(id)
  if (!course || course.institutionId !== session.user.institutionId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const prev = { ...course }
  const updated = { ...course, ...body, updatedAt: new Date().toISOString() }
  await saveCourse(updated)
  await logAction({
    userId: session.user.id, userName: session.user.name,
    userEmail: session.user.email, userRole: session.user.role,
    action: 'Course Updated', objectType: 'Course',
    objectName: course.title, objectId: course.id,
    prevValue: prev, newValue: updated,
  })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['admin', 'developer'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const course = await getCourseById(id)
  if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await deleteCourse(id)
  await logAction({
    userId: session.user.id, userName: session.user.name,
    userEmail: session.user.email, userRole: session.user.role,
    action: 'Course Deleted', objectType: 'Course',
    objectName: course.title, objectId: course.id, prevValue: course,
  })
  return NextResponse.json({ ok: true })
}
