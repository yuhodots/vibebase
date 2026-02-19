'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function LandingFooter() {
  const t = useTranslations('landing')

  return (
    <footer className="py-16 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Brand */}
          <div>
            <span className="text-lg font-bold tracking-tight">
              Vibebase
            </span>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              {t('footerTagline')}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t('footerProduct')}
              </p>
              <nav className="flex flex-col gap-2.5">
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footerDashboard')}
                </Link>
                <Link
                  href="/help"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footerHelp')}
                </Link>
              </nav>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                {t('footerAccount')}
              </p>
              <nav className="flex flex-col gap-2.5">
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('footerLogin')}
                </Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {t('footerCopyright')}
          </span>
        </div>
      </div>
    </footer>
  )
}
