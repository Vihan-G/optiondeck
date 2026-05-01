'use client'

import { totalPayoffAtPrice } from '@/lib/payoff'
import type { Leg } from '@/lib/types'
import { formatCurrency, formatPrice } from '@/lib/format'

interface Props {
  legs: Leg[]
  min: number
  max: number
  value: number
  onChange: (price: number) => void
}

export function PriceSlider({ legs, min, max, value, onChange }: Props) {
  const payoff = totalPayoffAtPrice(legs, value)
  const positive = payoff >= 0

  return (
    <div className="rounded-md border border-[#222] bg-[#111] px-4 py-4">
      <div className="mb-3 flex items-center justify-between font-mono text-xs">
        <div>
          <span className="text-[#888]">Underlying </span>
          <span className="text-[#ededed]">{formatPrice(value)}</span>
        </div>
        <div>
          <span className="text-[#888]">P&amp;L </span>
          <span style={{ color: positive ? '#22c55e' : '#ef4444' }}>
            {formatCurrency(payoff)}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={(max - min) / 400}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="od-slider w-full"
        aria-label="Underlying price"
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] text-[#666]">
        <span>{formatPrice(min)}</span>
        <span>{formatPrice(max)}</span>
      </div>
    </div>
  )
}
