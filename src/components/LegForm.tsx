'use client'

import { useState } from 'react'
import type { Leg, OptionType, Direction } from '@/lib/types'

interface Props {
  onAdd: (leg: Omit<Leg, 'id'>) => void
}

export function LegForm({ onAdd }: Props) {
  const [type, setType] = useState<OptionType>('call')
  const [direction, setDirection] = useState<Direction>('long')
  const [strike, setStrike] = useState('')
  const [premium, setPremium] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [error, setError] = useState<string | null>(null)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const s = parseFloat(strike)
    const p = parseFloat(premium)
    const q = parseInt(quantity, 10)
    if (!Number.isFinite(s) || s <= 0) return setError('Strike must be > 0')
    if (!Number.isFinite(p) || p <= 0) return setError('Premium must be > 0')
    if (!Number.isFinite(q) || q <= 0) return setError('Quantity must be ≥ 1')
    setError(null)
    onAdd({ type, direction, strike: s, premium: p, quantity: q })
    setStrike('')
    setPremium('')
    setQuantity('1')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-[#888]">
          Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <PillButton
            active={type === 'call'}
            onClick={() => setType('call')}
            label="Call"
          />
          <PillButton
            active={type === 'put'}
            onClick={() => setType('put')}
            label="Put"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-[#888]">
          Direction
        </label>
        <div className="grid grid-cols-2 gap-2">
          <PillButton
            active={direction === 'long'}
            onClick={() => setDirection('long')}
            label="Long"
            tone="green"
          />
          <PillButton
            active={direction === 'short'}
            onClick={() => setDirection('short')}
            label="Short"
            tone="red"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <NumberField
          label="Strike"
          value={strike}
          onChange={setStrike}
          placeholder="150"
          step="0.5"
        />
        <NumberField
          label="Premium"
          value={premium}
          onChange={setPremium}
          placeholder="3.50"
          step="0.05"
        />
      </div>

      <NumberField
        label="Quantity"
        value={quantity}
        onChange={setQuantity}
        placeholder="1"
        step="1"
      />

      {error && <p className="text-xs text-[#ef4444]">{error}</p>}

      <button
        type="submit"
        className="w-full rounded-md bg-[#3b82f6] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2563eb]"
      >
        Add leg
      </button>
    </form>
  )
}

function PillButton({
  active,
  onClick,
  label,
  tone = 'blue',
}: {
  active: boolean
  onClick: () => void
  label: string
  tone?: 'blue' | 'green' | 'red'
}) {
  const activeColors = {
    blue: 'bg-[#3b82f6] text-white border-[#3b82f6]',
    green: 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/40',
    red: 'bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/40',
  }[tone]
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border py-2 text-sm font-medium transition-colors ${
        active
          ? activeColors
          : 'border-[#222] bg-[#0a0a0a] text-[#888] hover:text-[#ededed]'
      }`}
    >
      {label}
    </button>
  )
}

function NumberField({
  label,
  value,
  onChange,
  placeholder,
  step,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  step: string
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-wider text-[#888]">
        {label}
      </label>
      <input
        type="number"
        inputMode="decimal"
        step={step}
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-[#222] bg-[#0a0a0a] px-3 py-2 font-mono text-sm text-[#ededed] placeholder:text-[#444] focus:border-[#3b82f6] focus:outline-none"
      />
    </div>
  )
}
