import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { getUsersByInstitution, saveUser } from '@/lib/data'
import { logAction } from '@/lib/audit'
import type { User } from '@/lib/types'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['admin', 'developer'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const users = await getUsersByInstitution(session.user.institutionId)
  return NextResponse.json(users.map(({ passwordHash: _, ...u }) => u))
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['admin', 'developer'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const user: User = {
    id: nanoid(),
    email: body.email,
    name: body.name,
    passwordHash: await bcrypt.hash(body.password ?? 'ChangeMe123!', 10),
    role: body.role ?? 'lecturer',
    department: body.department,
    institutionId: session.user.institutionId,
    isActive: true,
    createdAt: new Date().toISOString(),
  }
  await saveUser(user)
  await logAction({
    userId: session.user.id, userName: session.user.name,
    userEmail: session.user.email, userRole: session.user.role,
    action: 'User Invited', objectType: 'User',
    objectName: user.email, objectId: user.id,
    newValue: { role: user.role, department: user.department },
  })
  const { passwordHash: _, ...safe } = user
  return NextResponse.json(safe, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['admin', 'developer'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const users = await getUsersByInstitution(session.user.institutionId)
  const user = users.find(u => u.id === body.id)
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const prev = { role: user.role, isActive: user.isActive }
  const updated = { ...user, ...body }
  await saveUser(updated)
  await logAction({
    userId: session.user.id, userName: session.user.name,
    userEmail: session.user.email, userRole: session.user.role,
    action: body.role !== user.role ? 'User Role Changed' : 'User Updated',
    objectType: 'User', objectName: user.email, objectId: user.id,
    prevValue: prev, newValue: { role: updated.role, isActive: updated.isActive },
    reason: body.reason,
  })
  const { passwordHash: _, ...safe } = updated
  return NextResponse.json(safe)
}
