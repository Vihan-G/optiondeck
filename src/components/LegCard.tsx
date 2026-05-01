'use client'

import type { Leg } from '@/lib/types'

interface Props {
  leg: Leg
  onDelete: (id: string) => void
}

export function LegCard({ leg, onDelete }: Props) {
  const isLong = leg.direction === 'long'
  const accent = isLong ? '#22c55e' : '#ef4444'

  return (
    <div
      className="relative flex items-center justify-between overflow-hidden rounded-md border border-[#222] bg-[#111] px-4 py-3"
    >
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: accent }}
      />
      <div className="ml-2 font-mono text-sm">
        <span
          className="font-semibold uppercase tracking-wider"
          style={{ color: accent }}
        >
          {leg.direction} {leg.type}
        </span>
        <span className="ml-2 text-[#ededed]">${leg.strike.toFixed(2)}</span>
        <span className="ml-2 text-[#888]">@ ${leg.premium.toFixed(2)}</span>
        {leg.quantity > 1 && (
          <span className="ml-2 text-[#888]">×{leg.quantity}</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDelete(leg.id)}
        aria-label="Delete leg"
        className="ml-3 flex h-6 w-6 items-center justify-center rounded text-[#666] transition-colors hover:bg-[#222] hover:text-[#ededed]"
      >
        ✕
      </button>
    </div>
  )
}
