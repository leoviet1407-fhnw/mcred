import { NextRequest, NextResponse } from 'next/server'
import { getCredentialByCredentialId, saveCredential, appendVerification } from '@/lib/data'
import { nanoid } from 'nanoid'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cred = await getCredentialByCredentialId(id)
  if (!cred) {
    return NextResponse.json({ found: false, status: 'not_found' })
  }

  // Track verification
  const v = { id: nanoid(), credentialId: cred.id, verifiedAt: new Date().toISOString() }
  await appendVerification(v)
  await saveCredential({ ...cred, verificationCount: cred.verificationCount + 1 })

  return NextResponse.json({ found: true, credential: cred })
}
