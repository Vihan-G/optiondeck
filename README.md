# optiondeck

**Options strategy payoff visualizer.** No login. No brokerage connection. Add your legs, see your payoff diagram instantly. Know your breakeven, max profit, and max loss before you place the trade.

The Bloomberg/Thinkorswim versions of this are buried inside $30k/year terminals. The free versions look like 2008 and crash on mobile. This is the one that should exist.

## Features

- **Payoff chart** — split green/red fill above and below zero, animated on every change
- **Strategy auto-detection** — Long Call, Bull Call Spread, Long Straddle, Iron Condor, and more
- **Live metrics** — max profit, max loss, breakeven prices recompute as you edit
- **Price slider** — drag to see exact P&L at any underlying price, with a crosshair on the chart
- **Presets** — load Long Call, Bull Call Spread, Iron Condor, etc. with one click
- **Dark mode only** — Bloomberg-meets-Vercel aesthetic; works at 375px

All math runs client-side. No API key. No tracking. No backend.

## Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript (strict)
- Tailwind CSS v4
- recharts · framer-motion · zod
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project structure

```
src/
  app/
    page.tsx              ← state lives here
    layout.tsx
    globals.css
  components/
    LegForm.tsx           ← add a single option leg
    LegCard.tsx           ← displays a leg, delete button
    PayoffChart.tsx       ← recharts split-fill area chart
    MetricsBar.tsx        ← max profit / max loss / breakevens
    StrategyBadge.tsx     ← auto-detected strategy name
    PriceSlider.tsx       ← drag for live P&L at a price
    Presets.tsx           ← common strategies
  lib/
    payoff.ts             ← core math
    strategies.ts         ← strategy auto-detection
    types.ts              ← Leg, StrategyMetrics, PayoffPoint
    format.ts             ← currency formatting
```

## License

MIT
