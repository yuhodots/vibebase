'use client'

import { useTranslations } from 'next-intl'
import { ScrollFadeIn } from './scroll-fade-in'
import { AnimatedCounter } from './animated-counter'
import { KeyRound, Languages, Blocks, Zap } from 'lucide-react'

export function StatsSection() {
  const t = useTranslations('landing')

  const stats = [
    {
      icon: <KeyRound className="w-6 h-6" />,
      target: 2,
      suffix: '',
      labelKey: 'stat1Label' as const,
    },
    {
      icon: <Languages className="w-6 h-6" />,
      target: 2,
      suffix: '',
      labelKey: 'stat2Label' as const,
    },
    {
      icon: <Blocks className="w-6 h-6" />,
      target: 10,
      suffix: '+',
      labelKey: 'stat3Label' as const,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      target: 24,
      suffix: '/7',
      labelKey: 'stat4Label' as const,
    },
  ]

  return (
    <section className="py-20 md:py-28 px-6 lg:px-12 landing-gradient-stats">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <ScrollFadeIn key={stat.labelKey} delay={i * 0.1}>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
                  <AnimatedCounter
                    target={stat.target}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {t(stat.labelKey)}
                </div>
              </div>
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
