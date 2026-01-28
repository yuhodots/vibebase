import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { Button } from '@/components/ui/button'
import { Zap, Shield, Globe } from 'lucide-react'

export default function LandingPage() {
  const t = useTranslations('landing')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Vibebase</span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t('title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mb-8">
          {t('description')}
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">{t('cta')}</Link>
        </Button>
      </main>

      {/* Features */}
      <section className="px-6 py-16 border-t">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{t('feature1Title')}</h3>
            <p className="text-sm text-muted-foreground">{t('feature1Desc')}</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{t('feature2Title')}</h3>
            <p className="text-sm text-muted-foreground">{t('feature2Desc')}</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{t('feature3Title')}</h3>
            <p className="text-sm text-muted-foreground">{t('feature3Desc')}</p>
          </div>
        </div>
      </section>
    </div>
  )
}
