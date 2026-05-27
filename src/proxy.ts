import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // The auth endpoint itself must remain public
  if (pathname === '/api/admin/auth') return NextResponse.next()

  const token = request.cookies.get('admin_token')?.value
  const expected = process.env.ADMIN_SESSION_TOKEN
  const isAuthed = Boolean(token && expected && token === expected)

  // API admin routes → 401 JSON (not a redirect, since these are fetch calls)
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthed) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // Login page is always accessible
  if (pathname === '/admin/login') return NextResponse.next()

  // All other /admin/* pages → redirect to login
  if (!isAuthed) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
