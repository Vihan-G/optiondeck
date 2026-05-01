'use client'

import { useEffect, useMemo, useState } from 'react'
import { LegForm } from '@/components/LegForm'
import { LegCard } from '@/components/LegCard'
import { PayoffChart } from '@/components/PayoffChart'
import { MetricsBar } from '@/components/MetricsBar'
import { StrategyBadge } from '@/components/StrategyBadge'
import { PriceSlider } from '@/components/PriceSlider'
import { Presets } from '@/components/Presets'
import { computeMetrics } from '@/lib/strategies'
import type { Leg } from '@/lib/types'

function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

export default function Home() {
  const [legs, setLegs] = useState<Leg[]>([])
  const metrics = useMemo(() => computeMetrics(legs), [legs])
  const [sliderPrice, setSliderPrice] = useState<number | null>(null)

  useEffect(() => {
    if (legs.length === 0) {
      setSliderPrice(null)
      return
    }
    setSliderPrice((prev) => {
      const mid = (metrics.priceMin + metrics.priceMax) / 2
      if (prev == null) return mid
      if (prev < metrics.priceMin || prev > metrics.priceMax) return mid
      return prev
    })
  }, [legs.length, metrics.priceMin, metrics.priceMax])

  function addLeg(input: Omit<Leg, 'id'>) {
    setLegs((prev) => [...prev, { ...input, id: newId() }])
  }
  function deleteLeg(id: string) {
    setLegs((prev) => prev.filter((l) => l.id !== id))
  }
  function loadPreset(seeds: Omit<Leg, 'id'>[]) {
    setLegs(seeds.map((s) => ({ ...s, id: newId() })))
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">optiondeck</h1>
        <p className="mt-1 text-sm text-[#888]">
          Options strategy payoff visualizer
        </p>
      </header>

      <div className="mb-6">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#888]">
          Presets
        </h2>
        <Presets onLoad={loadPreset} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="space-y-4">
          <div className="rounded-lg border border-[#222] bg-[#111] p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#888]">
              Add leg
            </h2>
            <LegForm onAdd={addLeg} />
          </div>

          <div className="space-y-2">
            {legs.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#222] px-4 py-6 text-center text-xs text-[#666]">
                No legs yet — add one above
              </p>
            ) : (
              legs.map((leg) => (
                <LegCard key={leg.id} leg={leg} onDelete={deleteLeg} />
              ))
            )}
          </div>
        </section>

        <section className="space-y-4">
          {legs.length > 0 && (
            <>
              <StrategyBadge metrics={metrics} />
              <MetricsBar metrics={metrics} />
            </>
          )}
          <div className="rounded-lg border border-[#222] bg-[#111] p-4 lg:p-6">
            <PayoffChart
              curve={metrics.payoffCurve}
              highlightPrice={sliderPrice}
            />
          </div>
          {legs.length > 0 && sliderPrice != null && (
            <PriceSlider
              legs={legs}
              min={metrics.priceMin}
              max={metrics.priceMax}
              value={sliderPrice}
              onChange={setSliderPrice}
            />
          )}
        </section>
      </div>
    </main>
  )
}
