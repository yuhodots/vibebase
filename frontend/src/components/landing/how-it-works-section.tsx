'use client'

import { useTranslations } from 'next-intl'
import { GitBranch, Settings, Rocket } from 'lucide-react'
import { ScrollFadeIn } from './scroll-fade-in'

type StepProps = {
  stepNumber: number
  title: string
  description: string
  icon: React.ReactNode
}

function StepCard({ stepNumber, title, description, icon }: StepProps) {
  return (
    <div className="relative flex-1">
      {/* Number watermark */}
      <div className="absolute -top-6 left-0 text-[7rem] font-black text-primary/[0.04] leading-none select-none pointer-events-none">
        {stepNumber}
      </div>
      <div className="relative pt-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
          <div className="w-7 h-7 text-primary">{icon}</div>
        </div>
        <h3 className="text-xl font-semibold mb-3 tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export function HowItWorksSection() {
  const t = useTranslations('landing')

  const steps = [
    { icon: <GitBranch className="w-7 h-7" />, titleKey: 'step1Title' as const, descKey: 'step1Desc' as const },
    { icon: <Settings className="w-7 h-7" />, titleKey: 'step2Title' as const, descKey: 'step2Desc' as const },
    { icon: <Rocket className="w-7 h-7" />, titleKey: 'step3Title' as const, descKey: 'step3Desc' as const },
  ]

  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6 lg:px-12 landing-section-divided">
      <div className="max-w-[1400px] mx-auto">
        <ScrollFadeIn className="text-center mb-20">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            {t('howItWorksBadge')}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {t('howItWorksSubtitle')}
          </p>
        </ScrollFadeIn>

        <div className="relative grid md:grid-cols-3 gap-16 md:gap-12">
          {/* Connecting lines (desktop) */}
          <div className="hidden md:block absolute top-[3.5rem] left-[calc(33.333%_-_1.5rem)] w-[calc(33.333%_+_3rem)] border-t-2 border-dashed border-primary/15" />
          <div className="hidden md:block absolute top-[3.5rem] left-[calc(66.666%_-_1.5rem)] w-[calc(33.333%_+_3rem)] border-t-2 border-dashed border-primary/15" />

          {steps.map((step, i) => (
            <ScrollFadeIn key={step.titleKey} delay={i * 0.15}>
              <StepCard
                stepNumber={i + 1}
                title={t(step.titleKey)}
                description={t(step.descKey)}
                icon={step.icon}
              />
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
