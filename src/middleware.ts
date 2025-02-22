import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    // Obtener la sesión del usuario
    const { data: { session } } = await supabase.auth.getSession()
    const isAdmin = session?.user?.email === 'lemonsimplify@gmail.com'
    const isLoginPage = request.nextUrl.pathname === '/admin/login'

    // Si no hay sesión y no está en la página de login, redirigir al login
    if (!session && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Si hay sesión pero no es admin, cerrar sesión y redirigir al login
    if (session && !isAdmin) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Si es admin y está en la página de login, redirigir al admin
    if (isAdmin && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return res
  } catch (error) {
    console.error('Error en middleware:', error)
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*']
} 