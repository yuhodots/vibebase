'use client'

import { ThemeProvider } from './theme-provider'
import { QueryProvider } from './query-provider'

type Props = {
  children: React.ReactNode
}

export function Providers({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  )
}
