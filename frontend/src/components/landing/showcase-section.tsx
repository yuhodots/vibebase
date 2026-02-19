'use client'

import { useTranslations } from 'next-intl'
import { Shield, Code } from 'lucide-react'
import { ScrollFadeIn } from './scroll-fade-in'

function AuthMockup() {
  const t = useTranslations('landing')

  const navItems = [
    { label: t('mock.navHome'), active: false },
    { label: t('mock.navDashboard'), active: true },
    { label: t('mock.navSettings'), active: false },
    { label: t('mock.navHelp'), active: false },
  ]

  const tableRows = [
    { name: t('mock.userName1'), email: t('mock.userEmail1'), role: t('mock.roleAdmin') },
    { name: t('mock.userName2'), email: t('mock.userEmail2'), role: t('mock.roleUser') },
    { name: t('mock.userName3'), email: t('mock.userEmail3'), role: t('mock.roleUser') },
  ]

  return (
    <div className="landing-window bg-card">
      <div className="px-4 py-3 border-b bg-muted/40 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <span className="ml-2 text-[11px] text-muted-foreground font-medium">
          {t('mock.adminPanel')}
        </span>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-28 border-r bg-muted/20 p-3 space-y-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`text-[10px] font-medium px-2 py-1.5 rounded-md ${
                item.active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted/40'
              }`}
            >
              {item.label}
            </div>
          ))}
        </div>
        {/* Main area - data table */}
        <div className="flex-1 p-3">
          <div className="text-[10px] font-semibold mb-2">
            {t('mock.userManagement')}
          </div>
          <div className="border rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-muted/40 px-2 py-1.5">
              <span className="text-[9px] font-semibold text-muted-foreground">
                {t('mock.colName')}
              </span>
              <span className="text-[9px] font-semibold text-muted-foreground">
                {t('mock.colEmail')}
              </span>
              <span className="text-[9px] font-semibold text-muted-foreground">
                {t('mock.colRole')}
              </span>
            </div>
            {/* Table rows */}
            {tableRows.map((row) => (
              <div
                key={row.email}
                className="grid grid-cols-3 px-2 py-1.5 border-t"
              >
                <span className="text-[9px] font-medium">{row.name}</span>
                <span className="text-[9px] text-muted-foreground">
                  {row.email}
                </span>
                <span
                  className={`text-[9px] font-medium ${
                    row.role === t('mock.roleAdmin')
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {row.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CodeMockup() {
  const t = useTranslations('landing')

  return (
    <div className="landing-window bg-card">
      <div className="px-4 py-3 border-b bg-muted/40 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
          <div className="w-3 h-3 rounded-full bg-green-400/70" />
        </div>
        <span className="ml-2 text-[11px] text-muted-foreground font-medium">
          {t('mock.codeFile')}
        </span>
      </div>
      <div className="p-4 font-mono text-[11px] leading-relaxed space-y-1">
        <div>
          <span className="text-purple-500 dark:text-purple-400">@router</span>
          <span className="text-muted-foreground">.get(</span>
          <span className="text-green-600 dark:text-green-400">&quot;/users&quot;</span>
          <span className="text-muted-foreground">)</span>
        </div>
        <div>
          <span className="text-blue-500 dark:text-blue-400">async def </span>
          <span className="text-amber-600 dark:text-amber-400">list_users</span>
          <span className="text-muted-foreground">(</span>
        </div>
        <div className="pl-4">
          <span className="text-foreground">db</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-cyan-600 dark:text-cyan-400">AsyncSession</span>
          <span className="text-muted-foreground"> = </span>
          <span className="text-amber-600 dark:text-amber-400">Depends</span>
          <span className="text-muted-foreground">(get_db)</span>
        </div>
        <div>
          <span className="text-muted-foreground">):</span>
        </div>
        <div className="pl-4">
          <span className="text-foreground">users</span>
          <span className="text-muted-foreground"> = </span>
          <span className="text-blue-500 dark:text-blue-400">await </span>
          <span className="text-foreground">db.execute(</span>
        </div>
        <div className="pl-8">
          <span className="text-amber-600 dark:text-amber-400">select</span>
          <span className="text-muted-foreground">(</span>
          <span className="text-cyan-600 dark:text-cyan-400">User</span>
          <span className="text-muted-foreground">)</span>
        </div>
        <div className="pl-4">
          <span className="text-muted-foreground">)</span>
        </div>
        <div className="pl-4">
          <span className="text-blue-500 dark:text-blue-400">return </span>
          <span className="text-foreground">users.scalars().all()</span>
        </div>
      </div>
    </div>
  )
}

export function ShowcaseSection() {
  const t = useTranslations('landing')

  return (
    <section className="py-24 md:py-32 px-6 lg:px-12 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative">
        <ScrollFadeIn className="text-center mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            {t('showcaseBadge')}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
            {t('showcaseTitle')}
          </h2>
        </ScrollFadeIn>

        {/* Panel 1: Auth & Dashboard */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
          <ScrollFadeIn direction="left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card text-xs font-medium text-muted-foreground mb-6">
                <Shield className="w-3.5 h-3.5 text-primary" />
                {t('showcase1Badge')}
              </div>
              <h3 className="text-2xl md:text-4xl font-bold mb-5 tracking-tight leading-tight">
                {t('showcase1Title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {t('showcase1Desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    'showcase1Tag1',
                    'showcase1Tag2',
                    'showcase1Tag3',
                    'showcase1Tag4',
                  ] as const
                ).map((key) => (
                  <span
                    key={key}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15"
                  >
                    {t(key)}
                  </span>
                ))}
              </div>
            </div>
          </ScrollFadeIn>
          <ScrollFadeIn direction="right">
            <AuthMockup />
          </ScrollFadeIn>
        </div>

        {/* Panel 2: API & Data */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <ScrollFadeIn direction="left" className="order-2 lg:order-1">
            <CodeMockup />
          </ScrollFadeIn>
          <ScrollFadeIn direction="right" className="order-1 lg:order-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card text-xs font-medium text-muted-foreground mb-6">
                <Code className="w-3.5 h-3.5 text-primary" />
                {t('showcase2Badge')}
              </div>
              <h3 className="text-2xl md:text-4xl font-bold mb-5 tracking-tight leading-tight">
                {t('showcase2Title')}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg mb-8">
                {t('showcase2Desc')}
              </p>
              <div className="flex flex-wrap gap-3">
                {(
                  [
                    'showcase2Tag1',
                    'showcase2Tag2',
                    'showcase2Tag3',
                    'showcase2Tag4',
                  ] as const
                ).map((key) => (
                  <span
                    key={key}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-sky/8 text-sky border border-sky/15"
                  >
                    {t(key)}
                  </span>
                ))}
              </div>
            </div>
          </ScrollFadeIn>
        </div>
      </div>
    </section>
  )
}
