'use client'

import type { StrategyMetrics } from '@/lib/types'
import { formatCurrency, formatPrice } from '@/lib/format'

interface Props {
  metrics: StrategyMetrics
}

export function MetricsBar({ metrics }: Props) {
  const { maxProfit, maxLoss, breakevenPrices } = metrics

  return (
    <div className="grid grid-cols-3 gap-3">
      <Stat
        label="Max Profit"
        value={
          maxProfit === 'unlimited'
            ? 'Unlimited'
            : formatCurrency(maxProfit)
        }
        tone="green"
      />
      <Stat
        label="Max Loss"
        value={
          maxLoss === 'unlimited'
            ? 'Unlimited'
            : formatCurrency(maxLoss)
        }
        tone="red"
      />
      <Stat
        label={breakevenPrices.length > 1 ? 'Breakevens' : 'Breakeven'}
        value={
          breakevenPrices.length === 0
            ? '—'
            : breakevenPrices.map(formatPrice).join(' · ')
        }
        tone="neutral"
      />
    </div>
  )
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'green' | 'red' | 'neutral'
}) {
  const color =
    tone === 'green' ? '#22c55e' : tone === 'red' ? '#ef4444' : '#ededed'
  return (
    <div className="rounded-md border border-[#222] bg-[#111] px-4 py-3">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-[#888]">
        {label}
      </div>
      <div className="font-mono text-base" style={{ color }}>
        {value}
      </div>
    </div>
  )
}
