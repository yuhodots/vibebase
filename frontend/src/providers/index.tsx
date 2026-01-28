'use client'

import { AuthProvider } from './auth-provider'
import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'

type Props = {
  children: React.ReactNode
}

export function Providers({ children }: Props) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryProvider>{children}</QueryProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
