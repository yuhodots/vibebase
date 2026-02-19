'use client'

import { useTranslations } from 'next-intl'
import { Zap, Shield, Code, Globe } from 'lucide-react'
import { ScrollFadeIn } from './scroll-fade-in'
import { FeatureCard } from './feature-card'

export function FeaturesSection() {
  const t = useTranslations('landing')

  const features = [
    {
      icon: <Zap className="w-7 h-7" />,
      titleKey: 'feature1Title' as const,
      descKey: 'feature1Desc' as const,
      accent: 'mint' as const,
    },
    {
      icon: <Shield className="w-7 h-7" />,
      titleKey: 'feature2Title' as const,
      descKey: 'feature2Desc' as const,
      accent: 'coral' as const,
    },
    {
      icon: <Code className="w-7 h-7" />,
      titleKey: 'feature3Title' as const,
      descKey: 'feature3Desc' as const,
      accent: 'sky' as const,
    },
    {
      icon: <Globe className="w-7 h-7" />,
      titleKey: 'feature4Title' as const,
      descKey: 'feature4Desc' as const,
      accent: 'gold' as const,
    },
  ]

  return (
    <section id="features" className="py-24 md:py-32 px-6 lg:px-12 landing-section-divided">
      <div className="max-w-[1400px] mx-auto">
        <ScrollFadeIn className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            {t('featuresBadge')}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
            {t('featuresTitle')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            {t('featuresSubtitle')}
          </p>
        </ScrollFadeIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <ScrollFadeIn key={feature.titleKey} delay={i * 0.1}>
              <FeatureCard
                icon={feature.icon}
                title={t(feature.titleKey)}
                description={t(feature.descKey)}
                accentColor={feature.accent}
              />
            </ScrollFadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
