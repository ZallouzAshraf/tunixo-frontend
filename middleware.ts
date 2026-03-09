import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROLE = 'ADMIN'
const SELLER_ROLE = 'SELLER'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const role = request.cookies.get('user_role')?.value ?? ''
  const { pathname } = request.nextUrl

  // Admin routes: /admin/*
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== ADMIN_ROLE) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Seller routes: /seller/*, /deposits/*, /withdrawals/*
  if (
    pathname.startsWith('/seller') ||
    pathname.startsWith('/deposits') ||
    pathname.startsWith('/withdrawals')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (role !== SELLER_ROLE && role !== ADMIN_ROLE) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Dashboard routes: /dashboard/*, /orders/*, /wallet/*, /settings/*
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/orders') ||
    pathname.startsWith('/wallet') ||
    pathname.startsWith('/settings')
  ) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Auth routes: /login, /register
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      if (role === ADMIN_ROLE) return NextResponse.redirect(new URL('/admin', request.url))
      if (role === SELLER_ROLE) return NextResponse.redirect(new URL('/seller', request.url))
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/seller/:path*',
    '/deposits/:path*',
    '/withdrawals/:path*',
    '/dashboard/:path*',
    '/orders/:path*',
    '/wallet/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
}
