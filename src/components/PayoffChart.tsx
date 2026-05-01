'use client'

import { useMemo } from 'react'
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PayoffPoint } from '@/lib/types'
import { formatCurrency, formatPrice } from '@/lib/format'

interface Props {
  curve: PayoffPoint[]
  highlightPrice?: number | null
}

interface ChartPoint {
  price: number
  payoff: number
  profit: number
  loss: number
}

export function PayoffChart({ curve, highlightPrice }: Props) {
  const data = useMemo<ChartPoint[]>(
    () =>
      curve.map((p) => ({
        price: p.price,
        payoff: p.payoff,
        profit: Math.max(p.payoff, 0),
        loss: Math.min(p.payoff, 0),
      })),
    [curve]
  )

  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-md border border-dashed border-[#222] text-sm text-[#666] sm:h-[380px] lg:h-[440px]">
        Add a leg or load a preset to see the payoff curve
      </div>
    )
  }

  return (
    <div className="h-[320px] w-full sm:h-[380px] lg:h-[440px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 12, right: 16, bottom: 8, left: 8 }}
        >
          <defs>
            <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="lossFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.05} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0.35} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="price"
            type="number"
            domain={['dataMin', 'dataMax']}
            tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
            stroke="#444"
            tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font-geist-mono, monospace)' }}
            tickLine={false}
            axisLine={{ stroke: '#222' }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(Number(v))}
            stroke="#444"
            tick={{ fill: '#888', fontSize: 11, fontFamily: 'var(--font-geist-mono, monospace)' }}
            tickLine={false}
            axisLine={{ stroke: '#222' }}
            width={60}
          />

          <ReferenceLine y={0} stroke="#ededed" strokeOpacity={0.2} />

          <Area
            type="monotone"
            dataKey="profit"
            stroke="none"
            fill="url(#profitFill)"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Area
            type="monotone"
            dataKey="loss"
            stroke="none"
            fill="url(#lossFill)"
            isAnimationActive={true}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="payoff"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            animationDuration={300}
          />

          {highlightPrice != null && (
            <ReferenceLine
              x={highlightPrice}
              stroke="#ededed"
              strokeOpacity={0.5}
              strokeDasharray="3 3"
            />
          )}

          <Tooltip
            cursor={{ stroke: '#444', strokeWidth: 1 }}
            content={<ChartTooltip />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

interface TooltipPayloadEntry {
  payload: ChartPoint
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadEntry[]
}) {
  if (!active || !payload || payload.length === 0) return null
  const point = payload[0].payload
  const positive = point.payoff >= 0
  return (
    <div className="rounded-md border border-[#222] bg-[#0a0a0a] px-3 py-2 font-mono text-xs shadow-lg">
      <div className="text-[#888]">Price</div>
      <div className="mb-1 text-[#ededed]">{formatPrice(point.price)}</div>
      <div className="text-[#888]">P&amp;L</div>
      <div style={{ color: positive ? '#22c55e' : '#ef4444' }}>
        {formatCurrency(point.payoff)}
      </div>
    </div>
  )
}
