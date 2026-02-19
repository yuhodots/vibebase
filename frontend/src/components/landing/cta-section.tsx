'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollFadeIn } from './scroll-fade-in'

export function CtaSection() {
  const t = useTranslations('landing')

  return (
    <section className="relative py-28 md:py-36 px-6 lg:px-12 landing-gradient-cta overflow-hidden">
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center">
        <ScrollFadeIn>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            {t('finalCtaTitle')}
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            {t('finalCtaSubtitle')}
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 text-base px-10 gap-2 shadow-lg shadow-primary/25"
          >
            <Link href="/dashboard">
              {t('finalCtaButton')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </ScrollFadeIn>
      </div>
    </section>
  )
}
