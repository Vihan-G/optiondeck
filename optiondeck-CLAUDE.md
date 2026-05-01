# optiondeck — CLAUDE.md

Inherit all rules from /Users/vihangoenka/Claude Projects/CLAUDE.md.

---

## What we're building

**optiondeck** — Options strategy payoff visualizer. No login, no brokerage connection.
Add your legs, see your payoff diagram instantly. Know your breakeven, max profit,
max loss before you place the trade.

Target users: retail options traders, finance students, anyone learning options.
The Bloomberg/Thinkorswim versions of this are buried inside $30k/year terminals.
The free versions look like 2008 and crash on mobile. We're building the one that
should exist.

No API key needed. Pure math + D3.

---

## Tech stack

- Next.js 14, App Router, TypeScript, Tailwind, src/ layout
- `recharts` for the payoff diagram (area chart)
- `framer-motion` for card animations
- No backend. All math runs client-side.

```bash
npm install recharts framer-motion zod
```

---

## Core math (implement in lib/payoff.ts)

An option's payoff at expiry for a given underlying price S:

```
Long Call:  max(S - strike, 0) - premium
Short Call: premium - max(S - strike, 0)
Long Put:   max(strike - S, 0) - premium
Short Put:  premium - max(strike - S, 0)
```

Total strategy payoff = sum of all legs at each price point.

Generate 200 price points from (lowest strike × 0.7) to (highest strike × 1.3).
For each price point, sum all leg payoffs. This gives the curve.

Key metrics to compute:
- Max profit: Math.max(...payoffs) — cap at some ceiling for display if unlimited
- Max loss: Math.min(...payoffs)
- Breakeven(s): price points where payoff crosses zero (find sign changes)
- Strategy name: auto-detect from legs (see below)

### Strategy auto-detection (lib/strategies.ts)

Detect and label the strategy based on legs:
- 1 long call → "Long Call"
- 1 long put → "Long Put"
- 1 long call + 1 short call (same expiry, different strikes) → "Bull Call Spread"
- 1 long put + 1 short put (same expiry, different strikes) → "Bear Put Spread"
- 1 long call + 1 long put (same strike) → "Long Straddle"
- 1 long call + 1 long put (different strikes, call strike > put strike) → "Long Strangle"
- 1 short call + 1 short put (same strike) → "Short Straddle"
- 2 short options + 2 long wings → "Iron Condor" or "Iron Butterfly"
- Anything else → "Custom Strategy"

---

## File structure

```
src/
  app/
    page.tsx                    ← main page, state lives here
    layout.tsx
    globals.css
  components/
    LegForm.tsx                 ← add/edit a single option leg
    LegCard.tsx                 ← displays one leg, delete button
    PayoffChart.tsx             ← recharts area chart
    MetricsBar.tsx              ← max profit, max loss, breakevens
    StrategyBadge.tsx           ← auto-detected strategy name
    PriceSlider.tsx             ← drag to see P&L at a specific price
    Presets.tsx                 ← click to load common strategies
  lib/
    payoff.ts                   ← core math
    strategies.ts               ← strategy auto-detection
    types.ts                    ← Leg, Strategy, PayoffPoint interfaces
```

---

## Types (lib/types.ts)

```typescript
export type OptionType = 'call' | 'put'
export type Direction = 'long' | 'short'

export interface Leg {
  id: string
  type: OptionType
  direction: Direction
  strike: number
  premium: number
  quantity: number        // number of contracts (default 1)
}

export interface PayoffPoint {
  price: number
  payoff: number          // in dollars per share (×100 for actual)
}

export interface StrategyMetrics {
  name: string
  maxProfit: number | 'unlimited'
  maxLoss: number | 'unlimited'
  breakevenPrices: number[]
  payoffCurve: PayoffPoint[]
}
```

---

## UI design direction — this is the critical section

**Aesthetic: Bloomberg terminal meets Vercel dashboard.**
Dark mode only. No toggle. This is a trading tool — traders use dark mode.

Color palette:
- Background: `#0a0a0a`
- Surface (cards): `#111111`
- Border: `#222222`
- Text primary: `#ededed`
- Text secondary: `#888888`
- Green (profit): `#22c55e`
- Red (loss): `#ef4444`
- Blue (accent): `#3b82f6`
- Chart fill profit: `rgba(34, 197, 94, 0.15)`
- Chart fill loss: `rgba(239, 68, 68, 0.15)`
- Chart line: `#3b82f6`

**Layout:**
- Two-column on desktop: left 380px (inputs), right (chart + metrics) fills rest
- Single column on mobile: metrics → chart → inputs
- No navbar. No footer.
- Tight spacing — this is a dashboard, not a landing page.

**LegForm:**
- Inline form — not a modal
- Call/Put toggle: two pill buttons side by side, selected fills blue
- Long/Short toggle: same pattern
- Strike and Premium: clean number inputs, monospace font
- "Add leg" button: full width, blue, minimal
- Validation: strike must be positive, premium must be positive

**LegCard:**
- Dark surface, 1px border
- Left accent bar in green (long) or red (short)
- Shows: LONG CALL $150 @ $3.50 in a scannable format
- Delete button: small ✕ top right, no confirmation needed

**PayoffChart (recharts):**
- ReferenceLine at y=0 (horizontal zero line, white, opacity 0.2)
- Area above zero: green fill
- Area below zero: red fill (use two separate Area components with clip)
- Tooltip: shows price and P&L in dollars
- No grid lines. Clean axes only.
- X-axis: underlying price. Y-axis: P&L per share.
- Animate on data change.

**MetricsBar:**
- Three stat boxes in a row: Max Profit | Max Loss | Breakeven(s)
- Max profit in green, max loss in red
- Show "Unlimited" for naked calls/short puts max profit

**PriceSlider:**
- Below the chart
- Drag slider → vertical reference line appears on chart at that price
- Shows exact P&L at that price in a callout above the slider
- Range: same as chart x-axis

**Presets (Presets.tsx):**
- Horizontal scrolling row of preset buttons at the top
- Presets: Long Call, Long Put, Bull Call Spread, Bear Put Spread,
  Long Straddle, Long Strangle, Iron Condor
- Click a preset → loads example legs with realistic strikes/premiums
  (e.g., SPY-like: current price ~$500, strikes in $5 increments)
- These exist so someone landing on the page can immediately see
  what the tool does without filling in a form

**StrategyBadge:**
- Top of results area
- Pill with auto-detected strategy name + a subtle description
- E.g., "Iron Condor · Profit if underlying stays range-bound"

---

## Setup commands

```bash
cd "/Users/vihangoenka/Claude Projects"

npx create-next-app@latest optiondeck --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint

cd optiondeck

npm install recharts framer-motion zod

git init
git add .
git commit -m "chore: initial scaffold"
gh repo create optiondeck --public --source=. --remote=origin --push
vercel --yes
touch .env.local
echo ".env.local" >> .gitignore
git add .gitignore
git commit -m "chore: gitignore"
git push origin main
```

---

## Milestone commits (one session)

1. `chore: types, payoff math, strategy detection`
2. `feat: leg form and leg cards`
3. `feat: payoff chart with profit/loss fill areas`
4. `feat: metrics bar and strategy badge`
5. `feat: price slider with chart crosshair`
6. `feat: presets for common strategies`
7. `feat: responsive layout, dark theme polish`
8. `docs: README, vercel prod deploy, v1.0.0 release`

After commit 8:
```bash
vercel --prod
gh release create v1.0.0 --title "optiondeck v1.0.0" --notes "Options strategy payoff visualizer. No login. No broker connection. Add legs, see your diagram instantly."
gh repo edit --add-topic options --add-topic finance --add-topic nextjs --add-topic typescript --add-topic trading --add-topic visualization
```

---

## What done looks like

- Dark mode, Bloomberg-meets-Vercel aesthetic
- Load any preset → chart renders instantly
- Add custom legs → chart updates live
- Max profit / max loss / breakevens shown
- Price slider works — drag to see exact P&L
- Strategy auto-detected and labeled
- Works on mobile (stacked layout)
- Looks like something a quant built, not a CS student doing a tutorial
