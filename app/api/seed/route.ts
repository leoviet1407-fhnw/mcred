import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { writeBlob } from '@/lib/blob'
import { BLOB_KEYS } from '@/lib/types'
import type {
  Institution, User, Course, Class, Student, Credential, Score, AuditEntry,
} from '@/lib/types'

const INSTITUTION_ID = 'inst-bfh-001'
const now = new Date().toISOString()

// Only allow seeding in development or with secret
export async function POST(req: Request) {
  const secret = req.headers.get('x-seed-secret')
  if (
    process.env.NODE_ENV === 'production' &&
    secret !== process.env.SEED_SECRET
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const hash = (pw: string) => bcrypt.hashSync(pw, 10)

  // ─── Institution ──────────────────────────────────────────────────────────
  const institution: Institution = {
    id: INSTITUTION_ID,
    name: 'Bern University of Applied Sciences',
    abbr: 'BFH',
    country: 'Switzerland',
    website: 'www.bfh.ch',
    email: 'contact@bfh.ch',
    location: 'Bern, Switzerland',
    accreditation: 'Swiss Accreditation Council (AAQ)',
    tagline: 'Applied Sciences. Applied Impact.',
    departments: ['Business', 'Engineering', 'Health', 'Architecture', 'ICT'],
    linkedInOrgId: '',
    credentialUrlBase: 'credentials.m-cred.ch/bfh',
    createdAt: now,
  }

  // ─── Users ────────────────────────────────────────────────────────────────
  const users: User[] = [
    {
      id: 'usr-admin-001',
      email: 'admin@bfh.ch',
      name: 'Dr. Hans Zimmermann',
      passwordHash: hash('password123'),
      role: 'admin',
      department: 'Administration',
      institutionId: INSTITUTION_ID,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr-sec-001',
      email: 'secretariat@bfh.ch',
      name: 'Marie Brunner',
      passwordHash: hash('password123'),
      role: 'secretariat',
      department: 'Academic Administration',
      institutionId: INSTITUTION_ID,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr-lec-001',
      email: 'a.steiner@bfh.ch',
      name: 'Prof. Dr. Anna Steiner',
      passwordHash: hash('password123'),
      role: 'lecturer',
      department: 'Business',
      institutionId: INSTITUTION_ID,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr-lec-002',
      email: 'k.broennimann@bfh.ch',
      name: 'Dr. Klaus Brönnimann',
      passwordHash: hash('password123'),
      role: 'lecturer',
      department: 'Business',
      institutionId: INSTITUTION_ID,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr-lec-003',
      email: 'r.hasler@bfh.ch',
      name: 'Prof. Reto Hasler',
      passwordHash: hash('password123'),
      role: 'lecturer',
      department: 'ICT',
      institutionId: INSTITUTION_ID,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr-lec-004',
      email: 'p.sharma@bfh.ch',
      name: 'Dr. Priya Sharma',
      passwordHash: hash('password123'),
      role: 'lecturer',
      department: 'ICT',
      institutionId: INSTITUTION_ID,
      isActive: true,
      createdAt: now,
    },
    {
      id: 'usr-dev-001',
      email: 'dev@m-cred.ch',
      name: 'Dev Account',
      passwordHash: hash('password123'),
      role: 'developer',
      department: 'System',
      institutionId: INSTITUTION_ID,
      isActive: true,
      createdAt: now,
    },
  ]

  // ─── Courses ──────────────────────────────────────────────────────────────
  const courses: Course[] = [
    {
      id: 'crs-001',
      title: 'Digital Marketing Fundamentals',
      description: 'Master the core principles of digital marketing, from SEO and content strategy to paid media and campaign analytics.',
      department: 'Business',
      eqfLevel: 5,
      ects: 3,
      workloadHours: 75,
      language: 'English',
      mode: 'Online',
      evaluation: 'Portfolio + Quiz',
      grading: 'Pass/Fail',
      status: 'active',
      institutionId: INSTITUTION_ID,
      createdById: 'usr-sec-001',
      skills: ['SEO Basics', 'Campaign Analytics', 'Content Strategy', 'Paid Media Fundamentals'],
      outcomes: [
        'Understand core digital marketing channels',
        'Interpret campaign performance metrics',
        'Create a basic digital marketing plan',
        'Explain how digital credentials can be shared and verified',
      ],
      color: 'ember',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'crs-002',
      title: 'Sustainable Business Management',
      description: 'Integrate sustainability principles into business strategy, operations, and ESG reporting frameworks.',
      department: 'Business',
      eqfLevel: 6,
      ects: 4,
      workloadHours: 100,
      language: 'English / German',
      mode: 'Blended',
      evaluation: 'Case Study',
      grading: 'Grade (1–6)',
      status: 'active',
      institutionId: INSTITUTION_ID,
      createdById: 'usr-sec-001',
      skills: ['ESG Reporting', 'Circular Economy', 'Stakeholder Engagement', 'Sustainability Strategy'],
      outcomes: [
        'Apply ESG frameworks to business decisions',
        'Develop a corporate sustainability strategy',
        'Measure and report environmental impact',
      ],
      color: 'sage',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'crs-003',
      title: 'Data Analytics for Business',
      description: 'Learn to extract actionable insights from business data using modern analytical tools and visualisation frameworks.',
      department: 'ICT',
      eqfLevel: 5,
      ects: 3,
      workloadHours: 75,
      language: 'English',
      mode: 'Online',
      evaluation: 'Project',
      grading: 'Pass/Fail',
      status: 'active',
      institutionId: INSTITUTION_ID,
      createdById: 'usr-sec-001',
      skills: ['Data Visualisation', 'Excel & Power BI', 'Statistical Thinking', 'Dashboard Design'],
      outcomes: [
        'Work with structured and unstructured datasets',
        'Create meaningful data visualisations',
        'Communicate data-driven recommendations',
      ],
      color: 'amber',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'crs-004',
      title: 'AI Literacy for Professionals',
      description: 'Understand AI concepts, capabilities, and limitations to make informed decisions in professional contexts.',
      department: 'ICT',
      eqfLevel: 4,
      ects: 2,
      workloadHours: 50,
      language: 'English',
      mode: 'Online',
      evaluation: 'Quiz + Reflection',
      grading: 'Pass/Fail',
      status: 'active',
      institutionId: INSTITUTION_ID,
      createdById: 'usr-sec-001',
      skills: ['AI Fundamentals', 'Prompt Engineering', 'AI Ethics', 'Tool Evaluation'],
      outcomes: [
        'Explain core AI and ML concepts',
        'Evaluate AI tools for professional use',
        'Recognise ethical implications of AI systems',
      ],
      color: 'ink',
      createdAt: now,
      updatedAt: now,
    },
  ]

  // ─── Classes ──────────────────────────────────────────────────────────────
  const classes: Class[] = [
    {
      id: 'cls-001',
      name: 'Digital Marketing — Spring 2026',
      courseId: 'crs-001',
      courseTitle: 'Digital Marketing Fundamentals',
      lecturerId: 'usr-lec-001',
      lecturerName: 'Prof. Dr. Anna Steiner',
      startDate: '2026-02-03',
      endDate: '2026-05-15',
      mode: 'Online',
      template: 'clean',
      status: 'completed',
      studentCount: 3,
      institutionId: INSTITUTION_ID,
      createdAt: now,
    },
    {
      id: 'cls-002',
      name: 'Sustainable Business — Spring 2026',
      courseId: 'crs-002',
      courseTitle: 'Sustainable Business Management',
      lecturerId: 'usr-lec-002',
      lecturerName: 'Dr. Klaus Brönnimann',
      startDate: '2026-02-03',
      endDate: '2026-05-30',
      mode: 'Blended',
      template: 'bold',
      status: 'active',
      studentCount: 1,
      institutionId: INSTITUTION_ID,
      createdAt: now,
    },
    {
      id: 'cls-003',
      name: 'Data Analytics — Spring 2026',
      courseId: 'crs-003',
      courseTitle: 'Data Analytics for Business',
      lecturerId: 'usr-lec-003',
      lecturerName: 'Prof. Reto Hasler',
      startDate: '2026-02-03',
      endDate: '2026-05-20',
      mode: 'Online',
      template: 'clean',
      status: 'completed',
      studentCount: 2,
      institutionId: INSTITUTION_ID,
      createdAt: now,
    },
    {
      id: 'cls-004',
      name: 'AI Literacy — Q1 2026',
      courseId: 'crs-004',
      courseTitle: 'AI Literacy for Professionals',
      lecturerId: 'usr-lec-004',
      lecturerName: 'Dr. Priya Sharma',
      startDate: '2026-01-15',
      endDate: '2026-02-28',
      mode: 'Online',
      template: 'warm',
      status: 'completed',
      studentCount: 1,
      institutionId: INSTITUTION_ID,
      createdAt: now,
    },
  ]

  // ─── Students ─────────────────────────────────────────────────────────────
  const students: Student[] = [
    { id: 'stu-001', firstName: 'Sarah', lastName: 'Keller', email: 'sarah.keller@student.bfh.ch', studentNumber: 'STU-2026-001', institutionId: INSTITUTION_ID, walletStatus: 'active', passwordHash: hash('student123'), createdAt: now },
    { id: 'stu-002', firstName: 'Luca', lastName: 'Meier', email: 'luca.meier@student.bfh.ch', studentNumber: 'STU-2026-002', institutionId: INSTITUTION_ID, walletStatus: 'active', passwordHash: hash('student123'), createdAt: now },
    { id: 'stu-003', firstName: 'Amélie', lastName: 'Dubois', email: 'amelie.dubois@student.bfh.ch', studentNumber: 'STU-2026-003', institutionId: INSTITUTION_ID, walletStatus: 'pending', passwordHash: hash('student123'), createdAt: now },
    { id: 'stu-004', firstName: 'Minh', lastName: 'Nguyen', email: 'minh.nguyen@student.bfh.ch', studentNumber: 'STU-2026-004', institutionId: INSTITUTION_ID, walletStatus: 'not_registered', createdAt: now },
    { id: 'stu-005', firstName: 'Noa', lastName: 'Schneider', email: 'noa.schneider@student.bfh.ch', studentNumber: 'STU-2026-005', institutionId: INSTITUTION_ID, walletStatus: 'active', passwordHash: hash('student123'), createdAt: now },
    { id: 'stu-006', firstName: 'Tobias', lastName: 'Weber', email: 'tobias.weber@student.bfh.ch', studentNumber: 'STU-2026-006', institutionId: INSTITUTION_ID, walletStatus: 'active', passwordHash: hash('student123'), createdAt: now },
    { id: 'stu-007', firstName: 'Léa', lastName: 'Müller', email: 'lea.mueller@student.bfh.ch', studentNumber: 'STU-2026-007', institutionId: INSTITUTION_ID, walletStatus: 'not_registered', createdAt: now },
  ]

  // ─── Scores ───────────────────────────────────────────────────────────────
  const scores: Score[] = [
    { id: 'sc-001', studentId: 'stu-001', studentName: 'Sarah Keller', classId: 'cls-001', className: 'Digital Marketing — Spring 2026', courseTitle: 'Digital Marketing Fundamentals', lecturerId: 'usr-lec-001', score: '87/100', grade: 'A', completion: 'completed', comment: 'Excellent portfolio work.', readyForCredential: true, createdAt: now, updatedAt: now },
    { id: 'sc-002', studentId: 'stu-002', studentName: 'Luca Meier', classId: 'cls-001', className: 'Digital Marketing — Spring 2026', courseTitle: 'Digital Marketing Fundamentals', lecturerId: 'usr-lec-001', score: '74/100', grade: 'B', completion: 'completed', comment: 'Good grasp of fundamentals.', readyForCredential: true, createdAt: now, updatedAt: now },
    { id: 'sc-003', studentId: 'stu-006', studentName: 'Tobias Weber', classId: 'cls-001', className: 'Digital Marketing — Spring 2026', courseTitle: 'Digital Marketing Fundamentals', lecturerId: 'usr-lec-001', score: '61/100', grade: 'C', completion: 'completed', comment: 'Passed.', readyForCredential: true, createdAt: now, updatedAt: now },
    { id: 'sc-004', studentId: 'stu-003', studentName: 'Amélie Dubois', classId: 'cls-002', className: 'Sustainable Business — Spring 2026', courseTitle: 'Sustainable Business Management', lecturerId: 'usr-lec-002', completion: 'not_completed', readyForCredential: false, createdAt: now, updatedAt: now },
    { id: 'sc-005', studentId: 'stu-004', studentName: 'Minh Nguyen', classId: 'cls-003', className: 'Data Analytics — Spring 2026', courseTitle: 'Data Analytics for Business', lecturerId: 'usr-lec-003', score: '79/100', grade: 'B+', completion: 'completed', comment: 'Strong visualisation skills.', readyForCredential: true, createdAt: now, updatedAt: now },
    { id: 'sc-006', studentId: 'stu-005', studentName: 'Noa Schneider', classId: 'cls-004', className: 'AI Literacy — Q1 2026', courseTitle: 'AI Literacy for Professionals', lecturerId: 'usr-lec-004', score: '91/100', grade: 'A+', completion: 'completed', comment: 'Outstanding.', readyForCredential: true, createdAt: now, updatedAt: now },
    { id: 'sc-007', studentId: 'stu-007', studentName: 'Léa Müller', classId: 'cls-003', className: 'Data Analytics — Spring 2026', courseTitle: 'Data Analytics for Business', lecturerId: 'usr-lec-003', completion: 'in_progress', readyForCredential: false, createdAt: now, updatedAt: now },
  ]

  // ─── Credentials ─────────────────────────────────────────────────────────
  const course1 = courses[0]
  const creds: Credential[] = [
    {
      id: 'crd-001',
      credentialId: 'MCRED-BFH-2026-00482',
      studentId: 'stu-001', studentName: 'Sarah Keller', studentEmail: 'sarah.keller@student.bfh.ch',
      classId: 'cls-001', courseId: 'crs-001', courseTitle: course1.title,
      institutionId: INSTITUTION_ID, institutionName: institution.name,
      issuedById: 'usr-sec-001', issuedByName: 'Marie Brunner',
      status: 'issued', eqfLevel: 5, ects: 3,
      skills: course1.skills, outcomes: course1.outcomes,
      issuedAt: '2026-05-14T11:30:00.000Z',
      expiresAt: '2029-05-14T11:30:00.000Z',
      verificationCount: 3,
    },
    {
      id: 'crd-002',
      credentialId: 'MCRED-BFH-2026-00483',
      studentId: 'stu-002', studentName: 'Luca Meier', studentEmail: 'luca.meier@student.bfh.ch',
      classId: 'cls-001', courseId: 'crs-001', courseTitle: course1.title,
      institutionId: INSTITUTION_ID, institutionName: institution.name,
      issuedById: 'usr-sec-001', issuedByName: 'Marie Brunner',
      status: 'issued', eqfLevel: 5, ects: 3,
      skills: course1.skills, outcomes: course1.outcomes,
      issuedAt: '2026-05-14T11:29:47.000Z',
      expiresAt: '2029-05-14T11:29:47.000Z',
      verificationCount: 1,
    },
    {
      id: 'crd-003',
      credentialId: 'MCRED-BFH-2026-00471',
      studentId: 'stu-006', studentName: 'Tobias Weber', studentEmail: 'tobias.weber@student.bfh.ch',
      classId: 'cls-001', courseId: 'crs-001', courseTitle: course1.title,
      institutionId: INSTITUTION_ID, institutionName: institution.name,
      issuedById: 'usr-sec-001', issuedByName: 'Marie Brunner',
      status: 'issued', eqfLevel: 5, ects: 3,
      skills: course1.skills, outcomes: course1.outcomes,
      issuedAt: '2026-05-14T11:29:31.000Z',
      expiresAt: '2029-05-14T11:29:31.000Z',
      verificationCount: 0,
    },
    {
      id: 'crd-004',
      credentialId: 'MCRED-BFH-2026-00479',
      studentId: 'stu-003', studentName: 'Amélie Dubois', studentEmail: 'amelie.dubois@student.bfh.ch',
      classId: 'cls-002', courseId: 'crs-002', courseTitle: courses[1].title,
      institutionId: INSTITUTION_ID, institutionName: institution.name,
      issuedById: 'usr-sec-001', issuedByName: 'Marie Brunner',
      status: 'revoked', eqfLevel: 6, ects: 4,
      skills: courses[1].skills, outcomes: courses[1].outcomes,
      issuedAt: '2026-05-02T10:00:00.000Z',
      expiresAt: '2029-05-02T10:00:00.000Z',
      revokedAt: '2026-05-13T14:55:09.000Z',
      revokedReason: 'Plagiarism confirmed by academic integrity committee.',
      verificationCount: 0,
    },
    {
      id: 'crd-005',
      credentialId: 'MCRED-BFH-2026-00484',
      studentId: 'stu-005', studentName: 'Noa Schneider', studentEmail: 'noa.schneider@student.bfh.ch',
      classId: 'cls-004', courseId: 'crs-004', courseTitle: courses[3].title,
      institutionId: INSTITUTION_ID, institutionName: institution.name,
      issuedById: 'usr-sec-001', issuedByName: 'Marie Brunner',
      status: 'issued', eqfLevel: 4, ects: 2,
      skills: courses[3].skills, outcomes: courses[3].outcomes,
      issuedAt: '2026-05-10T09:55:30.000Z',
      expiresAt: '2028-05-10T09:55:30.000Z',
      verificationCount: 2,
    },
  ]

  // ─── Audit log ────────────────────────────────────────────────────────────
  const log: AuditEntry[] = [
    { id: 'LOG-2026-0041', userId: 'usr-sec-001', userName: 'Marie Brunner', userEmail: 'secretariat@bfh.ch', userRole: 'secretariat', action: 'Credential Issued', objectType: 'Credential', objectName: 'MCRED-BFH-2026-00482', objectId: 'crd-001', newValue: JSON.stringify({ student: 'Sarah Keller', status: 'issued' }), status: 'success', sessionId: 'sess_9f2a1b3c', ipAddress: '195.148.127.84', scope: 'operational', createdAt: '2026-05-14T11:30:02.000Z' },
    { id: 'LOG-2026-0038', userId: 'usr-lec-001', userName: 'Prof. Dr. Anna Steiner', userEmail: 'a.steiner@bfh.ch', userRole: 'lecturer', action: 'Completion Status Changed', objectType: 'Student', objectName: 'Luca Meier', objectId: 'stu-002', prevValue: '"In Progress"', newValue: '"Completed"', status: 'success', reason: 'All assignments submitted.', sessionId: 'sess_4c8d2e1f', ipAddress: '85.0.103.42', scope: 'lecturer', createdAt: '2026-05-14T11:15:44.000Z' },
    { id: 'LOG-2026-0032', userId: 'usr-sec-001', userName: 'Marie Brunner', userEmail: 'secretariat@bfh.ch', userRole: 'secretariat', action: 'Course Created', objectType: 'Course', objectName: 'Digital Marketing Fundamentals', objectId: 'crs-001', newValue: JSON.stringify({ title: 'Digital Marketing Fundamentals' }), status: 'success', sessionId: 'sess_7e1f4a2b', ipAddress: '195.148.127.84', scope: 'operational', createdAt: '2026-05-14T09:20:11.000Z' },
    { id: 'LOG-2026-0031', userId: 'usr-admin-001', userName: 'Dr. Hans Zimmermann', userEmail: 'admin@bfh.ch', userRole: 'admin', action: 'Credential Revoked', objectType: 'Credential', objectName: 'MCRED-BFH-2026-00479', objectId: 'crd-004', prevValue: '"issued"', newValue: '"revoked"', status: 'success', reason: 'Plagiarism confirmed.', sessionId: 'sess_2a9c7d4e', ipAddress: '10.0.1.15', scope: 'admin', createdAt: '2026-05-13T14:55:09.000Z' },
    { id: 'LOG-2026-0030', userId: 'usr-admin-001', userName: 'Dr. Hans Zimmermann', userEmail: 'admin@bfh.ch', userRole: 'admin', action: 'User Role Changed', objectType: 'User', objectName: 'secretariat@bfh.ch', objectId: 'usr-sec-001', prevValue: '"lecturer"', newValue: '"secretariat"', status: 'success', sessionId: 'sess_2a9c7d4e', ipAddress: '10.0.1.15', scope: 'admin', createdAt: '2026-05-13T09:10:00.000Z' },
  ]

  // ─── Write all blobs ──────────────────────────────────────────────────────
  await Promise.all([
    writeBlob(BLOB_KEYS.institutions, [institution]),
    writeBlob(BLOB_KEYS.users, users),
    writeBlob(BLOB_KEYS.courses, courses),
    writeBlob(BLOB_KEYS.classes, classes),
    writeBlob(BLOB_KEYS.students, students),
    writeBlob(BLOB_KEYS.credentials, creds),
    writeBlob(BLOB_KEYS.scores, scores),
    writeBlob(BLOB_KEYS.log, log),
    writeBlob(BLOB_KEYS.verifications, []),
  ])

  // Write individual credential blobs for public verification
  await Promise.all(creds.map(c =>
    writeBlob(`mcred/credentials/${c.credentialId}.json`, c)
  ))

  return NextResponse.json({
    ok: true,
    seeded: {
      institutions: 1,
      users: users.length,
      courses: courses.length,
      classes: classes.length,
      students: students.length,
      credentials: creds.length,
      scores: scores.length,
    },
    logins: {
      admin:       'admin@bfh.ch / password123',
      secretariat: 'secretariat@bfh.ch / password123',
      lecturer:    'a.steiner@bfh.ch / password123',
      developer:   'dev@m-cred.ch / password123',
      student:     'sarah.keller@student.bfh.ch / student123',
    },
  })
}
