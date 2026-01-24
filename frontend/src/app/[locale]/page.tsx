import { useTranslations } from 'next-intl'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function Home() {
  const t = useTranslations('common')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">{t('hello')}</h1>
      <p className="text-muted-foreground">{t('welcome')}</p>
      <div className="flex gap-4">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </main>
  )
}
