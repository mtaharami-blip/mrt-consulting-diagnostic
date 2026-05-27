import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    const adminPassword = process.env.ADMIN_PASSWORD
    const sessionToken = process.env.ADMIN_SESSION_TOKEN

    if (!adminPassword || !sessionToken) {
      return NextResponse.json(
        { error: 'Admin credentials not configured on this server.' },
        { status: 500 }
      )
    }

    if (!password || password !== adminPassword) {
      // Constant-time-ish rejection to avoid timing attacks
      await new Promise((r) => setTimeout(r, 200))
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
}
