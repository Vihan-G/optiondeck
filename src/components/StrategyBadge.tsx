'use client'

import type { StrategyMetrics } from '@/lib/types'

interface Props {
  metrics: StrategyMetrics
}

export function StrategyBadge({ metrics }: Props) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="inline-flex items-center rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3b82f6]">
        {metrics.name}
      </span>
      <span className="text-xs text-[#888]">{metrics.description}</span>
    </div>
  )
}
