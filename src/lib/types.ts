export type OptionType = 'call' | 'put'
export type Direction = 'long' | 'short'

export interface Leg {
  id: string
  type: OptionType
  direction: Direction
  strike: number
  premium: number
  quantity: number
}

export interface PayoffPoint {
  price: number
  payoff: number
}

export interface StrategyMetrics {
  name: string
  description: string
  maxProfit: number | 'unlimited'
  maxLoss: number | 'unlimited'
  breakevenPrices: number[]
  payoffCurve: PayoffPoint[]
  priceMin: number
  priceMax: number
}
