import { auth } from '@/auth'
import createIntlMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/navigation'

const intlMiddleware = createIntlMiddleware(routing)

// Set AUTH_DISABLED=true in .env.local to bypass authentication
const isAuthDisabled = process.env.AUTH_DISABLED === 'true'

// Add routes that require authentication here
const protectedRoutes = ['/dashboard', '/settings']

function isProtectedRoute(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/'
  return protectedRoutes.some((route) => pathWithoutLocale.startsWith(route))
}

function isLoginRoute(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(ko|en)/, '') || '/'
  return pathWithoutLocale === '/login'
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth?.user

  // Skip auth checks if disabled
  if (isAuthDisabled) {
    return intlMiddleware(req as NextRequest)
  }

  if (isLoginRoute(nextUrl.pathname)) {
    if (isLoggedIn) {
      const locale = nextUrl.pathname.match(/^\/(ko|en)/)?.[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, nextUrl))
    }
  }

  if (isProtectedRoute(nextUrl.pathname)) {
    if (!isLoggedIn) {
      const locale = nextUrl.pathname.match(/^\/(ko|en)/)?.[1] || 'en'
      return NextResponse.redirect(new URL(`/${locale}/login`, nextUrl))
    }
  }

  return intlMiddleware(req as NextRequest)
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
