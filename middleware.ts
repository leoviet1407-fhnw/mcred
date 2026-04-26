import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Public routes
  const publicPaths = ['/', '/login', '/verify', '/api/auth', '/api/verify']
  const isPublic = publicPaths.some(p => pathname.startsWith(p))

  if (isPublic) return NextResponse.next()

  // Wallet requires student or any auth
  if (pathname.startsWith('/wallet')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login?type=student', req.url))
    }
    return NextResponse.next()
  }

  // App routes require auth
  if (!session) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url))
  }

  // Students can only access wallet
  if (session.user.role === 'student' && !pathname.startsWith('/wallet')) {
    return NextResponse.redirect(new URL('/wallet', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
