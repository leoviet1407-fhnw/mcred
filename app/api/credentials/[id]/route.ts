import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getCredentialById, saveCredential } from '@/lib/data'
import { logAction } from '@/lib/audit'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const cred = await getCredentialById(id)
  if (!cred || cred.institutionId !== session.user.institutionId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(cred)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!['admin', 'developer', 'secretariat'].includes(session.user.role))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const cred = await getCredentialById(id)
  if (!cred || cred.institutionId !== session.user.institutionId)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json()
  const prev = { ...cred }

  // Handle revoke
  if (body.action === 'revoke') {
    if (!['admin', 'developer'].includes(session.user.role))
      return NextResponse.json({ error: 'Only admins can revoke credentials' }, { status: 403 })
    const updated = {
      ...cred,
      status: 'revoked' as const,
      revokedAt: new Date().toISOString(),
      revokedReason: body.reason ?? 'Revoked by admin',
    }
    await saveCredential(updated)
    await logAction({
      userId: session.user.id, userName: session.user.name,
      userEmail: session.user.email, userRole: session.user.role,
      action: 'Credential Revoked', objectType: 'Credential',
      objectName: cred.credentialId, objectId: cred.id,
      prevValue: prev.status, newValue: 'revoked', reason: body.reason,
    })
    return NextResponse.json(updated)
  }

  // Handle track verification
  if (body.action === 'verify') {
    const updated = { ...cred, verificationCount: cred.verificationCount + 1 }
    await saveCredential(updated)
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
