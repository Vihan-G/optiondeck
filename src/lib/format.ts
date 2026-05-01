export function formatCurrency(n: number): string {
  const sign = n < 0 ? '-' : ''
  const abs = Math.abs(n)
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`
  if (abs >= 10_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`
  if (abs >= 100) return `${sign}$${abs.toFixed(0)}`
  return `${sign}$${abs.toFixed(2)}`
}

export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`
}
