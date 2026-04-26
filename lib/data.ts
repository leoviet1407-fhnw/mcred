import { readBlobOrDefault, updateBlob, writeBlob } from './blob'
import {
  BLOB_KEYS, credentialBlobKey,
  type Institution, type User, type Course, type Class,
  type Student, type Credential, type Score, type AuditEntry, type Verification,
} from './types'

// ─── Institutions ─────────────────────────────────────────────────────────────

export const getInstitutions = () =>
  readBlobOrDefault<Institution[]>(BLOB_KEYS.institutions, [])

export const getInstitution = async (id: string) =>
  (await getInstitutions()).find(i => i.id === id) ?? null

export const saveInstitution = (inst: Institution) =>
  updateBlob<Institution[]>(BLOB_KEYS.institutions, [], list =>
    list.some(i => i.id === inst.id)
      ? list.map(i => i.id === inst.id ? inst : i)
      : [...list, inst]
  )

// ─── Users ────────────────────────────────────────────────────────────────────

export const getUsers = () =>
  readBlobOrDefault<User[]>(BLOB_KEYS.users, [])

export const getUserById = async (id: string) =>
  (await getUsers()).find(u => u.id === id) ?? null

export const getUserByEmail = async (email: string) =>
  (await getUsers()).find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null

export const saveUser = (user: User) =>
  updateBlob<User[]>(BLOB_KEYS.users, [], list =>
    list.some(u => u.id === user.id)
      ? list.map(u => u.id === user.id ? user : u)
      : [...list, user]
  )

export const getUsersByInstitution = async (institutionId: string) =>
  (await getUsers()).filter(u => u.institutionId === institutionId)

// ─── Courses ──────────────────────────────────────────────────────────────────

export const getCourses = () =>
  readBlobOrDefault<Course[]>(BLOB_KEYS.courses, [])

export const getCourseById = async (id: string) =>
  (await getCourses()).find(c => c.id === id) ?? null

export const getCoursesByInstitution = async (institutionId: string) =>
  (await getCourses()).filter(c => c.institutionId === institutionId)

export const saveCourse = (course: Course) =>
  updateBlob<Course[]>(BLOB_KEYS.courses, [], list =>
    list.some(c => c.id === course.id)
      ? list.map(c => c.id === course.id ? course : c)
      : [...list, course]
  )

export const deleteCourse = (id: string) =>
  updateBlob<Course[]>(BLOB_KEYS.courses, [], list => list.filter(c => c.id !== id))

// ─── Classes ──────────────────────────────────────────────────────────────────

export const getClasses = () =>
  readBlobOrDefault<Class[]>(BLOB_KEYS.classes, [])

export const getClassById = async (id: string) =>
  (await getClasses()).find(c => c.id === id) ?? null

export const getClassesByCourse = async (courseId: string) =>
  (await getClasses()).filter(c => c.courseId === courseId)

export const getClassesByInstitution = async (institutionId: string) =>
  (await getClasses()).filter(c => c.institutionId === institutionId)

export const saveClass = (cls: Class) =>
  updateBlob<Class[]>(BLOB_KEYS.classes, [], list =>
    list.some(c => c.id === cls.id)
      ? list.map(c => c.id === cls.id ? cls : c)
      : [...list, cls]
  )

// ─── Students ─────────────────────────────────────────────────────────────────

export const getStudents = () =>
  readBlobOrDefault<Student[]>(BLOB_KEYS.students, [])

export const getStudentById = async (id: string) =>
  (await getStudents()).find(s => s.id === id) ?? null

export const getStudentByEmail = async (email: string) =>
  (await getStudents()).find(s => s.email.toLowerCase() === email.toLowerCase()) ?? null

export const getStudentsByInstitution = async (institutionId: string) =>
  (await getStudents()).filter(s => s.institutionId === institutionId)

export const saveStudent = (student: Student) =>
  updateBlob<Student[]>(BLOB_KEYS.students, [], list =>
    list.some(s => s.id === student.id)
      ? list.map(s => s.id === student.id ? student : s)
      : [...list, student]
  )

// ─── Credentials ─────────────────────────────────────────────────────────────

export const getCredentials = () =>
  readBlobOrDefault<Credential[]>(BLOB_KEYS.credentials, [])

export const getCredentialById = async (id: string) =>
  (await getCredentials()).find(c => c.id === id) ?? null

export const getCredentialByCredentialId = async (credentialId: string) =>
  (await getCredentials()).find(c => c.credentialId === credentialId) ?? null

export const getCredentialsByStudent = async (studentId: string) =>
  (await getCredentials()).filter(c => c.studentId === studentId)

export const getCredentialsByInstitution = async (institutionId: string) =>
  (await getCredentials()).filter(c => c.institutionId === institutionId)

export const saveCredential = async (credential: Credential) => {
  // Save to collection
  await updateBlob<Credential[]>(BLOB_KEYS.credentials, [], list =>
    list.some(c => c.id === credential.id)
      ? list.map(c => c.id === credential.id ? credential : c)
      : [...list, credential]
  )
  // Save individual public blob for verification
  await writeBlob(credentialBlobKey(credential.credentialId), credential)
  return credential
}

// ─── Scores ───────────────────────────────────────────────────────────────────

export const getScores = () =>
  readBlobOrDefault<Score[]>(BLOB_KEYS.scores, [])

export const getScoresByClass = async (classId: string) =>
  (await getScores()).filter(s => s.classId === classId)

export const getScoresByLecturer = async (lecturerId: string) =>
  (await getScores()).filter(s => s.lecturerId === lecturerId)

export const getScoresByInstitution = async (institutionId: string, classIds: string[]) =>
  (await getScores()).filter(s => classIds.includes(s.classId))

export const saveScore = (score: Score) =>
  updateBlob<Score[]>(BLOB_KEYS.scores, [], list =>
    list.some(s => s.id === score.id)
      ? list.map(s => s.id === score.id ? score : s)
      : [...list, score]
  )

// ─── Audit Log ───────────────────────────────────────────────────────────────

export const getLog = () =>
  readBlobOrDefault<AuditEntry[]>(BLOB_KEYS.log, [])

export const appendLog = (entry: AuditEntry) =>
  updateBlob<AuditEntry[]>(BLOB_KEYS.log, [], list => [entry, ...list])

// ─── Verifications ────────────────────────────────────────────────────────────

export const getVerifications = () =>
  readBlobOrDefault<Verification[]>(BLOB_KEYS.verifications, [])

export const appendVerification = (v: Verification) =>
  updateBlob<Verification[]>(BLOB_KEYS.verifications, [], list => [...list, v])

export const getVerificationsByCredential = async (credentialId: string) =>
  (await getVerifications()).filter(v => v.credentialId === credentialId)

// ─── Credential ID generation ─────────────────────────────────────────────────

export async function generateCredentialId(abbr: string): Promise<string> {
  const year = new Date().getFullYear()
  const existing = await getCredentials()
  const prefix = `MCRED-${abbr}-${year}-`
  const nums = existing
    .filter(c => c.credentialId.startsWith(prefix))
    .map(c => parseInt(c.credentialId.replace(prefix, ''), 10))
    .filter(n => !isNaN(n))
  const next = nums.length > 0 ? Math.max(...nums) + 1 : 1
  return `${prefix}${String(next).padStart(5, '0')}`
}
