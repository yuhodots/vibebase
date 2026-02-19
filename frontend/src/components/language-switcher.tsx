'use client'

import { useTransition, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n'
import { Loader2 } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const toggleLocale = useCallback(() => {
    const newLocale = locale === 'en' ? 'ko' : 'en'
    startTransition(() => {
      router.replace(pathname, { locale: newLocale })
    })
  }, [locale, pathname, router])

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="inline-flex items-center justify-center h-9 px-2.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-50 tracking-wide"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <span>{locale === 'ko' ? 'EN' : 'KR'}</span>
      )}
      <span className="sr-only">Toggle language</span>
    </button>
  )
}
