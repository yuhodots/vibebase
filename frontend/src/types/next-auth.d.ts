import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    backendToken?: string
    user: DefaultSession["user"] & {
      role?: string
      backendId?: number
    }
  }
  interface User extends DefaultUser {
    backendToken?: string
    role?: string
    backendId?: number
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    backendToken?: string
    role?: string
    backendId?: number
  }
}
