'use client'

import type { Leg } from '@/lib/types'

type LegSeed = Omit<Leg, 'id'>

interface Preset {
  name: string
  legs: LegSeed[]
}

const PRESETS: Preset[] = [
  {
    name: 'Long Call',
    legs: [{ type: 'call', direction: 'long', strike: 500, premium: 8.5, quantity: 1 }],
  },
  {
    name: 'Long Put',
    legs: [{ type: 'put', direction: 'long', strike: 500, premium: 7.5, quantity: 1 }],
  },
  {
    name: 'Bull Call Spread',
    legs: [
      { type: 'call', direction: 'long', strike: 495, premium: 9, quantity: 1 },
      { type: 'call', direction: 'short', strike: 505, premium: 4, quantity: 1 },
    ],
  },
  {
    name: 'Bear Put Spread',
    legs: [
      { type: 'put', direction: 'long', strike: 505, premium: 9, quantity: 1 },
      { type: 'put', direction: 'short', strike: 495, premium: 4, quantity: 1 },
    ],
  },
  {
    name: 'Long Straddle',
    legs: [
      { type: 'call', direction: 'long', strike: 500, premium: 8.5, quantity: 1 },
      { type: 'put', direction: 'long', strike: 500, premium: 7.5, quantity: 1 },
    ],
  },
  {
    name: 'Long Strangle',
    legs: [
      { type: 'call', direction: 'long', strike: 510, premium: 4, quantity: 1 },
      { type: 'put', direction: 'long', strike: 490, premium: 4, quantity: 1 },
    ],
  },
  {
    name: 'Iron Condor',
    legs: [
      { type: 'put', direction: 'long', strike: 480, premium: 1, quantity: 1 },
      { type: 'put', direction: 'short', strike: 490, premium: 3, quantity: 1 },
      { type: 'call', direction: 'short', strike: 510, premium: 3, quantity: 1 },
      { type: 'call', direction: 'long', strike: 520, premium: 1, quantity: 1 },
    ],
  },
]

interface Props {
  onLoad: (legs: LegSeed[]) => void
}

export function Presets({ onLoad }: Props) {
  return (
    <div className="-mx-1 overflow-x-auto">
      <div className="flex gap-2 px-1 pb-1">
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => onLoad(p.legs)}
            className="shrink-0 rounded-md border border-[#222] bg-[#111] px-3 py-1.5 font-mono text-xs text-[#888] transition-colors hover:border-[#3b82f6]/50 hover:text-[#ededed]"
          >
            {p.name}
          </button>
        ))}
      </div>
    </div>
  )
}
