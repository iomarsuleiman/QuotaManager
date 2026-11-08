# Redesign 0.6 — coverage of the Notion plan

Plan: *QuotaManager — Complete Premium UX & Dashboard Redesign Plan* (sections 0–9),
with the architecture decision React + TypeScript + Vite, Tailwind + OKLCH tokens,
selective Radix primitives, TanStack Query, dnd-kit, Python backend unchanged.

Scoring: every checkable item in the plan counts once. **Done** = 1, **Partial** = 0.5,
**Not done** = 0. Items that do not apply to this product are listed but not counted.

| Plan section | Items | Done | Partial | Not done | N/A | Score |
|---|---:|---:|---:|---:|---:|---:|
| 1. AI-looking UI audit | 9 | 8 | 1 | 0 | 0 | 8.5 |
| 2. 12 premium UX details | 12 | 10 | 1 | 0 | 1 | 10.5 / 11 |
| 3. Dashboard architecture (A–F) | 22 | 21 | 1 | 0 | 0 | 21.5 |
| 4. Three subtle flaws | 15 | 13 | 2 | 0 | 0 | 14 |
| 5. Sidebar reordering | 6 | 6 | 0 | 0 | 0 | 6 |
| 6. Theme (keep-vanilla item superseded by the React decision) | 5 | 3 | 1 | 0 | 1 | 3.5 / 4 |
| 7a. Three colour videos + token architecture | 21 | 21 | 0 | 0 | 0 | 21 |
| 7b. Inputs table | 18 | 15 | 2 | 0 | 1 | 16 / 17 |
| 7c. Input anatomy + full-system targets | 20 | 16 | 4 | 0 | 0 | 18 |
| 7d. Mobile sheet + keyboard contract | 17 | 17 | 0 | 0 | 0 | 17 |
| 7e. Device acceptance matrix | 7 | 1 | 3 | 3 | 0 | 2.5 |
| 7f. Design-system deliverables | 7 | 4 | 3 | 0 | 0 | 5.5 |
| 8. Performance (8.2–8.9) | 49 | 44 | 5 | 0 | 0 | 46.5 |
| 9. Stages 0–7 | 8 | 5 | 3 | 0 | 0 | 6.5 |
| **Total** | **216** | | | | **3** | **197.5 / 213 = 92.7 %** |

## What is not (fully) done, and why

- **Real-device testing** (7e): iPhone Safari, iPhone in-app/Chrome iOS and Android
  Chrome with Gboard/Samsung keyboards were not available. The keyboard contract is
  implemented (visualViewport sizing, focused-field scrolling, 16 px fields, safe area)
  and emulated in Playwright (iPhone 13 profile); it still needs a pass on real phones.
  200 % zoom and a screen-reader walkthrough were not run.
- **Pages still in vanilla JS**: Internet, Security, VPN, Share and the System
  account/updates/logs tabs are hosted inside the React shell (progressive migration).
  They use the new tokens and their number/address inputs were fixed (whole-number
  ports 0/1–65535, IPv4/CIDR checks, WAN renew minutes 5–1440 with presets), but they
  keep the old "tap twice" confirmations instead of the consequence dialog, and their
  filters have no "Clear filters" yet.
- **Figma**: the visual spec is delivered as code (tokens.css, components, docs) plus
  before/after screenshots, not as a Figma file.
- **Soak length**: memory was measured over 4 minutes, not 2–4 hours; thermals were
  not measured (CPU time was).
- **Arabic**: all new text is written in plain Egyptian Arabic and 14 existing strings
  were reworded; the remaining legacy-page strings were not re-audited one by one.

## Measured performance (old → new)

Headless Chromium, 13 seeded devices, same probe for both builds.

| | LAN | Slow Wi-Fi (1.6 Mbps, 150 ms) |
|---|---|---|
| First contentful paint (cold) | 152 → **84 ms** | 2876 → **1464 ms** |
| First contentful paint (warm) | 104 → **44 ms** | 1476 → **380 ms** |
| Dashboard ready (cold) | 281 → 269 ms | 3690 → **2513 ms** |
| Dashboard ready (warm) | 158 → 145 ms | 2298 → **1170 ms** |
| Requests | 52 → **20** | 51 → **19** |
| Transferred, cold (incl. fonts) | 558 → **312 KB** | 516 → **270 KB** |
| Transferred, warm reload | 42 → **10 KB** | 43 → **10 KB** |
| JS files | 38 → **10** | |
| DOM nodes on Overview | 10 491 → **3 191** | |
| Idle main-thread (20 s) | 0.61 % → **0.43 %** (old default animated background: **7.37 %**) | |
| Route switch → painted | ≈ 30 ms → ≈ 30 ms | |

First-load JS is 104 KB gzip (shell) + ~20 KB (the one language in use); every page
is its own chunk; drag-and-drop loads on first sidebar use. Server snapshot
(`/api/dashboard`): 8.5 ms at 0 devices, 10.7 ms and 145 KB at 100 devices, so the
backend was left as is (the plan says optimise only on evidence).
