import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Kakao from 'next-auth/providers/kakao'

interface KakaoProfile {
  id: number
  kakao_account?: {
    profile?: {
      nickname?: string
      profile_image_url?: string
    }
    email?: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Kakao({
      clientId: process.env.AUTH_KAKAO_ID,
      clientSecret: process.env.AUTH_KAKAO_SECRET,
      profile(profile: KakaoProfile) {
        return {
          id: String(profile.id),
          name: profile.kakao_account?.profile?.nickname,
          email: profile.kakao_account?.email,
          image: profile.kakao_account?.profile?.profile_image_url,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return true

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const response = await fetch(`${apiUrl}/api/v1/auth/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(process.env.INTERNAL_API_SECRET && {
              'X-Internal-Secret': process.env.INTERNAL_API_SECRET,
            }),
          },
          body: JSON.stringify({
            provider: account.provider,
            providerId: account.providerAccountId,
            email: user.email,
            name: user.name,
            image: user.image,
          }),
        })

        if (!response.ok) {
          console.error('Backend auth callback failed:', response.status)
          return false
        }

        const data = await response.json()
        user.backendToken = data.token
        user.role = data.role ?? 'user'
        user.backendId = data.id
      } catch (error) {
        console.error('Backend auth callback failed:', error)
        return false
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken
        token.role = user.role
        token.backendId = user.backendId
      }
      return token
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken
      session.user.role = token.role
      session.user.backendId = token.backendId
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLogin = nextUrl.pathname.endsWith('/login')

      if (isOnLogin) {
        if (isLoggedIn) {
          const locale = nextUrl.pathname.match(/^\/(ko|en)/)?.[1] || 'en'
          return Response.redirect(new URL(`/${locale}/dashboard`, nextUrl))
        }
        return true
      }

      return true
    },
  },
})
