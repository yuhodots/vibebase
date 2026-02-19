import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type AccentColor = 'mint' | 'coral' | 'sky' | 'gold'

type Props = {
  icon: ReactNode
  title: string
  description: string
  accentColor: AccentColor
}

const bgMap: Record<AccentColor, string> = {
  mint: 'bg-mint/10',
  coral: 'bg-coral/10',
  sky: 'bg-sky/10',
  gold: 'bg-gold/10',
}

const textMap: Record<AccentColor, string> = {
  mint: 'text-mint',
  coral: 'text-coral',
  sky: 'text-sky',
  gold: 'text-gold',
}

export function FeatureCard({ icon, title, description, accentColor }: Props) {
  return (
    <div className="landing-card group rounded-2xl border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div
        className={cn(
          'inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6',
          bgMap[accentColor]
        )}
      >
        <div className={cn('w-7 h-7', textMap[accentColor])}>{icon}</div>
      </div>
      <h3 className="text-lg font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
