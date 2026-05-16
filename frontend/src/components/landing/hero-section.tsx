'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

function DashboardMockup() {
  const t = useTranslations('landing')

  const kpis = [
    {
      label: t('mock.users'),
      value: '128',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: t('mock.revenue'),
      value: '$4.2k',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      label: t('mock.growth'),
      value: '12.5%',
      color: 'bg-amber-500/10 text-amber-500',
    },
  ]

  const activities = [
    { text: t('mock.activity1'), time: t('mock.time1') },
    { text: t('mock.activity2'), time: t('mock.time2') },
    { text: t('mock.activity3'), time: t('mock.time3') },
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
          Vibebase — {t('mock.dashboard')}
        </span>
      </div>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20" />
          <span className="text-xs font-semibold">{t('mock.dashboard')}</span>
        </div>
        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-2">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border px-3 py-2.5 space-y-1"
            >
              <div
                className={`w-6 h-6 rounded-md ${kpi.color} flex items-center justify-center`}
              >
                <div className="w-3 h-3 rounded-sm bg-current opacity-40" />
              </div>
              <div className="text-sm font-bold">{kpi.value}</div>
              <div className="text-[10px] text-muted-foreground">
                {kpi.label}
              </div>
            </div>
          ))}
        </div>
        {/* Activity list */}
        <div className="space-y-2">
          {activities.map((activity) => (
            <div
              key={activity.text}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted/40"
            >
              <div className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
              <span className="text-[10px] font-medium flex-1 truncate">
                {activity.text}
              </span>
              <span className="text-[9px] text-muted-foreground flex-shrink-0">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ApiMiniMockup() {
  const t = useTranslations('landing')

  const endpoints = [
    { method: 'GET', path: '/api/v1/users', color: 'bg-green-500/15 text-green-600 dark:text-green-400' },
    { method: 'POST', path: '/api/v1/auth/login', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
    { method: 'GET', path: '/api/v1/settings', color: 'bg-green-500/15 text-green-600 dark:text-green-400' },
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
          {t('mock.apiRoutes')}
        </span>
      </div>
      <div className="p-3 space-y-1.5">
        {endpoints.map((ep) => (
          <div
            key={ep.path}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md border"
          >
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${ep.color}`}
            >
              {ep.method}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">
              {ep.path}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HeroSection() {
  const t = useTranslations('landing')
  const shouldReduceMotion = useReducedMotion()

  const initial = shouldReduceMotion ? undefined : { opacity: 0, y: 30 }
  const inView = shouldReduceMotion ? undefined : { opacity: 1, y: 0 }

  return (
    <section className="relative min-h-screen landing-hero-bg overflow-hidden">
      {/* Glow orbs */}
      <div className="landing-glow top-[-10%] right-[10%] w-[500px] h-[500px] bg-primary/15" />
      <div className="landing-glow bottom-[5%] left-[-5%] w-[400px] h-[400px] bg-accent/10" />
      <div className="landing-glow top-[40%] left-[50%] w-[300px] h-[300px] bg-sky/8" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-28 pb-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          {/* Left: Text content */}
          <div className="max-w-2xl">
            <motion.div
              initial={initial}
              whileInView={inView}
              viewport={{}}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-card/80 backdrop-blur-sm text-xs font-medium text-muted-foreground mb-8"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {t('heroBadge')}
            </motion.div>

            <motion.h1
              initial={initial}
              whileInView={inView}
              viewport={{}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] whitespace-pre-line"
            >
              {t('heroTitle')}
            </motion.h1>

            <motion.p
              initial={initial}
              whileInView={inView}
              viewport={{}}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg"
            >
              {t('heroSubtitle')}
            </motion.p>

            <motion.div
              initial={initial}
              whileInView={inView}
              viewport={{}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg" className="h-12 text-base px-8 gap-2 shadow-lg shadow-primary/20">
                <Link href="/dashboard">
                  {t('ctaStart')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-12 text-base px-8 bg-card/50 backdrop-blur-sm"
                onClick={() =>
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                {t('ctaLearnMore')}
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={initial}
              whileInView={inView}
              viewport={{}}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="mt-12 flex items-center gap-6 text-muted-foreground/60"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-muted-foreground">
                  {t('heroTech1')}
                </span>
              </div>
              <div className="h-4 w-px bg-border" />
              <span className="text-sm">{t('heroTech2')}</span>
            </motion.div>
          </div>

          {/* Right: Mockup images */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, x: 40 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative lg:pl-8"
          >
            <div className="relative">
              {/* Main mockup */}
              <div className="relative z-10">
                <DashboardMockup />
              </div>
              {/* Secondary mockup - offset */}
              <div className="absolute -bottom-8 -right-4 lg:-right-8 w-[65%] z-20">
                <ApiMiniMockup />
              </div>
              {/* Background glow behind mockups */}
              <div className="absolute inset-0 -m-8 bg-primary/5 rounded-3xl blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
