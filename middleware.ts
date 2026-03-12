import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROLE = 'ADMIN'

const BUYER_ROUTES = [
  '/dashboard',
  '/products',
  '/orders',
  '/wallet',
  '/settings',
]

const ADMIN_ROUTES = ['/admin']

function isProtected(pathname: string): boolean {
  if (pathname.startsWith('/admin')) return true
  return BUYER_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'))
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const role = request.cookies.get('user_role')?.value ?? ''
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== ADMIN_ROLE) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (isProtected(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      if (role === ADMIN_ROLE) return NextResponse.redirect(new URL('/admin', request.url))
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/products/:path*',
    '/orders/:path*',
    '/wallet/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
}
