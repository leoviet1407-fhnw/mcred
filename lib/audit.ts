import { nanoid } from 'nanoid'
import { appendLog } from './data'
import type { AuditEntry, Role } from './types'

interface LogParams {
  userId: string
  userName: string
  userEmail: string
  userRole: Role
  action: string
  objectType: string
  objectName: string
  objectId: string
  prevValue?: unknown
  newValue?: unknown
  status?: AuditEntry['status']
  reason?: string
  sessionId?: string
  ipAddress?: string
}

function scopeForRole(role: Role): AuditEntry['scope'] {
  if (role === 'developer') return 'developer'
  if (role === 'admin') return 'admin'
  if (role === 'lecturer') return 'lecturer'
  return 'operational'
}

export async function logAction(params: LogParams): Promise<void> {
  const entry: AuditEntry = {
    id: `LOG-${Date.now()}-${nanoid(6)}`,
    userId: params.userId,
    userName: params.userName,
    userEmail: params.userEmail,
    userRole: params.userRole,
    action: params.action,
    objectType: params.objectType,
    objectName: params.objectName,
    objectId: params.objectId,
    prevValue: params.prevValue !== undefined ? JSON.stringify(params.prevValue) : undefined,
    newValue: params.newValue !== undefined ? JSON.stringify(params.newValue) : undefined,
    status: params.status ?? 'success',
    reason: params.reason,
    sessionId: params.sessionId,
    ipAddress: params.ipAddress,
    scope: scopeForRole(params.userRole),
    createdAt: new Date().toISOString(),
  }
  await appendLog(entry)
}
