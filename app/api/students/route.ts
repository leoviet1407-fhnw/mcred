import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { getStudentsByInstitution, saveStudent } from '@/lib/data'
import { logAction } from '@/lib/audit'
import type { Student } from '@/lib/types'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const students = await getStudentsByInstitution(session.user.institutionId)
  // Strip password hashes
  return NextResponse.json(students.map(({ passwordHash: _, ...s }) => s))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['secretariat', 'admin', 'developer'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const student: Student = {
    id: nanoid(),
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    studentNumber: body.studentNumber ?? `STU-${Date.now()}`,
    institutionId: session.user.institutionId,
    walletStatus: 'pending',
    passwordHash: body.password ? await bcrypt.hash(body.password, 10) : undefined,
    createdAt: new Date().toISOString(),
  }

  await saveStudent(student)
  await logAction({
    userId: session.user.id, userName: session.user.name,
    userEmail: session.user.email, userRole: session.user.role,
    action: 'Student Added', objectType: 'Student',
    objectName: `${student.firstName} ${student.lastName}`,
    objectId: student.id, newValue: { email: student.email },
  })
  const { passwordHash: _, ...safe } = student
  return NextResponse.json(safe, { status: 201 })
}
