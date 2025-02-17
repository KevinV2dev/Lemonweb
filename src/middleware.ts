import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si no hay sesión y está intentando acceder a /admin
  if (!session && req.nextUrl.pathname.startsWith('/admin')) {
    // Permitir acceso solo a la página de login
    if (req.nextUrl.pathname === '/admin/login') {
      return res
    }
    // Redirigir a login para cualquier otra ruta de admin
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Si hay sesión y está en la página de login, redirigir al dashboard
  if (session && req.nextUrl.pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*']
} 