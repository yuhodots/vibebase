'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ko' : 'en'
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleLocale}>
      <Globe className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}
