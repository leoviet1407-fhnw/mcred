// ─── Roles ──────────────────────────────────────────────────────────────────

export type Role = 'lecturer' | 'secretariat' | 'admin' | 'developer' | 'student'

// ─── Core entities ───────────────────────────────────────────────────────────

export interface Institution {
  id: string
  name: string
  abbr: string
  country: string
  website?: string
  email?: string
  location?: string
  accreditation?: string
  tagline?: string
  departments: string[]
  linkedInOrgId?: string
  credentialUrlBase: string
  logoUrl?: string
  createdAt: string
}

export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  role: Role
  department?: string
  institutionId: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
}

export type UserPublic = Omit<User, 'passwordHash'>

export type CourseStatus = 'draft' | 'pending' | 'active' | 'archived'

export interface Skill {
  id: string
  name: string
}

export interface Outcome {
  id: string
  text: string
}

export interface Course {
  id: string
  title: string
  description: string
  department: string
  eqfLevel: number
  ects: number
  workloadHours: number
  language: string
  mode: string
  evaluation: string
  grading: string
  status: CourseStatus
  institutionId: string
  createdById: string
  skills: string[]
  outcomes: string[]
  color: 'ember' | 'sage' | 'amber' | 'ink'
  createdAt: string
  updatedAt: string
}

export type ClassStatus = 'active' | 'completed' | 'cancelled'

export interface Class {
  id: string
  name: string
  courseId: string
  courseTitle: string
  lecturerId?: string
  lecturerName?: string
  startDate: string
  endDate: string
  mode: string
  template: 'clean' | 'bold' | 'warm'
  status: ClassStatus
  studentCount: number
  institutionId: string
  createdAt: string
}

export type WalletStatus = 'active' | 'pending' | 'not_registered'

export interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  studentNumber: string
  institutionId: string
  walletStatus: WalletStatus
  passwordHash?: string
  createdAt: string
}

export type CompletionStatus = 'in_progress' | 'completed' | 'not_completed'

export interface Score {
  id: string
  studentId: string
  studentName: string
  classId: string
  className: string
  courseTitle: string
  lecturerId: string
  score?: string
  grade?: string
  completion: CompletionStatus
  comment?: string
  readyForCredential: boolean
  createdAt: string
  updatedAt: string
}

export type CredentialStatus = 'issued' | 'revoked' | 'expired'

export interface Credential {
  id: string
  credentialId: string            // MCRED-BFH-2026-XXXXX
  studentId: string
  studentName: string
  studentEmail: string
  classId: string
  courseId: string
  courseTitle: string
  institutionId: string
  institutionName: string
  issuedById: string
  issuedByName: string
  status: CredentialStatus
  eqfLevel: number
  ects: number
  skills: string[]
  outcomes: string[]
  issuedAt: string
  expiresAt?: string
  revokedAt?: string
  revokedReason?: string
  verificationCount: number
  publicUrl?: string
}

export interface Verification {
  id: string
  credentialId: string
  verifiedAt: string
  verifierIp?: string
}

export interface AuditEntry {
  id: string
  userId: string
  userName: string
  userEmail: string
  userRole: Role
  action: string
  objectType: string
  objectName: string
  objectId: string
  prevValue?: string
  newValue?: string
  status: 'success' | 'pending' | 'failed'
  reason?: string
  sessionId?: string
  ipAddress?: string
  scope: 'lecturer' | 'operational' | 'admin' | 'developer' | 'system'
  createdAt: string
}

// ─── Blob store keys ─────────────────────────────────────────────────────────

export const BLOB_KEYS = {
  institutions: 'mcred/institutions.json',
  users:        'mcred/users.json',
  courses:      'mcred/courses.json',
  classes:      'mcred/classes.json',
  students:     'mcred/students.json',
  credentials:  'mcred/credentials.json',
  scores:       'mcred/scores.json',
  log:          'mcred/log.json',
  verifications:'mcred/verifications.json',
} as const

export function credentialBlobKey(credentialId: string) {
  return `mcred/credentials/${credentialId}.json`
}

// ─── Session types ────────────────────────────────────────────────────────────

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: Role
      institutionId: string
    }
  }
  interface User {
    role: Role
    institutionId: string
  }
}
