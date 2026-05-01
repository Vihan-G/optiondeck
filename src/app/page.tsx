'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
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
  function clearAll() {
    setLegs([])
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8 lg:px-8">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            optiondeck
          </h1>
          <p className="mt-0.5 text-xs text-[#888] sm:text-sm">
            Options strategy payoff visualizer
          </p>
        </div>
        {legs.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="rounded-md border border-[#222] px-2.5 py-1 font-mono text-xs text-[#888] transition-colors hover:border-[#ef4444]/40 hover:text-[#ef4444]"
          >
            Clear
          </button>
        )}
      </header>

      <div className="mb-6">
        <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#888]">
          Presets
        </h2>
        <Presets onLoad={loadPreset} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <section className="order-2 space-y-4 lg:order-none">
          <div className="rounded-lg border border-[#222] bg-[#111] p-5">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[#888]">
              Add leg
            </h2>
            <LegForm onAdd={addLeg} />
          </div>

          <div className="space-y-2">
            {legs.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#222] px-4 py-6 text-center text-xs text-[#666]">
                No legs yet — add one above or load a preset
              </p>
            ) : (
              <AnimatePresence initial={false}>
                {legs.map((leg) => (
                  <LegCard key={leg.id} leg={leg} onDelete={deleteLeg} />
                ))}
              </AnimatePresence>
            )}
          </div>
        </section>

        <section className="order-1 space-y-4 lg:order-none">
          {legs.length > 0 && (
            <>
              <StrategyBadge metrics={metrics} />
              <MetricsBar metrics={metrics} />
            </>
          )}
          <div className="rounded-lg border border-[#222] bg-[#111] p-3 sm:p-4 lg:p-6">
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

      <footer className="mt-12 border-t border-[#222] pt-4 text-center font-mono text-[10px] text-[#444]">
        client-side math · no login · no brokerage
      </footer>
    </main>
  )
}
