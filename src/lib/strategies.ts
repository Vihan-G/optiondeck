import type { Leg, StrategyMetrics } from './types'
import {
  buildPayoffCurve,
  findBreakevens,
  hasUnboundedDownside,
  hasUnboundedUpside,
  priceRange,
} from './payoff'

interface Detection {
  name: string
  description: string
}

export function detectStrategy(legs: Leg[]): Detection {
  if (legs.length === 0) {
    return {
      name: 'No Position',
      description: 'Add a leg to get started',
    }
  }

  const calls = legs.filter((l) => l.type === 'call')
  const puts = legs.filter((l) => l.type === 'put')
  const longCalls = calls.filter((l) => l.direction === 'long')
  const shortCalls = calls.filter((l) => l.direction === 'short')
  const longPuts = puts.filter((l) => l.direction === 'long')
  const shortPuts = puts.filter((l) => l.direction === 'short')

  if (legs.length === 1) {
    const l = legs[0]
    if (l.type === 'call' && l.direction === 'long')
      return {
        name: 'Long Call',
        description: 'Profit if price rises above strike + premium',
      }
    if (l.type === 'call' && l.direction === 'short')
      return {
        name: 'Short Call',
        description: 'Profit if price stays below strike — unlimited risk',
      }
    if (l.type === 'put' && l.direction === 'long')
      return {
        name: 'Long Put',
        description: 'Profit if price falls below strike − premium',
      }
    return {
      name: 'Short Put',
      description: 'Profit if price stays above strike',
    }
  }

  if (legs.length === 2) {
    if (longCalls.length === 1 && shortCalls.length === 1) {
      const long = longCalls[0]
      const short = shortCalls[0]
      if (long.strike < short.strike)
        return {
          name: 'Bull Call Spread',
          description: 'Defined-risk bullish play',
        }
      return {
        name: 'Bear Call Spread',
        description: 'Defined-risk bearish play',
      }
    }
    if (longPuts.length === 1 && shortPuts.length === 1) {
      const long = longPuts[0]
      const short = shortPuts[0]
      if (long.strike > short.strike)
        return {
          name: 'Bear Put Spread',
          description: 'Defined-risk bearish play',
        }
      return {
        name: 'Bull Put Spread',
        description: 'Defined-risk bullish play',
      }
    }
    if (longCalls.length === 1 && longPuts.length === 1) {
      if (longCalls[0].strike === longPuts[0].strike)
        return {
          name: 'Long Straddle',
          description: 'Profit on a big move in either direction',
        }
      if (longCalls[0].strike > longPuts[0].strike)
        return {
          name: 'Long Strangle',
          description: 'Cheaper bet on a big move — wider strikes',
        }
    }
    if (shortCalls.length === 1 && shortPuts.length === 1) {
      if (shortCalls[0].strike === shortPuts[0].strike)
        return {
          name: 'Short Straddle',
          description: 'Profit if price stays pinned at strike',
        }
      return {
        name: 'Short Strangle',
        description: 'Profit if price stays in a range',
      }
    }
  }

  if (
    legs.length === 4 &&
    longCalls.length === 1 &&
    shortCalls.length === 1 &&
    longPuts.length === 1 &&
    shortPuts.length === 1
  ) {
    const sortedShorts = [shortCalls[0], shortPuts[0]].sort(
      (a, b) => a.strike - b.strike
    )
    if (sortedShorts[0].strike === sortedShorts[1].strike)
      return {
        name: 'Iron Butterfly',
        description: 'Profit if price stays pinned — defined risk',
      }
    return {
      name: 'Iron Condor',
      description: 'Profit if underlying stays range-bound',
    }
  }

  return {
    name: 'Custom Strategy',
    description: `${legs.length} legs`,
  }
}

const UNLIMITED_DISPLAY_CAP = 1_000_000

export function computeMetrics(legs: Leg[]): StrategyMetrics {
  const { name, description } = detectStrategy(legs)
  const curve = buildPayoffCurve(legs)
  const { min, max } = priceRange(legs)

  if (curve.length === 0) {
    return {
      name,
      description,
      maxProfit: 0,
      maxLoss: 0,
      breakevenPrices: [],
      payoffCurve: [],
      priceMin: min,
      priceMax: max,
    }
  }

  const payoffs = curve.map((p) => p.payoff)
  const rawMaxProfit = Math.max(...payoffs)
  const rawMaxLoss = Math.min(...payoffs)

  const maxProfit: number | 'unlimited' =
    hasUnboundedUpside(legs) && rawMaxProfit > UNLIMITED_DISPLAY_CAP * 0.001
      ? 'unlimited'
      : rawMaxProfit

  const maxLoss: number | 'unlimited' =
    hasUnboundedDownside(legs) && rawMaxLoss < -UNLIMITED_DISPLAY_CAP * 0.001
      ? 'unlimited'
      : rawMaxLoss

  return {
    name,
    description,
    maxProfit,
    maxLoss,
    breakevenPrices: findBreakevens(curve),
    payoffCurve: curve,
    priceMin: min,
    priceMax: max,
  }
}
