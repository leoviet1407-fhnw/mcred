import NextAuth from 'next-auth'
import type { Role } from './types'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getUserByEmail, getStudentByEmail, saveUser } from './data'

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        userType: { label: 'User Type', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string
        const userType = (credentials?.userType as string) || 'staff'
        if (!email || !password) return null
        if (userType === 'student') {
          const student = await getStudentByEmail(email)
          if (!student || !student.passwordHash) return null
          const valid = await bcrypt.compare(password, student.passwordHash)
          if (!valid) return null
          return { id: student.id, email: student.email, name: `${student.firstName} ${student.lastName}`, role: 'student' as Role, institutionId: student.institutionId }
        }
        const user = await getUserByEmail(email)
        if (!user || !user.isActive) return null
        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) return null
        await saveUser({ ...user, lastLoginAt: new Date().toISOString() })
        return { id: user.id, email: user.email, name: user.name, role: user.role as Role, institutionId: user.institutionId }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = user.role; token.institutionId = user.institutionId; token.userId = user.id }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.userId as string
      session.user.role = token.role as Role
      session.user.institutionId = token.institutionId as string
      return session
    },
  },
})
