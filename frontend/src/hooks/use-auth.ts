'use client'

import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react'
import { useCallback } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()

  const signIn = useCallback((provider: 'google' | 'kakao') => {
    return nextAuthSignIn(provider, { callbackUrl: '/dashboard' })
  }, [])

  const signOut = useCallback(() => {
    return nextAuthSignOut({ callbackUrl: '/' })
  }, [])

  return {
    user: session?.user ?? null,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    role: session?.user?.role ?? 'user',
    isAdmin: session?.user?.role === 'admin',
    backendToken: session?.backendToken ?? null,
    signIn,
    signOut,
  }
}
