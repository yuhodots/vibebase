'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function LandingHeader() {
  const t = useTranslations('landing')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-12 h-16">
        <Link href="/" className="text-lg font-bold tracking-tight">
          Vibebase
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scrollTo('features')}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          >
            {t('nav.features')}
          </button>
          <button
            onClick={() => scrollTo('how-it-works')}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
          >
            {t('nav.howItWorks')}
          </button>
          <div className="w-px h-5 bg-border mx-2" />
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild size="sm" className="ml-3 shadow-sm">
            <Link href="/dashboard">{t('nav.getStarted')}</Link>
          </Button>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
