import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getLog, getClassesByInstitution } from '@/lib/data'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const all = await getLog()
  const { role, id: userId } = session.user

  if (role === 'developer' || role === 'admin') {
    return NextResponse.json(all)
  }

  if (role === 'secretariat') {
    return NextResponse.json(all.filter(e =>
      ['operational', 'lecturer'].includes(e.scope)
    ))
  }

  if (role === 'lecturer') {
    return NextResponse.json(all.filter(e =>
      e.userId === userId || e.scope === 'lecturer'
    ))
  }

  return NextResponse.json([])
}
