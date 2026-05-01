import type { Leg, PayoffPoint } from './types'

const CURVE_RESOLUTION = 200

export function legPayoffAtPrice(leg: Leg, price: number): number {
  const intrinsic =
    leg.type === 'call'
      ? Math.max(price - leg.strike, 0)
      : Math.max(leg.strike - price, 0)

  const perShare =
    leg.direction === 'long' ? intrinsic - leg.premium : leg.premium - intrinsic

  return perShare * leg.quantity
}

export function totalPayoffAtPrice(legs: Leg[], price: number): number {
  let sum = 0
  for (const leg of legs) sum += legPayoffAtPrice(leg, price)
  return sum
}

export function priceRange(legs: Leg[]): { min: number; max: number } {
  if (legs.length === 0) return { min: 0, max: 100 }
  const strikes = legs.map((l) => l.strike)
  const lowest = Math.min(...strikes)
  const highest = Math.max(...strikes)
  const min = Math.max(0, lowest * 0.7)
  const max = highest * 1.3
  if (min === max) {
    const pad = Math.max(1, lowest * 0.3)
    return { min: Math.max(0, lowest - pad), max: lowest + pad }
  }
  return { min, max }
}

export function buildPayoffCurve(legs: Leg[]): PayoffPoint[] {
  const { min, max } = priceRange(legs)
  if (legs.length === 0) return []
  const step = (max - min) / (CURVE_RESOLUTION - 1)
  const out: PayoffPoint[] = []
  for (let i = 0; i < CURVE_RESOLUTION; i++) {
    const price = min + step * i
    out.push({ price, payoff: totalPayoffAtPrice(legs, price) })
  }
  return out
}

export function findBreakevens(curve: PayoffPoint[]): number[] {
  const breakevens: number[] = []
  for (let i = 1; i < curve.length; i++) {
    const prev = curve[i - 1]
    const cur = curve[i]
    if (prev.payoff === 0) {
      breakevens.push(prev.price)
      continue
    }
    if (
      (prev.payoff < 0 && cur.payoff > 0) ||
      (prev.payoff > 0 && cur.payoff < 0)
    ) {
      const t = -prev.payoff / (cur.payoff - prev.payoff)
      breakevens.push(prev.price + t * (cur.price - prev.price))
    }
  }
  if (curve.length > 0) {
    const last = curve[curve.length - 1]
    if (last.payoff === 0) breakevens.push(last.price)
  }
  return dedupePrices(breakevens)
}

function dedupePrices(prices: number[]): number[] {
  const out: number[] = []
  for (const p of prices) {
    if (!out.some((q) => Math.abs(q - p) < 0.01)) out.push(p)
  }
  return out
}

export function hasUnboundedUpside(legs: Leg[]): boolean {
  let netLongCallContracts = 0
  for (const leg of legs) {
    if (leg.type === 'call') {
      netLongCallContracts +=
        (leg.direction === 'long' ? 1 : -1) * leg.quantity
    }
  }
  return netLongCallContracts > 0
}

export function hasUnboundedDownside(legs: Leg[]): boolean {
  let netShortCallContracts = 0
  let netShortPutContracts = 0
  for (const leg of legs) {
    if (leg.type === 'call') {
      netShortCallContracts +=
        (leg.direction === 'short' ? 1 : -1) * leg.quantity
    } else {
      netShortPutContracts +=
        (leg.direction === 'short' ? 1 : -1) * leg.quantity
    }
  }
  return netShortCallContracts > 0 || netShortPutContracts > 0
}
