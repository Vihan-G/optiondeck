'use client'

import { useMemo, useState } from 'react'
import { LegForm } from '@/components/LegForm'
import { LegCard } from '@/components/LegCard'
import { PayoffChart } from '@/components/PayoffChart'
import { MetricsBar } from '@/components/MetricsBar'
import { StrategyBadge } from '@/components/StrategyBadge'
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

  function addLeg(input: Omit<Leg, 'id'>) {
    setLegs((prev) => [...prev, { ...input, id: newId() }])
  }
  function deleteLeg(id: string) {
    setLegs((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">optiondeck</h1>
        <p className="mt-1 text-sm text-[#888]">
          Options strategy payoff visualizer
        </p>
      </header>

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
            <PayoffChart curve={metrics.payoffCurve} />
          </div>
        </section>
      </div>
    </main>
  )
}
