---
version: 3.1
name: Aprameya Design System — "Harmonized Perception & Clean v2 Structure"
scope: global (every page, every role, every breakpoint, every theme)
replaces: DESIGN.md v3.0 (Experimental Perception with Red Overlays & Canvas Cloud)
stack: React 18 + Vite 5 + TypeScript + Tailwind 3 + shadcn/Radix + Motion + TanStack Query + wouter
themes: [dark "red-black" (default), light "red-white"]
roles: [aspirant, core, admin]
routes: [/, /projects, /projects/:slug, /events, /events/:id, /events/:id/register, /team, /team/:id, /recruitment, /recruitment/apply, /recruitment/status, /blogs, /blogs/:id, /research, /about, /login, /signup, /forgot-password, /my-tickets, /dashboard/*, /dashboard/scan, /profile]
description: |
  Aprameya builds autonomous systems that perceive, plan, and act. The design system
  expresses this through high-contrast engineering restraint: pure black (#000000) and
  pure white (#FFFFFF), precision 1px hairlines, Bricolage Grotesque typography, and
  JetBrains Mono telemetry numbers. Red is never applied as random decoration or as
  hover bounding box borders; it is strictly a high-value signal reserved for primary
  call-to-actions (--signal), active state indicators (2px nav lines), and status badges.
  The Home page returns to the clean, proven v2 structure (high-impact video loop hero,
  4 telemetry stats, 3 domain cards, deduplicated projects, upcoming event rows, 3-step
  recruitment sequence, and closing CTA band).
---

# 0. Read this first (humans and AI agents)

1. Read the entire file before touching any UI. The sections depend on each other.
2. Use only the tokens in §2–§5. Never type a raw hex, px, radius, easing or duration that is not a token.
3. The signature interaction is clean hairline brightening (`--hairline-2`) and subtle image scaling (`scale(1.02)`). Red bounding box overlays, corner ticks, and fake confidence scores (`vehicle 0.98`) are deprecated and removed globally (§6.1).
4. Motion answers the user. Ambient video hero (`/assets/hero-loop.mp4`) autoplays silently in the hero; no rAF canvas point clouds or scroll-jacking pinned steps. The live-event pulse (§7.6.6) and the number ticker when it enters view (§7.3.9) remain the only animated elements.
5. Performance is a design token. Every component in §7 lists its performance cost. If a change pushes a budget in §12, the change is wrong, not the budget.
6. Keep content, routes, data models and server logic unchanged unless the task says otherwise. This file governs look, feel, behaviour and front-end performance only.
7. Before finishing any UI task, run the checklist in §17 and record the work in `DOCS.md` (see `CLAUDE.md`).

The single rule: **if it does not help the person see, decide or act, remove it.**

## 0.1 What changed across versions and why

| Dimension | v2 (Linear/Vercel) | v3.0 (Experimental) | v3.1 (Harmonized Perception & Clean v2) | Reason |
|---|---|---|---|---|
| **Hover / Interaction** | Border brighten | Red bounding box + fake confidence label (`project 0.97`) on hover/focus | Clean 1px hairline brightening (`--hairline-2`) + `scale(1.02)` image zoom. Red bounding boxes removed globally. | User directive: red borders everywhere caused visual clutter. Red is strictly for primary CTAs and active states. |
| **Hero Experience** | Basic video loop | 2,800-point Canvas LiDAR cloud with mouse displacement | Cinematic Video Loop Hero (`/assets/hero-loop.mp4`) with typography headline and 4-stat ticker. | Instant LCP, genuine club footage, zero CPU overhead on mobile, rock-solid stability. |
| **Home Layout** | Standard vertical flow | Bento grid + GSAP pinned scroll-jacking ("Sense → Decide → Act") | Restored to clean v2 structure: Video hero, 4 stats strip, 3 domain cards, featured projects, upcoming events rows, 3-step recruitment sequence, closing CTA band. | Pinned scroll-jacking felt unnatural and broke scrolling fluidity. The v2 flow is direct, fast, and clear. |
| **Scroll & Overflow** | Standard | Marquee strip with potential horizontal overflow | Natural vertical scroll (Lenis); zero horizontal scrollbars anywhere; marquee bounded with `overflow-hidden`. | Unwanted horizontal scrollbars degraded the browsing experience. |
| **Projects List** | Card grid | Featured card + grid duplicating the featured item | Featured project rendered at top; grid below strictly filters out the featured project ID/slug. | Deduplication: showing the same project twice looked like a data bug. |
| **Logo & Branding** | Text label | Icon + redundant lightweight "Aprameya" text | Theme-adaptive logo (`/logo-white.png` for dark, `/logo-black.png` for light) + single crisp `APRAMEYA` wordmark. | Eliminated duplicate brand names and ensured razor-sharp contrast across both themes. |
| **Team Member Cards** | Basic card | Gradient fade scrim over bottom of portrait; duplicate side-by-side badges (`3rd Year` & `Core Team`) | Crisp 4:5 portrait without any gradient scrim. Badges balanced across opposite corners: Top-Left division pill (`Core Team` / `Faculty Mentor` with signal dot), Top-Right academic batch (`3rd Year`), eliminating side-by-side badge collisions. | Gradient overlay washed out faces; side-by-side text tags jammed awkwardly across the top of portrait cards. |
| **Recruitment Domains** | Domain cards | Table rows with speculative slot counts (`08 slots`) | Responsive 3-column card grid without speculative slot counts. | Clean v1/v2 card aesthetic restored; slot numbers were fictitious and confusing. |
| **Content Truth** | Mixed | Hardcoded fake blog articles and fake projects | Strict Content Truth. Hardcoded fake blogs/projects deleted; clean EmptyStates rendered when data is absent. | Real content only. Fictional articles and projects undermine technical credibility. |
| **Dashboard & Modals** | Inconsistent | Duplicate Save/Cancel buttons; duplicate view switch buttons; low-contrast action buttons | Exactly ONE set of Save/Cancel buttons in modal headers; navigation unified in sidebar footer; high-visibility crimson buttons (`bg-[var(--red)] text-white`). | Fixed duplicate controls and prevented invisible black-on-black button text in light/dark transitions. |
| **Admin Telemetry** | Static bar charts | Alphabetical/random month ordering | Chronological month ordering (`year * 100 + month`), modern SVG area gradient chart, centered DonutChart. | Chronological data integrity and modern, scannable telemetry visualization. |

---

# 1. Concept and design plan

## 1.1 The idea: Perception

An autonomous vehicle operates through three disciplined phases: **sense → decide → act**. The site reflects that loop with engineering restraint:

- **Sense**: the interface cleanly acknowledges attention. Hovering or focusing a card brightens its 1px border from `--hairline` to `--hairline-2` with a subtle 1.02x image zoom. No jarring red bounding box overlays. Idle UI is quiet, high-contrast black and white.
- **Decide**: hierarchy is unambiguous. One headline, one primary action per section. Pure typography carries the structure, not boxy borders.
- **Act**: every action gives immediate visual confirmation (a button morphing into its success state, rows transitioning smoothly, instant feedback).

## 1.2 The hero element

Boldness is concentrated in **the hero video loop** (§8.1). A crisp, cinematic vehicle video loop (`/assets/hero-loop.mp4`) showcases real autonomous vehicle hardware in action. The video loads efficiently with `playsinline autoPlay loop muted` and a clean overlay. Everything after the hero is calm engineering clarity.

## 1.3 Palette (6 values that matter)

| Name | Dark (red-black) | Light (red-white) | Role |
|---|---|---|---|
| ink | `#000000` | `#FFFFFF` | Page. Pure, not tinted. |
| paper | `#FFFFFF` | `#000000` | Primary text and the inverse button. |
| signal | `#E8261E` | `#D41E17` | Red fill: primary button, 2px active indicator, status dot. |
| signal-text | `#FF5C54` | `#C8180F` | Red as text/icon (contrast ≥ 5.5:1 on the page). |
| hairline | `rgba(255,255,255,.10)` | `rgba(0,0,0,.10)` | Every border. |
| mute | `#8A8A8A` | `#6B6B6B` | Secondary text, metadata. |

Red usage budget per viewport: strictly reserved for primary CTA buttons, active state indicators (2px nav underline, active tab indicator), and status badges. Red borders are NEVER applied on cards, bounding boxes, or hover overlays.

## 1.4 Type

- **Bricolage Grotesque** (Google Fonts, variable: `wght 200–800`, `wdth 75–100`, `opsz 12–96`). Display at `opsz 96`, `wdth 90`, `wght 500`, tracking `-0.035em`. Body at `opsz 12`, `wght 400`. One family, two personalities. Sanctioned fallback: **Hanken Grotesk**.
- **JetBrains Mono** for *numbers only*: dates, times, counts, coordinates, IDs, code. Never for words, headings or labels.
- Sentence case everywhere. The only uppercase in the product is acronyms (QR, API, KL).

## 1.5 Layout concept

```
┌──────────────────────────────────────────────────────────────┐
│ [LOGO] APRAMEYA   Projects Events Team Recruitment Blogs About│  64px header, 2px red active indicator
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  We build machines that              ┌─────────────────────┐ │  Hero: Video loop right (/assets/hero-loop.mp4)
│  see the road before                 │  [ Autonomous AV ]  │ │  Type left (7 cols), video frame (5 cols)
│  anyone else does.                   │  [ High-Def Loop ]  │ │
│                                      └─────────────────────┘ │
│  [Join the club]  Explore projects                           │
│                                                              │
│  14 projects   48 members   6 competitions   since 2022      │  mono numbers, words in Bricolage
├──────────────────────────────────────────────────────────────┤
│  (96px)                                                      │
│  What we build                                               │  3 domain cards (Autonomous, Drones, Robotics)
│  ┌───────────────────┐ ┌───────────────────┐ ┌─────────────┐ │
│  │Autonomous Vehicles│ │Autonomous Drones  │ │Robotics     │ │  Clean 1px hairline cards, no red borders
│  └───────────────────┘ └───────────────────┘ └─────────────┘ │
├──────────────────────────────────────────────────────────────┤
│  Featured work                                               │  Deduplicated project cards
│  Upcoming events                                             │  Event rows with authentic photos
│  Recruitment process                                         │  3-step sequence: Apply · Review · Onboard
│  Closing band                                                │  "Build the next one with us"
└──────────────────────────────────────────────────────────────┘
```

- 12-column grid, 1200px max, left-aligned text always. Centered text only on the 404 page and the final CTA band.
- Sections are separated by **space (96/64/48px)** and at most one hairline. Boxes are used only when content is a card the person can open.
- Mobile: a 4-item **bottom dock** replaces the hamburger for primary navigation (§7.2.2). Thumb-reach first.

## 1.6 Principles

1. **Signal, not decoration.** Red appears only for deliberate actions (primary CTAs, 2px active indicators, status dots). Never as hover border noise.
2. **Type is the layout.** Size, weight and width create hierarchy; borders and fills are last resorts.
3. **Answer, don't announce.** Motion confirms actions; it never performs for an idle viewer.
4. **Mobile is the primary device.** Design at 375px first, then widen.
5. **60fps or it doesn't ship.** Animate only `transform`, `opacity`, `clip-path`; keep INP under 150ms on a mid-range Android.
6. **Same component everywhere.** A button on the admin table is the same button as in the hero, in a smaller size.
7. **Content truth.** Real photos, real names, real dates. Placeholder text and fake blog writeups are strictly prohibited.

## 1.7 Anti-generic review

Checked the plan against common design pitfalls and codified: removed red hover bounding boxes everywhere; replaced experimental canvas point cloud with reliable high-definition video loop; replaced pinned GSAP scroll-jacking with smooth native vertical flow; deduplicated featured projects; eliminated gradient scrims on portraits; enforced single-set modal controls and theme-safe crimson buttons. Kept: hairline borders and a mono face for engineering telemetry.

---

# 2. Design tokens

All tokens live in `client/src/index.css` under `@layer base`. Tailwind reads them through the mapping in §2.9. Components never hardcode values.

## 2.1 Color — dark theme (default, "red-black")

```css
:root,
[data-theme="dark"] {
  color-scheme: dark;

  /* page and surfaces */
  --ink:          #000000;                 /* page background */
  --surface-1:    #0A0A0A;                 /* cards that need separation, inputs */
  --surface-2:    #141414;                 /* hover fills, menus, code blocks */
  --surface-3:    #1E1E1E;                 /* pressed states, skeleton base */

  /* text */
  --paper:        #FFFFFF;                 /* headings, primary text */
  --text-2:       #B3B3B3;                 /* body paragraphs */
  --mute:         #8A8A8A;                 /* metadata, placeholders, captions */
  --text-disabled:#5C5C5C;

  /* lines */
  --hairline:     rgba(255,255,255,0.10);
  --hairline-2:   rgba(255,255,255,0.18);  /* hover, inputs */
  --hairline-3:   rgba(255,255,255,0.30);  /* focus-adjacent, active tab divider */

  /* signal (red) */
  --signal:       #E8261E;                 /* primary CTAs, active indicator bar, status badge */
  --signal-hover: #FF3B32;
  --signal-press: #C41F18;
  --signal-text:  #FF5C54;                 /* red used as text or icon */
  --signal-soft:  rgba(232,38,30,0.12);    /* badge tint, selected row */
  --signal-line:  rgba(232,38,30,0.55);    /* selected border only */
  --on-signal:    #FFFFFF;

  /* inverse (white button on black) */
  --invert-bg:    #FFFFFF;
  --invert-text:  #000000;

  /* status (dot + text, never fills larger than a badge) */
  --ok:           #3DDC84;  --ok-soft:      rgba(61,220,132,0.12);
  --warn:         #FFB224;  --warn-soft:    rgba(255,178,36,0.12);
  --info:         #B3B3B3;  --info-soft:    rgba(255,255,255,0.06);
  --error:        var(--signal-text); --error-soft: var(--signal-soft);

  /* focus */
  --focus:        #FF5C54;

  /* overlays */
  --scrim:        rgba(0,0,0,0.70);
  --image-scrim:  linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0) 60%);
  --float-shadow: 0 12px 40px rgba(0,0,0,0.55);     /* floating layers only */
}
```

## 2.2 Color — light theme ("red-white")

```css
[data-theme="light"] {
  color-scheme: light;

  --ink:          #FFFFFF;
  --surface-1:    #F7F7F7;
  --surface-2:    #EFEFEF;
  --surface-3:    #E4E4E4;

  --paper:        #000000;
  --text-2:       #3D3D3D;
  --mute:         #6B6B6B;
  --text-disabled:#A3A3A3;

  --hairline:     rgba(0,0,0,0.10);
  --hairline-2:   rgba(0,0,0,0.18);
  --hairline-3:   rgba(0,0,0,0.30);

  --signal:       #D41E17;
  --signal-hover: #B8160F;
  --signal-press: #9E120C;
  --signal-text:  #C8180F;
  --signal-soft:  rgba(212,30,23,0.08);
  --signal-line:  rgba(212,30,23,0.45);
  --on-signal:    #FFFFFF;

  --invert-bg:    #000000;
  --invert-text:  #FFFFFF;

  --ok:           #138A4A;  --ok-soft:   rgba(19,138,74,0.10);
  --warn:         #9A5B00;  --warn-soft: rgba(154,91,0,0.10);
  --info:         #3D3D3D;  --info-soft: rgba(0,0,0,0.05);

  --focus:        #D41E17;

  --scrim:        rgba(0,0,0,0.50);
  --image-scrim:  linear-gradient(to top, rgba(0,0,0,0.80), rgba(0,0,0,0) 60%);
  --float-shadow: 0 12px 40px rgba(0,0,0,0.12);
}
```

### Theme switching
- Default to `prefers-color-scheme`; manual toggle writes `data-theme` on `<html>` and persists in `localStorage("aprameya-theme")`.
- The toggle is applied in an inline `<script>` in `index.html` **before** CSS loads, so there is never a flash.
- Theme change animates with the **View Transitions API** as a circular `clip-path` wipe from the toggle button (280ms). Fallback: instant swap. Reduced motion: instant swap.
- Images read `--paper`/`--ink` at runtime, and the logo dynamically renders `/logo-white.png` (dark) and `/logo-black.png` (light).

## 2.3 Typography tokens

```css
:root {
  --font-sans: "Bricolage Grotesque", "Hanken Grotesk", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

  /* fluid sizes: clamp(min, preferred, max) */
  --fs-display: clamp(44px, 7.2vw, 96px);
  --fs-h1:      clamp(34px, 4.8vw, 60px);
  --fs-h2:      clamp(26px, 3.2vw, 40px);
  --fs-h3:      clamp(20px, 1.6vw, 24px);
  --fs-h4:      17px;
  --fs-lead:    clamp(17px, 1.4vw, 20px);
  --fs-body:    16px;
  --fs-small:   14px;
  --fs-micro:   12px;
  --fs-data:    13px;       /* mono */
  --fs-data-lg: clamp(28px, 4vw, 56px); /* mono stat numbers */
}
```

| Token | Font settings | Line height | Tracking | Use |
|---|---|---|---|---|
| display | sans, `wght 500`, `wdth 90`, `opsz 96` | 0.98 | -0.035em | Home hero only. Max 2 lines. |
| h1 | sans, `wght 500`, `wdth 92`, `opsz 72` | 1.04 | -0.03em | Page titles |
| h2 | sans, `wght 500`, `wdth 95`, `opsz 48` | 1.12 | -0.02em | Section titles |
| h3 | sans, `wght 500`, `wdth 100`, `opsz 24` | 1.25 | -0.01em | Card and row titles |
| h4 | sans, `wght 600`, `opsz 17` | 1.35 | 0 | Widget titles, form legends |
| lead | sans, `wght 400`, `opsz 20` | 1.5 | 0 | Hero subtext, page descriptions |
| body | sans, `wght 400`, `opsz 12` | 1.6 | 0 | Default |
| small | sans, `wght 400` | 1.5 | 0 | Card text, table cells, helper text |
| micro | sans, `wght 500` | 1.4 | 0.01em | Badges, tab labels, dock labels |
| data | mono, `wght 400` | 1.4 | 0 | Dates, times, counts, IDs, confidences |
| data-lg | mono, `wght 300` | 1 | -0.02em | Stat numbers, countdown |
| code | mono, `wght 400` | 1.65 | 0 | Code blocks |

Rules
- Weights in use: 400, 500, 600 (and 300 for `data-lg`). Never 700+.
- Headings `--paper`, body `--text-2`, metadata `--mute`.
- Paragraph measure 60–68ch. Blog body 66ch at 18px, line-height 1.7.
- Headlines use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.
- Use `font-variation-settings` for `wdth` and `opsz`; use `font-weight` for weight so the browser can synthesize correctly.
- Numbers in running text get `font-variant-numeric: tabular-nums` so they do not jitter when they change (counters, countdowns, table cells).

## 2.4 Spacing (4px base, 8px rhythm)

```css
:root {
  --s-1: 4px;  --s-2: 8px;  --s-3: 12px; --s-4: 16px; --s-5: 20px;
  --s-6: 24px; --s-7: 32px; --s-8: 40px; --s-9: 48px; --s-10: 64px;
  --s-11: 96px; --s-12: 128px;
}
```

| Context | Mobile | Tablet | Desktop |
|---|---|---|---|
| Between page sections | 48 | 64 | 96 |
| Hero vertical padding | 72 | 96 | 128 |
| Page side padding | 20 | 32 | 48 |
| Card padding | 16 | 20 | 24 |
| Gap between cards | 12 | 16 | 20 |
| Title → description | 12 | 12 | 16 |
| Description → action | 24 | 24 | 32 |
| Form field gap | 20 | 20 | 24 |

## 2.5 Radius

```css
:root {
  --r-1: 4px;    /* checkbox, kbd, code inline, detection label */
  --r-2: 8px;    /* buttons, inputs, tags, small images */
  --r-3: 12px;   /* cards, dropdowns, code blocks */
  --r-4: 16px;   /* dialogs, sheets, image frames, hero visual */
  --r-5: 24px;   /* bottom sheet top corners, mobile dock */
  --r-full: 999px;
}
```
Radius encodes hierarchy: the bigger the surface, the bigger the radius. Never one radius for everything.

## 2.6 Borders and elevation

- Width is always **1px** (`--hairline`). The only 2px lines: focus ring, active tab/nav indicator, reading-progress bar. Red borders are NEVER applied on cards or hover overlays.
- Zero `box-shadow` on anything that sits in the page (cards, buttons, inputs, images).
- Floating layers (dropdown, popover, dialog, sheet, toast, command palette) get `--float-shadow` + 1px `--hairline-2`.
- Backdrop: `--scrim` with `backdrop-filter: blur(6px)`; the blur is skipped on devices that report `prefers-reduced-transparency` or on `navigator.deviceMemory < 4`.

## 2.7 Motion tokens

```css
:root {
  /* easings */
  --ease-out:   cubic-bezier(0.22, 1, 0.36, 1);      /* default: enter, hover */
  --ease-in:    cubic-bezier(0.55, 0, 1, 0.45);      /* exits only */
  --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);      /* position changes, theme wipe */
  --ease-snap:  cubic-bezier(0.2, 0.9, 0.2, 1.1);    /* toggles (slight overshoot) */

  /* durations */
  --d-instant: 80ms;    /* color/border on hover */
  --d-fast:    140ms;   /* small state changes */
  --d-base:    220ms;   /* menus, tabs, cards expanding */
  --d-slow:    360ms;   /* dialogs, sheets, page transitions */
  --d-hero:    900ms;   /* hero resolve only */

  /* spring (Motion library) */
  --spring-ui:  { type: "spring", stiffness: 500, damping: 40, mass: 0.8 }   /* toggles, dock, drag */
  --spring-soft:{ type: "spring", stiffness: 260, damping: 30, mass: 1 }     /* sheets, cards reorder */
}
```

Rules
- Enter: `--ease-out`. Exit: `--ease-in` and 30% shorter than enter. Move: `--ease-inout`.
- Animate only `transform`, `opacity`, `clip-path`, `filter` (sparingly). Never `width/height/top/left/margin/box-shadow`. Layout animation goes through Motion `layout` prop (FLIP) and is limited to ≤ 12 elements at once.
- `prefers-reduced-motion: reduce`: all durations become 1ms, transforms are removed, hero video is paused or displays poster, Lenis is off, the ticker shows final numbers.
- Nothing loops except the live-event dot.

## 2.8 Z-index scale

```css
:root {
  --z-base: 1; --z-sticky: 50; --z-dock: 60; --z-dropdown: 70;
  --z-sheet: 80; --z-dialog: 90; --z-toast: 100; --z-palette: 110;
}
```

## 2.9 Tailwind 3 mapping (`client/tailwind.config.js`)

```js
theme: {
  extend: {
    colors: {
      ink: "var(--ink)", paper: "var(--paper)",
      surface: { 1: "var(--surface-1)", 2: "var(--surface-2)", 3: "var(--surface-3)" },
      text: { 2: "var(--text-2)", mute: "var(--mute)", disabled: "var(--text-disabled)" },
      hairline: { DEFAULT: "var(--hairline)", 2: "var(--hairline-2)", 3: "var(--hairline-3)" },
      signal: { DEFAULT: "var(--signal)", hover: "var(--signal-hover)", press: "var(--signal-press)",
                text: "var(--signal-text)", soft: "var(--signal-soft)", line: "var(--signal-line)" },
      invert: { bg: "var(--invert-bg)", text: "var(--invert-text)" },
      ok: { DEFAULT: "var(--ok)", soft: "var(--ok-soft)" },
      warn: { DEFAULT: "var(--warn)", soft: "var(--warn-soft)" },
      info: { DEFAULT: "var(--info)", soft: "var(--info-soft)" },
    },
    borderRadius: { 1: "var(--r-1)", 2: "var(--r-2)", 3: "var(--r-3)", 4: "var(--r-4)", 5: "var(--r-5)" },
    fontFamily: { sans: ["Bricolage Grotesque", "Hanken Grotesk", "system-ui", "sans-serif"],
                  mono: ["JetBrains Mono", "ui-monospace", "monospace"] },
    fontSize: { display: "var(--fs-display)", h1: "var(--fs-h1)", h2: "var(--fs-h2)", h3: "var(--fs-h3)",
                lead: "var(--fs-lead)", data: "var(--fs-data)", "data-lg": "var(--fs-data-lg)" },
    transitionTimingFunction: { out: "var(--ease-out)", in: "var(--ease-in)", inout: "var(--ease-inout)", snap: "var(--ease-snap)" },
    transitionDuration: { instant: "80ms", fast: "140ms", base: "220ms", slow: "360ms" },
    zIndex: { sticky: "50", dock: "60", dropdown: "70", sheet: "80", dialog: "90", toast: "100", palette: "110" },
    maxWidth: { container: "1200px", prose: "66ch" },
  },
}
```
Delete the v2 compatibility aliases (`--bg-body`, `--card-bg`, `--text-primary`, …) once no file references them. Grep first.

---

# 3. Typography in practice

- One `h1` per page. Page titles are left-aligned, max 56ch description underneath in `lead`, then 64px of space.
- Hero headline: 2 lines max at desktop, 3 at mobile. No single highlighted word. The whole headline is `--paper`.
- Section titles are a plain `h2`. If a section needs a count, put it in mono after the title: `Projects` `14`.
- Numbers always in mono with `tabular-nums`. Words never in mono.
- Date format `12 Nov 2026`, time `18:00`, countdown `04d 12h 30m`, confidence `0.98`, IDs `APR-0042`.
- Links in body text: `--paper` with a 1px underline at `--hairline-3`, underline becomes `--paper` on hover. Never red links in paragraphs.
- Blog body uses `@tailwindcss/typography` with the `prose` preset overridden to these tokens (see §8.7).

---

# 4. Layout and grid

| Breakpoint | Width | Cols | Gutter | Container | Side padding |
|---|---|---|---|---|---|
| xs | < 480 | 4 | 12 | 100% | 20 |
| sm | 480–767 | 4 | 16 | 100% | 24 |
| md | 768–1023 | 8 | 20 | 100% | 32 |
| lg | 1024–1279 | 12 | 24 | 1120 | 48 |
| xl | ≥ 1280 | 12 | 24 | 1200 | 48 |

- Content grids: 1 col xs/sm, 2 md, 3 lg (team: 2/3/4; logos: 3/4/6).
- Reading column (blog, long About text, legal): 66ch centered, images may break out to 1200px.
- Sticky elements: header top; sidebar (project detail) `top: 88px`; mobile action bar bottom above the dock.
- `100dvh` for full-height sections, never `100vh` (mobile browser chrome).
- Every page sets `min-height: 100dvh` on `<main>` so the footer never jumps during data load.

---

# 5. Motion system

## 5.1 Three kinds of motion, three rules

| Kind | Example | Rule |
|---|---|---|
| Ambient (autoplay) | Hero video loop (`/assets/hero-loop.mp4`) | Silent, background ambient video (`muted loop playsInline`). Runs smoothly without blocking LCP or main-thread CPU. |
| Responsive (answers input) | Hairline brightening, button press, menu open, tab switch, toggle, drag | Unlimited, but each ≤ 360ms and only transform/opacity. |
| Continuous (loop) | Live-event dot | Exactly one. Pauses when the tab is hidden (`document.visibilityState`). |

## 5.2 Libraries and who does what

| Need | Use | Not |
|---|---|---|
| Component state transitions, presence, layout (FLIP), gestures, springs | **Motion** (`motion/react`, the successor of `framer-motion`). Always via `LazyMotion` + `domAnimation` features and `m.*` components, so the initial bundle carries ~5KB instead of ~34KB. | `framer-motion` barrel import, `animate()` from the full bundle |
| Smooth wheel scrolling on desktop | **Lenis** (`lenis/react`), `lerp 0.1`, `duration 1.1`, `smoothWheel true`, `syncTouch false` (native scroll on touch). | Pinned scroll-jacking, horizontal scrollbars, `syncTouch` on phones |
| Storytelling & narrative | **Clean native vertical scroll** through sections. GSAP pinned scroll-jacking is deprecated and removed to maintain natural scroll velocity. | GSAP pinned scrub or scroll hijacking |
| Simple in-view reveals (number ticker, gallery images) | CSS `animation-timeline: view()` where supported, `IntersectionObserver` fallback | Framer `whileInView` on 30 elements |
| Page transitions and theme wipe | **View Transitions API** (`document.startViewTransition`) with wouter navigation; fallback is no transition | Full-page fade overlays |
| Hero experience | High-definition HTML5 `<video>` loop (`/assets/hero-loop.mp4`) | Canvas point cloud particles (removed for performance, battery life, and visual authenticity) |

## 5.3 Choreography — hero resolve

```
t=0      Page paints with headline, description, and primary CTAs immediately visible at opacity 1.
t=0      Video hero begins seamless silent playback (/assets/hero-loop.mp4).
t=200    Stats row numbers tick from 0 to final (NumberTicker, 600ms, tabular-nums).
```
Headline and buttons never animate in; they are the LCP element and must be static. No canvas particle initialization or fake confidence typing animations.

## 5.4 Reduced motion contract
`@media (prefers-reduced-motion: reduce)` and the user setting in Profile → "Reduce motion" (stored, applied as `data-motion="reduce"` on `<html>`):
- Lenis destroyed; native scroll.
- Hero video paused (displays poster frame).
- All transitions become instant (1ms) or simple opacity fades.
- Ticker shows final values. Marquee is a static row. Live dot is static.
- View transitions skipped.

## 5.5 Performance rules for motion
- Promote with `will-change: transform` only while animating; remove it on `animationend`/`onComplete`.
- Never animate more than 12 elements simultaneously (Motion `staggerChildren` capped at 0.04s × 12).
- Hover effects are gated behind `@media (hover: hover) and (pointer: fine)`; touch devices get the tap equivalent.
- All scroll listeners are passive; all measurement happens in `ResizeObserver`/`IntersectionObserver`, never in `onScroll`.
- Video pauses when off-screen or the tab is hidden (`IntersectionObserver` + `visibilitychange`).

---

# 6. Microinteraction catalog

Each entry: **Trigger → Behaviour → Timing → Implementation → Cost**. Every hover behaviour has a tap/focus equivalent.

## 6.1 Hairline Focus and Hover (Detection Red Boxes Deprecated)
- **Status**: The v3.0 experimental red bounding boxes, corner ticks, and fake confidence scores (`vehicle 0.98`, `project 0.97`) are **deprecated and removed globally** per user directive. Red is strictly reserved for primary CTA buttons (`--signal`), status badges, and 2px active navigation indicators.
- **Trigger**: pointer enters / focus-visible / tap.
- **Behaviour**: a 1px border transition from `--hairline` to `--hairline-2` over 140ms `--ease-out` with subtle image `scale(1.02)` over 360ms inside `overflow: hidden`. Zero red borders.
- **Timing**: 140ms border transition, 360ms image zoom.
- **Implementation**: `<Detect>` primitive (§7.3.1) operates as a clean semantic/layout wrapper without rendering red bounding box overlays.
- **Cost**: 0ms compositor overhead, no extra DOM overlays mounted.

## 6.2 Button press
- Trigger: `pointerdown` → Behaviour: `scale(0.985)` and background to `--signal-press`/`--surface-3` → 80ms → Motion `whileTap` → compositor only.

## 6.3 Button success morph
- Trigger: async action resolves (Register, Save, Apply, Submit).
- Behaviour: label cross-fades to a check icon + past-tense label (`Registered`), width animated via Motion `layout`, holds 1.6s, then either stays as the new state (Register) or reverts (Save).
- Timing: 220ms morph, hold 1600ms. Also fires a toast only if the user is not looking at the button (e.g. action from a dialog that closes).

## 6.4 Text link arrow
- Trigger: hover/focus → Behaviour: arrow `→` translates 4px right, underline draws left→right (`background-size` 0%→100%) → 140ms. The only place an arrow exists.

## 6.5 Magnetic primary button (desktop only)
- Trigger: pointer within 24px of the hero primary button → Behaviour: button translates up to 6px toward the pointer; label counter-translates 2px → spring `--spring-ui` → `useMagnetic` hook (exists: `client/src/hooks/useMagnetic.ts`), gated by `(hover: hover) and (pointer: fine)`. Used on **one** button per page (the hero or page primary). Remove from everything else.

## 6.6 Nav active indicator
- Trigger: route change → Behaviour: a 2px `--signal` underline slides from the previous link to the new one (Motion `layoutId="nav-active"`) → `--spring-ui`. On mobile the dock icon fills `--signal` with the same `layoutId` on the indicator pill.

## 6.7 Header border on scroll
- Trigger: `scrollY > 8` → Behaviour: hairline fades in under the header, background from transparent to `--ink` at 85% + blur 12px → 140ms → `IntersectionObserver` on a 1px sentinel at the top of `<main>`, not `onScroll`.

## 6.8 Theme wipe
- Trigger: theme toggle → Behaviour: circular `clip-path` reveal of the new theme from the toggle's center via View Transitions → 280ms `--ease-inout`. Toggle icon (sun/moon) rotates 90° and cross-fades.

## 6.9 Tabs and segmented controls
- Trigger: select → Behaviour: indicator (2px underline for tabs, filled pill for segmented) slides with `layoutId`; panel content cross-fades 160ms with a 4px vertical shift. Keyboard: arrow keys move focus and selection.

## 6.10 Filter chips
- Trigger: tap → Behaviour: chip border → `--signal-line`, text → `--signal-text`, a small `×` appears for deselect; result grid re-sorts with Motion `layout` (FLIP, ≤ 12 animated, rest instant). URL query updates (`?domain=drone`).

## 6.11 Cards
- Hover/focus: 1px hairline brightening (`--hairline-2`) + image `scale(1.02)` over 360ms `--ease-out` inside an `overflow: hidden` frame. No red bounding box, no fake confidence label, no heavy shadow.
- Tap on mobile: Navigates cleanly without intrusive bounding box flashes.

## 6.12 Image load
- Behaviour: blurred 20px LQIP (`blurhash` or 16px inline WebP) → full image fades in 220ms once decoded (`img.decode()`); frame reserves aspect ratio so CLS = 0.

## 6.13 Number ticker
- Trigger: enters viewport (once) → Behaviour: digits count from 0 (or from previous value) over 600ms `--ease-out` using `tabular-nums` so width never shifts → `IntersectionObserver`, `requestAnimationFrame`, no library needed.

## 6.14 Countdown
- Live mono `04d 12h 30m 12s`. Each digit that changes slides up (`translateY(100%→0)`) 180ms; the rest stay. Pauses when tab hidden; re-syncs from `Date.now()` on focus.

## 6.15 Form field
- Focus: border → `--focus`, 2px ring `--signal-soft`; the label does not move (no floating labels).
- Valid on blur: 14px check icon fades in at right.
- Invalid on blur or submit: field shakes `translateX(-4,4,-2,0)` 240ms, message slides down 160ms, `aria-live="polite"` reads it.
- Autosave (recruitment): `Saved 18:42` in mono fades in next to the step title 400ms after the last keystroke; `Saving…` shows a 12px progress ring while in flight.

## 6.16 Checkbox / radio / switch
- Checkbox: box border → fill `--signal`, check path draws (stroke-dashoffset) 160ms.
- Radio: inner dot scales 0→1 with `--ease-snap`.
- Switch: knob translates with `--spring-ui`; track color 140ms.

## 6.17 Dialog / sheet / bottom sheet
- Dialog: scrim fades 220ms; panel `opacity 0→1, scale .96→1, translateY(8→0)` 240ms `--ease-out`. Exit 160ms.
- Side sheet (drawer): slides from right with `--spring-soft`; content fades in 60ms later.
- Bottom sheet (mobile, Vaul): drag handle, snap points `[0.5, 0.92]`, rubber-band at the top, background page scales to 0.97 and dims (Vaul default).

## 6.18 Dropdown / popover / tooltip
- Origin-aware: `transform-origin` set to the trigger side. `opacity 0→1, scale .95→1` 160ms. Items highlight on hover with `--surface-2`, 80ms, no transition on keyboard navigation (instant for speed).
- Tooltip delay 400ms, no delay when moving between tooltips within 300ms (Radix `delayDuration`/`skipDelayDuration`).

## 6.19 Toast
- Enters from bottom-right (desktop) / top (mobile) `translateY(16→0)` + fade 220ms. Stack with 8px offset and scale `1, .97, .94`; hover pauses timers and expands the stack (Sonner behaviour). Swipe to dismiss. A 2px progress line at the bottom shows remaining time.

## 6.20 Table row
- Hover: background `--surface-1` 80ms; subtle border accent. No red bounding boxes.
- Row actions: ghost icon buttons fade in 120ms on hover; always visible on touch.
- Row added/removed: `layout` FLIP + height via `AnimatePresence` (`max 8 rows animate`, else instant).
- Status change: badge cross-fades 160ms; toast confirms with an undo for 5s.

## 6.21 Accordion
- Height via Radix `--radix-accordion-content-height`, 220ms `--ease-inout`; icon `+` rotates 45° to `×`.

## 6.22 Skeleton → content
- Skeleton shimmer 1.4s linear (one `background-position` animation shared by all skeletons via a single CSS keyframe). Content cross-fades over the skeleton in 160ms; skeleton shape equals final shape so nothing shifts.

## 6.23 Pull to refresh (mobile lists)
- Native `overscroll-behavior` is kept. Custom pull indicator: a thin `--signal` ring that fills with pull distance, spins while refetching (`TanStack Query refetch`), completes with a check. Only on Events, Blogs, My tickets.

## 6.24 Ticket flip (My tickets)
- Tap a ticket card: 3D flip 360ms `--ease-inout` revealing the QR; QR renders only on flip (lazy). Brightness of the screen cannot be controlled on web; show "Turn up brightness" hint once.

## 6.25 QR scan success (Admin scan)
- Guide frame focuses on recognized QR code, device vibrates 40ms (`navigator.vibrate`), green check, name and status slide up from the bottom. Duplicate scans show a warning frame in `--warn`.

## 6.26 Scroll progress (blog)
- 2px `--signal` bar at the very top, width driven by `scroll-timeline` (CSS) with a JS fallback using `IntersectionObserver` on article headings for the table-of-contents highlight.

## 6.27 Copy to clipboard
- Click: icon morphs to check 160ms, label `Copied` for 1.4s, mono.

## 6.28 Command palette (⌘K / Ctrl K)
- Opens with dialog motion; results reflow with `layout`; selected row has subtle `--surface-2` background; `Enter` navigates via View Transition.

## 6.29 Marquee (achievements strip)
- Continuous smooth marquee with `overflow-hidden`. Zero native horizontal scrollbars. Pauses on hover/touch.

## 6.30 404 page
- Clean, high-contrast 404 page with mono status code, concise explanation, and a single 'Back to home' primary button.

---

# 7. Component library

Format for every component: **Anatomy · Variants/sizes · States · Behaviour · Accessibility · Performance · Implementation · Maps to (existing file)**.
Base components come from shadcn/Radix already in `client/src/components/ui/`. Restyle them with tokens; do not fork Radix behaviour.

## 7.1 Foundations

### 7.1.1 Button
- Anatomy: container, optional leading icon (16px), label, optional trailing icon, loading spinner slot, success slot.
- Variants:

| Variant | Fill | Text | Border | Hover | Press | Use |
|---|---|---|---|---|---|---|
| primary | `--signal` | `--on-signal` | none | `--signal-hover` | `--signal-press` + scale .985 | One per section |
| inverse | `--invert-bg` | `--invert-text` | none | opacity .92 | scale .985 | Hero second CTA, auth |
| secondary | transparent | `--paper` | `--hairline-2` | bg `--surface-2`, border `--hairline-3` | `--surface-3` | Most buttons |
| ghost | transparent | `--text-2` | none | text `--paper`, bg `--surface-2` | `--surface-3` | Icon buttons, table actions |
| danger | transparent | `--signal-text` | `--signal-line` | bg `--signal-soft` | — | Delete, reject, cancel ticket |
| link | transparent | `--paper` | none | arrow + underline (6.4) | — | Inline "View all" |
- Sizes: `sm` 32px / 13px, `md` 40px / 14px, `lg` 48px / 15px, `xl` 56px / 16px (hero on desktop only). Icon-only: square, same heights. Mobile primary actions are `lg` minimum (44px touch target).
- States: default, hover, focus-visible (2px `--focus` outline, offset 2px), active, disabled (opacity .4, `cursor: not-allowed`, `aria-disabled`), loading (spinner replaces leading icon, width locked, `aria-busy`), success (6.3).
- Behaviour: `type="button"` by default; submit buttons only inside forms. Loading blocks double submits.
- A11y: label always text (icon-only buttons need `aria-label` + tooltip).
- Performance: CSS-only hover/press; Motion only for success morph (`m.button`).
- Implementation: `components/ui/button.tsx` (shadcn, cva). **Remove** `ChamferedButton.tsx`, `advanced-buttons.tsx`, `v6-buttons.tsx` — one button.
- Maps to: `button.tsx` (keep), `ChamferedButton.tsx` (delete after migration), `MagneticButton.tsx` → becomes a prop `magnetic` on Button, allowed once per page.

### 7.1.2 IconButton
Button with `size="icon"`; 40px default, 36px in dense table rows, 44px on touch. Always `aria-label`. Tooltip on desktop.

### 7.1.3 TextLink
Inline link with the animated arrow (6.4). Prop `external` adds `↗` and `rel="noopener"`.

### 7.1.4 Tag / Chip
- Height 28px (24px dense), padding 0 10px, `--r-full`, `micro` type, border `--hairline`, text `--text-2`.
- Selectable chip: selected → border `--signal-line`, text `--signal-text`, bg `--signal-soft`, `×` affordance.
- Keyboard: `role="checkbox"` or `role="radio"` depending on single/multi select.
- Maps to: `badge.tsx` (restyle) — rename usage to Tag for categories; Badge is for status only.

### 7.1.5 StatusBadge
- Height 24px, padding 0 8px, `--r-1`, `micro`, 6px dot + text. Never color alone.
- Mapping: Open/Live/Accepted/Registered → `--ok`; Upcoming/Pending/In review/Waitlist → `--warn`; Closed/Past/Draft/Cancelled → `--mute` on `--info-soft`; Rejected/Error/Expired → `--signal-text` on `--signal-soft`.
- Live: dot pulses (the single loop), `aria-live` text "Live now".
- Maps to: `StatusBadge.tsx` (keep, retoken).

### 7.1.6 RoleBadge
- Aspirant: outline `--hairline-2`, text `--text-2`. Core: `--signal-soft` bg, `--signal-text` text, `--signal-line` border. Admin: `--invert-bg`/`--invert-text`.
- Shown in nav dropdown, profile, admin tables, team management. Never in public bylines.
- Maps to: `RoleBadge.tsx` (keep).

### 7.1.7 Avatar
Sizes 24/28/40/64/96/128. Circular, 1px `--hairline`. Fallback initials on `--surface-2`. Group: overlap −8px, max 4 + `+N`. Lazy-loaded image with `decode()`.
Maps to: `avatar.tsx`.

### 7.1.8 Divider
1px `--hairline`. With label: text `--mute` `small` centered with hairlines each side ("or" on auth).

### 7.1.9 Kbd
Mono 12px, 1px `--hairline-2`, `--r-1`, bg `--surface-1`, padding 2px 6px. Used in command palette hints.

### 7.1.10 Logo
- Theme-adaptive 24px logo mark: `/logo-white.png` in dark theme, `/logo-black.png` in light theme.
- Wordmark: single crisp `APRAMEYA` in sans `wght 600` 17px. Duplicate lightweight "Aprameya" text is prohibited.
- Maps to: `client/src/components/icons/Logo.tsx`.

## 7.2 Navigation

### 7.2.1 Header (desktop ≥ 900px)
- 64px, sticky, `--z-sticky`. Left: Logo. Center: links `small` `--text-2`, hover `--paper`, active `--paper` + sliding 2px `--signal` indicator (6.6). Right: `<ThemeToggle />` (ghost icon), `⌘K` ghost icon, then auth: signed out → `Sign in` (ghost) + `Apply` (primary sm); signed in → Avatar 28px → dropdown (name, RoleBadge, Dashboard, My tickets, Profile, Admin if admin, Sign out).
- Scroll behaviour: 6.7. Hides on scroll down after 120px and reappears on scroll up (`translateY(-100%)`, 220ms) — on desktop only; mobile header is minimal and static.
- Nav links do NOT have red bounding boxes; they use a clean text brighten and a 2px active indicator.
- Maps to: `Header.tsx`.

### 7.2.2 Mobile dock (< 900px)
- Fixed bottom, `--z-dock`, height 64px + `env(safe-area-inset-bottom)`, background `--ink` 90% + blur, top hairline, radius `--r-5` on top corners if floating with 12px side inset (preferred: floating, 12px from edges, bottom 12px).
- Items: Home, Projects, Events, Team, More (sheet). Signed-in users: More becomes Avatar.
- Active item: icon `--paper` + 4px dot indicator slides with `layoutId`. Tap: icon scales .9→1 with `--spring-ui`.
- `More` opens a bottom sheet with Recruitment, Blogs, Research, About, theme toggle, Sign in/out.
- Hides when a bottom sheet, dialog or the keyboard is open (`visualViewport` height change > 150px).
- Maps to: `Dock.tsx` (rebuild to this spec; remove macOS-style magnification — it is a hover effect and this is a touch surface).

### 7.2.3 Mobile top bar
- 56px, Logo left, theme toggle + search right. No hamburger (the dock replaces it). Page title appears in the bar after the h1 scrolls out of view (cross-fade 160ms).

### 7.2.4 Footer
- Top hairline, padding 64/40 (mobile 48/32). Columns (lg): brand + one-sentence mission + social icon buttons | Explore | Join | Contact (email, "KL University, Vijayawada"). Bottom row: `© 2026 Aprameya` left, "Built by the Aprameya web team" right, `small` `--mute`. Mobile: 2 columns for link lists, stacked otherwise. Extra bottom padding of 88px on mobile so the dock never covers it.
- Maps to: `Footer.tsx`.

### 7.2.5 Breadcrumb
`small`, `--mute`, separators `/` in `--hairline-3`. Current page `--paper`. Only on detail pages. Collapses to "← Back" on mobile. Maps to `breadcrumb.tsx`.

### 7.2.6 Tabs
Radix Tabs. Text tabs with hairline divider and 2px sliding indicator (6.9). Segmented variant for view toggles (List / Calendar). Mobile: horizontally scrollable with edge fade masks (`mask-image`). Maps to `tabs.tsx`, `toggle-group.tsx`.

### 7.2.7 Pagination
Prefer infinite "Load more" (secondary button) for public lists; numbered pagination only in admin tables. Maps to `pagination.tsx`.

### 7.2.8 Command palette
cmdk in a Dialog, 560px, results grouped (Pages, Projects, Events, Posts, People), 40px rows, mono shortcut hints via Kbd. Opens with `⌘K`/`Ctrl K` and the header icon; on mobile from the search icon as a full-screen sheet. Data from TanStack cache first, then a debounced search endpoint. Maps to `command.tsx`.

### 7.2.9 Scroll progress bar
2px `--signal`, top, blog articles only (6.26).

### 7.2.10 ScrollToTop
On route change: `scrollTo(0)` **before** the View Transition snapshot so the new page starts at top. Keep `ScrollToTop.tsx`, make it transition-aware.

### 7.2.11 Route progress
Replace `nprogress` with a 2px top bar driven by Suspense + TanStack `useIsFetching`, same style as 7.2.9. Remove the `nprogress` dependency.

## 7.3 Content components

### 7.3.1 Detect (primitive)
```tsx
<Detect label="project" id={project.slug} as="article" className="...">
  ...card content...
</Detect>
```
- **Passthrough Implementation**: Serves as a semantic layout wrapper.
- **Red Bounding Boxes Deprecated**: The experimental red bounding box overlays, corner ticks, and fake confidence scores (`vehicle 0.98`) have been removed globally. The component passes children through cleanly without mounting overlay boxes.
- Interactive styling relies on standard 1px hairline brightening (`--hairline-2`) and subtle image scaling (`scale(1.02)`).
- Maps to: `components/ui/detect.tsx`.

### 7.3.2 Card (base)
- Background transparent on `--ink`; use `--surface-1` only when the card holds a form or sits on an image. Border 1px `--hairline`, `--r-3`, padding per §2.4.
- The whole card is one `<a>`/`<Link>` when it leads somewhere. Nested actions (bookmark, share) are `button`s positioned absolutely with `z-index` above the link and `e.preventDefault()`.
- Hover/focus: hairline transition to `--hairline-2` + image zoom `scale(1.02)` (6.11). No red bounding boxes.
- Maps to: `card.tsx` (shadcn, keep), `v6-card.tsx` (delete after migration).

### 7.3.3 ProjectCard
- Image 16:10 (`--r-2`, hairline) with StatusBadge top-left on image (`Live`, `In progress`, `Archived`). Below: h3 (2 lines, `line-clamp-2`), one-line summary `small` `--text-2`, footer: up to 3 Tags left, year mono `--mute` right.
- Deduplication: When a project is rendered as the FeaturedCard at the top of the Projects page, it is strictly excluded from the grid of ProjectCards below to eliminate duplicate listings.
- Skeleton: image block + 2 text lines + 2 chips.
- Maps to: `ProjectCard.tsx`.

### 7.3.4 FeaturedCard (projects, blogs)
- Horizontal on lg (image 7 cols, text 5 cols), stacked below. h2 title, lead summary, meta row, link-style "Read the write-up".
- When active at the top of `/projects`, the underlying grid filters out this item's ID.

### 7.3.5 EventRow
- Grid: date block (56px: month `micro`, day `data-lg` at 28px) | title h3 + Tags + one line | location `small` with pin icon | StatusBadge | action (`Register` secondary sm, or `Registered` with check, or `Recap`).
- Hairline between rows, no boxes. Row is a link; the action button is nested.
- Mobile: two-line stack; action becomes full-width `lg` at the bottom of the row.
- Photo Integrity: Workshop events must use authentic photography (`/assets/event_workshop.png`), never certificate images (`/assets/UVH.jpg`).
- Maps to: `EventRow.tsx` (or `EventCard.tsx` row variant).

### 7.3.6 EventSpotlight (next event)
- Full-width card `--surface-1`, hairline, `--r-4`. Left: day `data-lg` 56px + month, countdown (6.14). Center: h2, time, venue, seats left in mono. Right: `Register` primary lg + `Add to calendar` secondary (generates `.ics`). Mobile: stacked, buttons sticky at the bottom of the card.

### 7.3.7 BlogCard
- Cover 16:10, Tag (topic), h3 (2 lines), excerpt (2 lines), footer: Avatar 20 + name `small`, date and read time in mono `--mute`.
- Content Truth: Hardcoded fake blog articles are prohibited. When no API data exists, render `EmptyState`.
- Maps to: `BlogCard.tsx`, `BlogPost.tsx`.

### 7.3.8 TeamCard
- Portrait 4:5 (`--r-3`, hairline), full colour, `object-position: top`.
- **No Gradient Scrim**: Gradient fade washes over portraits are strictly prohibited in both light and dark modes (prevents washed-out faces and contrast distortion).
- Clean text body below portrait: name h3 `--paper`, role `small` `--signal-text`, department `small` `--mute`, GitHub/LinkedIn icon buttons (ghost 32px).
- Click opens **MemberSheet** (side drawer on lg, bottom sheet on mobile) with bio, projects, links, and a link to `/team/:id`.
- Grid: 2 / 3 / 4 columns.
- Maps to: `TeamMemberCard.tsx`.

### 7.3.9 Stat / NumberTicker
- Number in `data-lg` mono `wght 300`, label `small` `--mute` below. Row of 3–4 stats separated by 1px vertical hairlines (horizontal hairlines when stacked on mobile, 2×2 grid).
- Ticker behaviour 6.13. Maps to: `StatsCard.tsx` → `Stat.tsx`.

### 7.3.10 Stepper
- Horizontal (lg) / vertical (mobile). Step: 10px dot + label `small` + date mono. Done: dot `--paper`; current: dot `--signal` with 4px `--signal-soft` ring; upcoming: dot outlined `--hairline-3`. Connector 1px `--hairline`, fills to `--paper` up to the current step with a 360ms draw on mount.
- Used for recruitment process and application status.

### 7.3.11 Timeline (About)
- Vertical 1px line, year mono left (lg) / top (mobile), milestone h4 + one line. Entries fade in with the single-section reveal exception? No — static. Only the connector draws on first view.

### 7.3.12 Accordion (FAQ)
Radix. Row 64px, hairline dividers, `+`→`×` rotation (6.21). One open at a time by default. Maps to `accordion.tsx`.

### 7.3.13 Gallery
- Masonry via CSS `columns` (2/3/4) with hairline frames and 12px gap; each image lazy with LQIP. Tap opens Lightbox (Dialog, full-bleed, swipe/arrow keys, pinch-zoom via native `touch-action`). Detect label `photo`.

### 7.3.14 DomainCards (Home "What we build")
- 3 clean responsive cards: Autonomous Vehicles, Autonomous Drones, Robotics & Automation.
- Each card features: domain icon, h3 title, concise summary, and background photo with clean overlay.
- Clean 1px hairline border (`--hairline`), brightening on hover (`--hairline-2`). No red bounding boxes.
- Maps to: `DomainCards.tsx`.

### 7.3.15 Marquee strip (achievements / partners)
- Continuous smooth marquee with `overflow-hidden`. Zero native horizontal scrollbars. Pauses on hover/touch. Names in `--mute`, hairline top and bottom.
- Maps to: `Marquee.tsx` / `Strip.tsx`.

### 7.3.16 CodeBlock (blog, research)
`--surface-2`, hairline, `--r-3`, mono 13px, copy button (6.27), language in mono at top-right. Syntax highlighting via `shiki` at build time or lazy `prism-react-renderer` only on routes that need it.

### 7.3.17 ResearchItem
Row: title h3, authors `small`, venue + year mono, Tags, actions `PDF` (secondary sm) and `Cite` (ghost → copies BibTeX, 6.27). Maps to `ResearchCard.tsx`, `ResearchItem.tsx` → one component.

### 7.3.18 TicketCard (My tickets)
- Event name h3, date/time mono, venue, StatusBadge (Valid / Used / Cancelled), ticket ID mono. Tap → flip (6.24) → QR 200px on `--paper` background (always light for scanners), ID below. `Cancel registration` danger button in a confirm dialog.
- Maps to: `TicketRegistration.tsx` (page) + new `TicketCard.tsx`.

### 7.3.19 ProjectModal
Delete. Project detail is a route (`/projects/:slug`) so it is shareable and back-button safe. Maps to: `ProjectModal.tsx` (remove).

## 7.4 Inputs and forms

Common: height 44px, bg transparent (`--surface-1` on `--surface-1` cards), 1px `--hairline-2`, `--r-2`, padding 0 14px, text `--paper`, placeholder `--mute`. Label above (`small` `wght 500` `--paper`), helper below (`small` `--mute`), error below in `--signal-text` with icon. Focus and validation motion 6.15. Font size never below 16px on inputs on mobile (prevents iOS zoom).

| Component | Notes | Maps to |
|---|---|---|
| Input | types text/email/number/password (eye toggle), leading icon slot, clear button when `clearable` | `input.tsx` (delete `v6-input.tsx`) |
| Textarea | min 120px, auto-grow to 320px, character counter mono when `maxLength` | `textarea.tsx` |
| Select | Radix Select; menu styling 7.5.5; native `<select>` on touch for speed (`useIsTouch`) | `select.tsx` |
| Combobox | cmdk inside Popover for user/project pickers in admin | `command.tsx` + `popover.tsx` |
| Checkbox | 18px, `--r-1`, draw animation 6.16 | `checkbox.tsx` |
| RadioGroup | 18px circles; card-radio variant for choosing a domain in the application form | `radio-group.tsx` |
| Switch | 36×20, spring knob | `switch.tsx` |
| Slider | 4px track, 16px thumb, value bubble mono on drag | `slider.tsx` |
| InputOTP | 6 cells 44px, mono, auto-advance, paste support | `input-otp.tsx` |
| DatePicker | Popover + `react-day-picker`; native `<input type="date">` on touch | `calendar.tsx` |
| FileDrop | dashed hairline area, drag state → border `--signal-line`; previews with progress ring; accepts images/PDF; client-side resize to 1600px before upload | new |
| FormField | label + control + helper + error, RHF + zod | `FormField.tsx`, `form.tsx` |
| MultiStepForm | thin 2px progress at top, one group per step, `Back`/`Continue`, autosave (6.15), review step with inline edit links, submit with success morph | new, used by `RecruitmentApply.tsx` |

Form rules: one column, max 480px (560px for the application form), 20–24px gap, primary submit `lg` full-width on mobile, secondary actions as text links. Errors summarised at the top with anchors when more than 2 fields fail.

### 7.4.1 Modal and Form Action Single-Control Rule
Modals, drawers, and form editors (such as Add/Edit Project, Add/Edit Event) must have **exactly ONE clean set of Save and Cancel action buttons placed in the modal header**. Never duplicate Save/Cancel buttons inside the form body or modal footer when header controls exist.

### 7.4.2 Action Button High-Visibility Rule
Primary and creation action buttons (e.g. 'Save Changes', 'Add Event', 'Create Project', 'Publish') must **NEVER use low-contrast or inverted tokens** like `bg-[hsl(var(--accent))] text-[var(--bg-body)]` (which causes invisible black-on-black text in theme transitions). They must strictly use high-visibility crimson (`bg-[var(--red)] text-white hover:bg-[var(--red-hover)]`) or token `--signal`.

## 7.5 Overlays

| Component | Spec | Maps to |
|---|---|---|
| Dialog | 480px (form 560px), `--surface-1`, hairline-2, `--r-4`, padding 24, title h3, close icon top-right, footer right-aligned [secondary, primary]; motion 6.17; focus trap, Esc, scroll lock; becomes bottom sheet < 640px | `dialog.tsx`, `alert-dialog.tsx` |
| AlertDialog (destructive) | same + danger primary; requires typing the item name for Admin delete of users/projects | `alert-dialog.tsx` |
| Sheet (side) | 440px from right, used for admin edit forms and MemberSheet on lg | `sheet.tsx` |
| BottomSheet | Vaul; snap points; handle 36×4 `--hairline-3`; `--r-5` top | `drawer.tsx` |
| Popover | `--surface-2`, hairline-2, `--r-3`, `--float-shadow`, 8px offset, arrow omitted | `popover.tsx` |
| Tooltip | `--invert-bg`/`--invert-text`, `micro`, `--r-1`, 6px offset; desktop only (`hover: hover`); never holds essential info | `tooltip.tsx` |
| HoverCard | member/project preview on desktop, 280px, opens after 300ms | `hover-card.tsx` |
| DropdownMenu | items 36px, icon 16px, shortcut mono right, destructive item `--signal-text`, separators hairline | `dropdown-menu.tsx` |
| ContextMenu | admin tables only | `context-menu.tsx` |
| Toast | Replace Radix toast with **Sonner** (stacking, swipe, pause on hover). 360px, `--surface-1`, hairline-2, `--r-3`, 2px status bar left, progress line (6.19). Max 3 visible. | `toast.tsx`, `toaster.tsx`, `use-toast.ts` → `sonner` |
| Lightbox | full-screen Dialog, black, image `object-contain`, counter mono, swipe | new |

## 7.6 Feedback and state

### 7.6.1 Skeleton
Shapes match final layout exactly; shimmer 6.22. One keyframe for the whole app. Maps to `skeleton.tsx`.

### 7.6.2 EmptyState
Centered, 24px line icon `--mute`, h4, one line `small` `--text-2`, one secondary button. Copy pattern: what is empty + what to do ("No upcoming events. See past events" / "No articles published yet. Check back soon"). Maps to `EmptyState.tsx`.

### 7.6.3 ErrorState (inline)
Same layout, icon in `--signal-text`, message says what failed and offers `Try again` (refetch). Never a raw error string.

### 7.6.4 ErrorBoundary (page)
Mono `500` large `--mute`, h1 "Something broke on our side", one line, `Reload` primary, `Go home` link. Maps to `ErrorBoundary.tsx`.

### 7.6.5 Progress
Linear 2px (route, form steps, upload) and ring 16px (inline loading). Indeterminate linear is a 40%-wide segment sliding 1.2s. Maps to `progress.tsx`, `ring.tsx` (restyle to 16px ring).

### 7.6.6 LiveDot
8px `--ok` dot, pulse 1.6s opacity 1→.4 (the only loop). Pauses when hidden.

### 7.6.7 Countdown
6.14. Used in EventSpotlight and recruitment deadline.

### 7.6.8 Loaders to delete
`AprameyaLoader.tsx`, `AprameyaLoadingScreen.tsx`, `WanderingEyesLoader.tsx`, `loading-ui/*`, `LoadingSpinner.tsx`, `MorphingInfinity.tsx`, `UnderConstruction.tsx`. A full-screen preloader delays LCP, and the brand moment now lives in the hero. Page loads use skeletons; inline loads use the 16px ring.

## 7.7 Data display (Core / Admin)

### 7.7.1 Table
- No outer fill. Header `small` `wght 500` `--mute`, hairline below, sticky. Rows 52px, hairline between, hover `--surface-1`; row actions on hover (6.20). Sortable headers show a 12px arrow; the active sort is `--paper`.
- Mobile (< 768px): rows render as stacked cards with label/value pairs; bulk actions in a bottom bar.
- Virtualised with `@tanstack/react-virtual` when > 60 rows; TanStack Table for sorting/filtering/selection.
- Selection: checkbox column; selected row bg `--signal-soft`; bulk bar slides up from the bottom (`N selected · Change role · Export · Delete`).
- Maps to: `table.tsx`, `UserManagement.tsx`.

### 7.7.2 Chart
Recharts via `chart.tsx`.
- **Chronological Month Sorting**: Telemetry data MUST sort months strictly chronologically using numeric indexing (`year * 100 + month`), never alphabetical or insertion order.
- **User Growth Telemetry**: Area chart with smooth SVG gradient fill (`#E8261E` fading to `transparent`), 2px stroke, customized tooltip displaying mono values.
- **Laboratory Distribution**: Modern DonutChart with centered active artifact count and breakdown pill cards below.
- Lazy-load the chart chunk on the admin overview only.

### 7.7.3 StatCard (admin overview)
Number `data-lg` mono, label `small` `--mute`, delta `small` in `--ok`/`--signal-text` with arrow, sparkline 48×16 optional. Four in a row, hairline card with subtle hover brightening.

### 7.7.4 KanbanBoard (Core tasks, optional)
Columns with hairline headers, cards draggable with Motion `Reorder`; drop target shows hairline accent. Touch: long-press 200ms to drag.

### 7.7.5 QR scanner (Admin scan)
`html5-qrcode` lazy-loaded on `/dashboard/scan` only. Viewfinder: full-bleed camera, a 240px square guide. Torch toggle, camera flip, manual ID entry fallback input.

## 7.8 Hero system

### 7.8.1 Video Hero
- Source: Cinematic autonomous vehicle footage (`/assets/hero-loop.mp4`).
- Render: HTML5 `<video>` with `autoPlay loop muted playsInline` inside an `overflow: hidden` frame with `--r-4` hairline border.
- Zero main-thread CPU overhead, instant LCP, authentic hardware demonstration. Canvas point cloud particles and GSAP pinned scroll-jacking are deprecated.
- Maps to: `Hero.tsx`.

### 7.8.2 Page hero (all other pages)
Static: h1, lead description, optional StatusBadge and mono date (Recruitment), optional primary action. No visual. 64px below.

---

# 8. Pages

Every page: `<main>` with page hero (7.8.2) unless noted, sections separated by §2.4 spacing, skeletons for every async list, empty and error states, `<title>` and meta description, canonical URL, OpenGraph image.

## 8.1 Home
Goal: in 5 seconds a visitor knows what Aprameya builds, that it is serious, and how to join.
1. **Hero** (100dvh − header, min 640px): headline 2 lines, lead 1–2 lines, `Join the club` (primary xl, magnetic) + `Explore projects` (secondary xl), stats row (4 NumberTickers: projects, members, competitions, years). Right: Video Hero frame (`/assets/hero-loop.mp4`) in a `--r-4` hairline frame, 5 cols. Mobile: video below text.
2. **What we build** — 3 Domain Cards (Autonomous Vehicles, Drones, Robotics).
3. **Achievements strip** (7.3.15 marquee with `overflow-hidden`, zero horizontal scrollbars).
4. **Featured work** — Featured project cards (strictly deduplicated from any additional listings below) + "All projects" TextLink.
5. **Upcoming events** — Upcoming EventRows with authentic photography + "All events" link.
6. **How to join** — 3 steps: `1 Apply · 2 Task & interview · 3 Onboard` with direct primary CTA.
7. **Closing band** — Centered h2 "Build the next one with us", primary button, hairline top and bottom.
8. Footer.
*Note: The experimental Canvas LiDAR point cloud and pinned GSAP scroll-jacking section ("Sense → decide → act") are removed.*

## 8.2 Projects
Page hero + filter bar (Tags: All, Autonomous, Drone, Robotics, Software, AI; sort Select; search Input 240px right).
- **FeaturedCard**: Highlights the primary featured project at the top.
- **Project Grid**: 3-column responsive grid of ProjectCards. **Deduplication Rule**: The grid strictly filters out the featured project ID/slug to ensure no project appears twice.
- Core/Admin: `New project` primary button in header (`bg-[var(--red)] text-white`).

## 8.3 Project detail (`/projects/:slug`)
Breadcrumb, h1 + StatusBadge, lead summary, actions `View code` (secondary) + `Read write-up` (link). Hero image `--r-4`. Two columns (lg): content 66ch | sticky aside card (Team avatars group, Tech Tags, Timeline mono dates, Links). Gallery. Related projects (3). Core/Admin: `Manage` bar under the breadcrumb with Edit (sheet), Publish toggle, Delete (AlertDialog). Aspirant: hairline card "Core members can contribute to this project — Apply to join".

## 8.4 Events
Page hero + Tabs `Upcoming | Past` + segmented `List | Calendar`.
- Upcoming: EventSpotlight → EventRows.
- Calendar: month grid (react-day-picker styled), event dots, tap day → list below.
- Past: 3-col grid of EventCards with `View recap`. Workshop events strictly use `/assets/event_workshop.png`.

## 8.5 Event detail and registration
Banner 21:9, key facts bar (date, time, venue, seats, price) in 4–5 cells divided by hairlines (2×2 grid on mobile), description, agenda (Timeline), hosts (Avatars), FAQ (Accordion). Sticky bottom action bar on mobile (`Register`, above the dock). `/events/:id/register`: single-column form (name, email, roll no, year, dietary/accessibility optional) → success morph → TicketCard appears with `Add to calendar` and `View my tickets`. Past events: Register replaced by Recap, never a dead form.

## 8.6 Team
Page hero + chips (All, Leads, Core, Alumni, domains). Leadership row (3–4 larger TeamCards, 128px portraits). Core grid (2/3/4). Alumni: two-column text list, name + year mono + company.
- **Portraits**: Clean 4:5 portraits without any gradient scrim overlays in light or dark mode. Clean text body underneath.
- MemberSheet on tap; `/team/:id` full profile page (bio, projects, research, links).

## 8.7 Blogs and Research
- **Content Truth**: Hardcoded fake blog posts and speculative technical writeups are strictly forbidden. When no API articles exist, render a clean `EmptyState`.
- Blogs: page hero + topic chips + search; FeaturedCard; 3-col BlogCards; `Load more`.
- Article (`/blogs/:id`): scroll progress bar; 66ch column; topic Tag, h1, byline row, cover 16:9, typography prose, CodeBlocks.
- Research: page hero + ResearchItems grouped by year.
- Core/Admin: `Write post` primary; editor with markdown preview; autosave.

## 8.8 Recruitment (highest-value page)
1. Page hero with StatusBadge (`Applications open`) and deadline + live Countdown in mono.
2. **Open Domains**: Responsive 3-column card grid (retaining the clean v1/v2 card aesthetic). Speculative slot counts (`08 slots`) are completely removed.
3. Process: Stepper with dates.
4. Eligibility / what we look for: two columns of short text.
5. Apply block: signed out → card with `Continue with college email`; Aspirant → MultiStepForm; submitted → ApplicationTracker.
6. FAQ Accordion. 7. Contact line.

## 8.9 About
Mission as the h1. Story. Stats row. Values. Timeline (strictly real milestones; no fake Drive-by-Wire entries). Achievements rows. Mentors. Partners marquee (`overflow-hidden`, zero horizontal scrollbars). Contact + map link.

## 8.10 Auth
Centered 400px card on `--ink`. Logo, h2 "Welcome back" / "Create your account", `Continue with college email` (inverse lg) → OTP (InputOTP) or password; divider "or"; email + password fields; `Sign in` primary lg. Links: Forgot password, Apply. Errors inline. Signup defaults to Aspirant.

## 8.11 Dashboard (`/dashboard/*`)
- **Navigation Architecture**: Switching between Admin Panel and User View is consolidated exclusively in the sidebar footer (`Switch to User View` / `Back to Admin Panel`, and `View Public Site`). Duplicate navigation buttons in the dashboard header are removed.
- **Header**: Contains `<ThemeToggle />`, mobile menu trigger, and user profile avatar.
- **Form Controls**: Modals/drawers (Add/Edit Project, Add/Edit Event) have **exactly ONE clean set of Save and Cancel buttons in the header**.
- **Action Buttons**: Action buttons strictly use `bg-[var(--red)] text-white` (never invisible `bg-[hsl(var(--accent))] text-[var(--bg-body)]`).
- **Telemetry Charts**:
  - Chronological month sorting via `year * 100 + month`.
  - User Growth Telemetry: Area chart with smooth SVG gradient fill.
  - Laboratory Distribution: DonutChart with centered active count and breakdown pill cards.
- **Views**:
  - Aspirant: greeting h1, ApplicationTracker, registered events, recommended projects.
  - Core: two columns — tasks/reviews | activity feed; quick links row.
  - Admin: sidebar (collapsible on mobile), items Overview, Applications, Users, Projects, Events, Team, Blogs, Research, Settings. Every list page: Table + search + filters + `New` primary in crimson; edit in Sheet; delete via AlertDialog.
- `/dashboard/scan`: QR ticket scanner.

## 8.12 Profile and My tickets
Profile: Avatar 96 with upload (FileDrop inline), name, email, roll no, department, RoleBadge, links, theme and motion preferences (Switches), password change, danger zone (`Delete account`). My tickets: grid of TicketCards, past tickets collapsed under an Accordion.

## 8.13 404 / 500
6.30 and 7.6.4. Centered.

---

# 9. Roles

| | Aspirant | Core | Admin |
|---|---|---|---|
| Nav CTA | `Apply` / `My application` | `Dashboard` | `Admin` |
| Badge | outline | signal-soft | inverted |
| Dashboard | single column | two columns | sidebar |
| Sees | public + own status, tickets, profile | + workspace, reviews assigned, attendance, write posts, edit projects | + users, roles, all applications, delete, analytics |
Rules: hide what a role cannot use; show a locked card only when it motivates applying. Admin inline controls appear as ghost icon buttons on hover (always visible on touch) and in a `Manage` bar. Role badge never in public content.

---

# 10. Responsive and mobile rules

| Element | < 640 | 640–1023 | ≥ 1024 |
|---|---|---|---|
| Navigation | top bar + bottom dock | top bar + dock | header with inline links |
| Hero | text, cloud below (280px), display 44px | 2-col from 768 | 2-col, display up to 96px |
| Grids | 1 col | 2 col | 3 (team 4 at ≥1280) |
| EventRow | stacked | row | row |
| Tables | stacked cards | table (scroll-x) | table |
| Dialogs | bottom sheet | centered | centered |
| Sheets | bottom sheet | side 440 | side 440 |
| Admin sidebar | bottom-sheet menu | collapsed icons | expanded |
| Filters | scrolling chips + search icon | inline | inline |
| Sticky actions | bottom bar above dock | none | none |

- Design at 375 first. Test at 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920.
- Touch targets ≥ 44×44. Hover is never the only way to reach information or an action.
- No horizontal scroll ever; wide tables and code scroll inside their own container.
- `viewport-fit=cover`; respect `env(safe-area-inset-*)` on dock, sticky bars, toasts.
- Inputs 16px font minimum. Native pickers on touch.
- Body text ≥ 15px on mobile (16 default).
- `100dvh` not `100vh`. `overscroll-behavior: contain` inside sheets.
- Images: `sizes` attribute per grid so phones never download desktop widths.

---

# 11. Accessibility

- Contrast ≥ 4.5:1 for text, ≥ 3:1 for UI lines and icons. Red text uses `--signal-text` only.
- Focus: `outline: 2px solid var(--focus); outline-offset: 2px` on every interactive element, `:focus-visible` only.
- Keyboard: tabs/menus/dialogs/sheets/palette fully operable; roving tabindex in chip groups and the dock; Esc closes; focus returns to the trigger.
- Semantics: one h1, landmarks (`header`, `nav`, `main`, `footer`), `button` vs `a` correct, tables with `th scope`.
- Status never by colour alone (dot + text). Detection overlays are `aria-hidden`.
- Live regions: toasts `role="status"`, form errors `aria-live="polite"`, countdown `aria-live="off"` with an `aria-label` summary updated every minute.
- Motion: `prefers-reduced-motion` + in-app switch (§5.4). Transparency: `prefers-reduced-transparency` removes blur.
- Theme follows system by default; both themes meet the same contrast.
- Lighthouse Accessibility ≥ 98 on every route; axe has zero serious/critical issues.

---

# 12. Performance engineering ("smooth as butter" is measured)

## 12.1 Budgets (hard, checked in CI with Lighthouse CI on a throttled mobile profile)

| Metric | Target (p75, mobile) | Current risk |
|---|---|---|
| LCP | ≤ 2.0s | hero video poster/font; preloader |
| INP | ≤ 150ms | heavy JS listeners, unoptimized lists |
| CLS | ≤ 0.05 | images without dimensions, fonts swapping |
| TTFB | ≤ 600ms | Render cold start — keep server warm, cache public GETs |
| Initial JS (gz) | ≤ 160KB for `/` | full `framer-motion`, recharts, html5-qrcode in main chunk |
| Route chunk (gz) | ≤ 80KB each | |
| CSS (gz) | ≤ 30KB | Tailwind purge; delete dead CSS |
| Fonts | 2 files, ≤ 90KB total | 3 families today |
| Hero video loop | Preloaded MP4, ≤ 1.5MB total, zero main-thread work | |
| Lighthouse Performance | ≥ 90 mobile, ≥ 97 desktop | |

## 12.2 Bundle
- Route-level `React.lazy` + `Suspense` for every page; prefetch the chunk on link hover/`pointerdown` (`import()` triggered by `onPointerEnter`) and on dock item focus. Vite `manualChunks`: `vendor-react`, `vendor-motion`, `vendor-radix`, `vendor-query`; `recharts`, `html5-qrcode`, `react-day-picker`, `qrcode.react`, editor are lazy and only on their routes.
- `framer-motion` → `motion` (`motion/react`) with `LazyMotion features={domAnimation}` at the root; `domMax` loaded only on routes with drag/layout (admin, kanban).
- Remove: `nprogress`, `react-icons` (use lucide only; one icon set), unused Radix packages (`menubar`, `navigation-menu`, `resizable`, `context-menu` if unused, `hover-card` if unused), `tailwindcss-animate` if replaced by tokens.
- Tree-shake lucide: import icons individually.
- `vite-plugin-compression` (brotli) and `rollup-plugin-visualizer` in the build; fail CI if a budget is exceeded (`bundlesize` or Lighthouse CI budgets).

## 12.3 Fonts
- Self-host Bricolage Grotesque variable (Latin subset, `wght 300–600`, `wdth 75–100`, `opsz 12–96`: one file ≈ 60KB woff2) and JetBrains Mono variable (Latin, ≈ 25KB).
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for both in `index.html`; `font-display: optional` on first visit? No — use `swap` with `size-adjust`/`ascent-override` metrics on the fallback (`Hanken Grotesk` metrics via Fontaine/`@capsizecss`) so the swap is invisible and CLS stays 0.
- `unicode-range` Latin only. No Google Fonts runtime requests.

## 12.4 Images
- All images through an image CDN or Vite `imagetools`: AVIF + WebP, widths 400/800/1200/1600, `<picture>` + `srcset` + `sizes`, explicit `width`/`height`, `loading="lazy"` except the hero (eager + `fetchpriority="high"` + preload). LQIP via `blurhash` stored with the record (server adds it on upload with `sharp`).
- Uploads resized client-side (max 1600px, quality 0.82) before `POST`; server stores original + 3 sizes.
- Team portraits 800×1000 max; project covers 1600×1000 max.

## 12.5 Rendering
- `content-visibility: auto` + `contain-intrinsic-size` on below-the-fold sections and long lists.
- Lists > 60 rows virtualised. Grids use `React.memo` cards with stable keys; no index keys.
- Avoid layout thrash: all measurements through `ResizeObserver`; `getBoundingClientRect` never in scroll/animation loops.
- No `backdrop-filter` on elements that move every frame (the header blur is static once it fades in).
- `will-change` only during animations (§5.5).
- Lenis: one rAF, destroyed on touch devices and under reduced motion; `data-lenis-prevent` on every scrollable overlay.

## 12.6 Data
- TanStack Query: `staleTime` 60s for public lists, 5 min for team/about, `gcTime` 10 min; `placeholderData: keepPreviousData` for filters; `prefetchQuery` on card hover for detail routes; optimistic updates for register/cancel, role change, status change with rollback toasts.
- Server: `Cache-Control: public, max-age=60, stale-while-revalidate=600` on public GETs; ETags; gzip/brotli; keep MongoDB queries indexed on `slug`, `date`, `status`; paginate (`limit 24`). Keep the Render instance warm with a 10-minute health ping so the first API call does not take 30s.
- Persist the query cache to `localStorage` (`persistQueryClient`, 24h) so returning visitors see content instantly, then revalidate.

## 12.7 Delivery
- Vercel: HTML `no-store`, assets immutable 1y (Vite hashes). Preconnect to the API origin. `<link rel="modulepreload">` for the main chunks.
- Service worker (Workbox, optional): precache shell + fonts, runtime cache images (stale-while-revalidate), offline page for `/my-tickets` so tickets open without network at the venue.
- PWA manifest (name, icons, `theme_color` `#000000`, `display: standalone`) — students can add it to the home screen for event check-in.

## 12.8 Monitoring
- `web-vitals` → send LCP/INP/CLS to the API (`/metrics`) or Vercel Analytics; look at p75 per route weekly.
- Lighthouse CI on every PR for `/`, `/projects`, `/events`, `/recruitment`, `/blogs/:id` (mobile, 4× CPU throttle, Slow 4G).
- React Profiler in dev for any list page; a commit that re-renders the whole grid on filter change is rejected.

---

# 13. Library decisions (keep / add / remove)

| Library | Decision | Why |
|---|---|---|
| shadcn/ui + Radix | **Keep** | Accessible primitives; restyle with tokens |
| `framer-motion` | **Replace with `motion`** (`motion/react`, LazyMotion) | Same API, smaller, maintained |
| Lenis (`lenis/react`) | **Add** | Smooth wheel scroll on desktop; native on touch |
| GSAP + ScrollTrigger (`@gsap/react`) | **Deprecated / Removed** | Pinned scrub rejected; site uses clean native vertical scrolling with Lenis |
| Sonner | **Add**, replace Radix toast | Stacking, swipe, pause-on-hover, 3KB |
| cmdk | **Keep** | Command palette |
| Vaul | **Keep** | Bottom sheets |
| Embla | **Keep** (gallery/carousel), lazy | |
| `@tanstack/react-table` + `react-virtual` | **Add** (admin only, lazy) | Sorting/selection/virtual rows |
| `react-hook-form` + `zod` | **Keep** | |
| `react-day-picker` | **Keep**, lazy | |
| `html5-qrcode`, `qrcode.react` | **Keep**, lazy on their routes | |
| `recharts` | **Keep**, lazy on admin overview | Chronological data sorting + SVG gradient area chart |
| `lucide-react` | **Keep** (only icon set) | 1.5px stroke matches hairlines |
| `react-icons` | **Remove** | Second icon set; brand icons via inline SVG |
| `nprogress` | **Remove** | Replaced by the 2px route bar |
| `tailwindcss-animate` | **Remove** | Tokens + Motion cover it |
| `blurhash` (+ `react-blurhash`) | **Add** | LQIP without layout shift |
| `web-vitals` | **Add** | Monitoring |
| `react-wrap-balancer` | Optional | Only if `text-wrap: balance` support is insufficient for the audience |
| Magic UI / React Bits / Motion Primitives | **Copy-paste only** (never as a dependency): NumberTicker pattern, AnimatedList for the activity feed, BlurText for nothing (no text scramble/blur effects on this site) | Keep ownership of code; strip anything that adds glows or gradients |
| Aceternity | **Do not use** | Its signature effects (spotlights, beams, glows) contradict §1 |
| three.js / R3F | **Do not add** | Heavy canvas libraries unnecessary; video hero is native HTML5 |
| `@base-ui/react` (Base UI) | **Watch, do not migrate yet** | Successor-in-waiting to Radix from the same maintainers; follow when shadcn adopts it |
| Fontsource (`@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/jetbrains-mono`) | **Add (build-time)** | Self-hosted variable fonts as packages, pinned versions, Latin subset |
| Fontaine (`fontaine` Vite plugin) | **Add (build-time)** | Generates fallback-font metric overrides so the font swap causes 0 CLS (§12.3) |
| `vite-imagetools` (or `@unpic/react` if an image CDN is adopted) | **Add (build-time)** | AVIF/WebP, widths and `srcset` generated at build (§12.4) |
| Shiki | **Add (build-time)** | Blog/research code highlighting with zero runtime JS; replaces any Prism runtime |
| `@formkit/auto-animate` | **Add (admin only, 2KB)** | Add/remove/reorder animations for tables and lists without loading Motion `domMax` |
| Rive | **Not now** | Only if a motion designer produces an animated logo mark; otherwise a static SVG |
| Lottie (`lottie-web`, `@lottiefiles/dotlottie-react`) | **Do not add** | 60KB+ runtime for effects this system does not use |
| GSAP / ScrollTrigger | **Do not add** | Clean vertical scrolling and Motion cover all transitions |
| Mantine / Chakra / HeroUI / Park UI / Radix Themes | **Do not add** | Full design systems with their own tokens; they fight this file |
| Cult UI / Kokonut UI / Skiper UI / Tailark / Shadcnblocks | **Browse only** | SaaS landing blocks biased to gradients and glass; stripping costs more than writing from §7 |
| tweakcn / shadcn studio | **Tooling, not a dependency** | Preview and export the §2 tokens as a shadcn theme before committing |

## 13.1 Where to borrow from (component-level sourcing map)

Rule: **copy the source into `client/src/components/`, never add these as dependencies.** Strip gradients, glows, shadows and spring overshoot beyond `--ease-snap`; retoken; then it is ours. Prefer libraries that ship through the shadcn CLI (`npx shadcn@latest add <url>`) so ownership is automatic.

| Need in this file | Borrow from | Component | Notes |
|---|---|---|---|
| Accessible primitives (dialog, sheet, tabs, select, menus, tooltip, accordion) | **shadcn/ui** (Radix) | existing files in `ui/` | Already installed. Restyle only. |
| NumberTicker / Stat (§6.13) | **Motion Primitives** | `animated-number` (spring counter), `sliding-number` (digit roll for the Countdown §6.14) | `npx motion-primitives add animated-number` |
| In-view trigger for ticker and gallery | **Motion Primitives** | `in-view` | Use with opacity only; drop the blur variant. |
| Tabs indicator sliding with layoutId (§6.9) | **Motion Primitives** | `animated-background` / `animated-tabs` | Pattern reference for the 2px underline. |
| Activity feed (Core dashboard) | **Magic UI** | `animated-list` | Items enter one at a time; cap at 8 animated. |
| Marquee/strip base (§7.3.15) | **Magic UI** | `marquee` | Set `overflow-hidden` without native horizontal scrollbars; pauses on hover. |
| Mobile dock base (§7.2.2) | **Magic UI** | `dock` | Remove the macOS magnification; keep the layout and safe-area handling. |
| Magnetic button (§6.5) | **React Bits** | `Magnet` | Compare with the existing `useMagnetic` hook; keep whichever is smaller. |
| Count-up fallback without Motion | **React Bits** | `CountUp` | Only if the ticker must run outside LazyMotion. |
| Theme toggle and switch with spring | **Animate UI** | `switch`, `theme-toggler` | Theme wipe itself is View Transitions (§6.8). |
| Counter with ± buttons (admin seats, slots) | **Animate UI** | `counter` | |
| Inputs with leading icon, clear, password toggle, OTP, file upload with progress, slider with value bubble | **Origin UI** | input/file-upload/slider/OTP blocks | Pure Tailwind + Radix, no motion deps; ideal for §7.4. |
| Toast stack (§6.19) | **Sonner** | library (3KB) | Only exception to copy-paste: install as a dep. |
| Command palette (§7.2.8) | **cmdk** | library | Installed. |
| Bottom sheet (§6.17) | **Vaul** | library | Installed. |
| Admin data grid with sorting/selection/virtual rows (§7.7.1) | **ReUI** data-grid pattern + **TanStack Table/Virtual** | | Copy the markup pattern, keep TanStack as the engine. |
| Morphing dialog (card → detail expansion) | **Motion Primitives** | `morphing-dialog` | Optional for Team → MemberSheet on desktop; skip if INP suffers. |
| Member hover preview | shadcn | `hover-card` | Desktop only. |
| Lightbox / carousel | **Embla** + shadcn `carousel` | | Installed. |
| Image LQIP | **blurhash** / `react-blurhash` | | Dep. |
| Charts | shadcn **Charts** (Recharts) | `chart.tsx` | Chronological sorting + SVG gradient area chart. |
| Reference libraries to browse, not copy | **21st.dev** (aggregates all of the above), **Mobbin** (mobile flow patterns for dock, sheets, forms), **Awwwards → Microinteractions / Minimal honors** (motion timing and restraint references) | | |

Do **not** source from: Aceternity (spotlights, beams, aurora, glowing cards — every signature effect breaks §1), Magic UI's `border-beam`/`shine-border`/`meteors`/`particles`, React Bits' backgrounds (`Aurora`, `Hyperspeed`, `Dither`), any `text-scramble`/`shimmer`/`glitch` text effect. The hero uses an authentic cinematic video loop (`/assets/hero-loop.mp4`) without complex canvas libraries or three.js.

## 13.2 Approved alternatives and reference sources

### Typefaces (all free, variable, drop-in without changing tokens)
| Role | Default | Approved swaps (in order of preference) | Not allowed |
|---|---|---|---|
| Text (display + body) | Bricolage Grotesque | Hanken Grotesk · Instrument Sans · Schibsted Grotesk · General Sans (Fontshare) · Satoshi (Fontshare) | Inter, Space Grotesk, Roboto, Poppins, Montserrat (defaults that erase identity) |
| Numbers / code | JetBrains Mono | Geist Mono · Commit Mono · IBM Plex Mono | Fira Code with ligatures (ligatures distort data) |
Swapping a face changes only `--font-sans` / `--font-mono` and the Fontsource import; every size, width and weight token stays.

### Icons
Lucide is the only runtime icon set. If a glyph is missing, draw it inline as SVG at 1.5px stroke, 24px grid, matching Lucide's optical size. Approved full-set replacement (all-or-nothing, never mixed): Phosphor (regular weight) or Hugeicons stroke. Brand marks (GitHub, LinkedIn, Instagram, YouTube) are inline SVGs from Simple Icons, `currentColor`.

### Design references (browse before designing a new page or component)
| Source | Use it for |
|---|---|
| Awwwards → Honors: Microinteractions, Minimal, Typography | Motion timing, restraint, type-led layouts |
| Mobbin | Mobile flows: bottom docks, sheets, multi-step forms, ticket/QR screens |
| Refero | Real product UI states (empty, error, loading, settings) |
| Godly, Dark.design, Land-book | Dark, type-led marketing pages |
| 21st.dev | Live previews of every component library in §13.1 |
| linear.app, vercel.com, rauno.me, emilkowal.ski | The exact level of restraint, hairlines and motion this file targets |
Reference means study the behaviour and timing; never copy a layout or a visual asset.

---

# 14. Copy and voice

- Plain, confident, specific. Sentence case for every heading, button, tab and label.
- Buttons name the outcome: `Register`, `Save changes`, `Apply`, `Publish`. The toast repeats the verb in past tense: `Registered`, `Saved`, `Published`.
- Empty and error states say what happened and what to do next; they do not apologise.
- Numbers get context in words: `14 projects since 2022`, not `14+`.
- No exclamation marks in UI. No "Oops". No emoji in UI chrome.
- Dates `12 Nov 2026`, times `18:00`, ranges `18:00–20:30`.
- Club vocabulary: members, leads, alumni, domains, projects, events, applications. Not "operatives", "missions", "HQ".

---

# 15. Migration plan from v2 (order of work)

1. **Tokens**: replace `index.css` `:root` with §2; add Tailwind mapping §2.9; add fonts §12.3; add theme boot script. Keep the old aliases for one commit, then remove.
2. **Primitives**: Button (merge Chamfered/Magnetic/advanced/v6), Detect, Tag, StatusBadge, Input, Card, Toast→Sonner.
3. **Navigation**: Header (merge Navbar/Header), Dock rebuild, Footer, route progress, View Transitions wrapper around wouter.
4. **Motion infra**: `motion` + LazyMotion root, Lenis provider, reduced-motion provider, remove preloaders.
5. **Hero**: High-definition video loop (`/assets/hero-loop.mp4`) with instant LCP and typography.
6. **Pages** in this order: Home, Recruitment, Events (+ detail, register, tickets), Projects (+ detail route, remove modal), Team (+ sheet), Blogs (+ article), Research, About, Auth, Dashboard/Admin, Profile, 404.
7. **Performance pass**: code-splitting, images, budgets in CI, monitoring.
8. **Delete list**: `ChamferedButton.tsx`, `MagneticButton.tsx` (folded into Button), `advanced-buttons.tsx`, `v6-buttons.tsx`, `v6-card.tsx`, `v6-input.tsx`, `AprameyaLoader.tsx`, `AprameyaLoadingScreen.tsx`, `WanderingEyesLoader.tsx`, `loading-ui/`, `LoadingSpinner.tsx`, `MorphingInfinity.tsx`, `UnderConstruction.tsx`, `VehicleAnimations.tsx`, `InterfaceModules.tsx`, `OperativeRoster.tsx`, `ProjectModal.tsx`, `hooks/useScramble.ts`, `ring.tsx` (replaced by Progress ring), unused Radix wrappers.

Each step is one PR with a `DOCS.md` entry and a Lighthouse CI run.

---

# 16. Prompts for AI agents

**Full redesign**
> Read DESIGN.md v3.1 fully. Apply §15 in order. Use only the tokens in §2. Use clean hairline hover brightening (§6.1); never render red bounding boxes or fake confidence labels. Remove every file in the §15 delete list after migrating its usages. Keep routes, data and server logic. After each step run §17 and add a DOCS.md entry.

**One page**
> Using DESIGN.md v3.1, rebuild the Events page per §8.4 and §8.5 with the components in §7. Do not touch other pages. Add skeleton, empty and error states. Ensure authentic photography is used. Verify at 375 and 1280.

**One component**
> Using DESIGN.md v3.1 §7.3.3 and §6.1, rebuild ProjectCard. 16:10 image with LQIP, subtle hairline brightening on hover, zero red bounding boxes, no heavy shadows.

**Performance audit**
> Audit the client against DESIGN.md v3.1 §12. Produce the bundle report, list every violation with file and fix, then re-run Lighthouse mobile on `/` and `/recruitment`.

**Design audit**
> Audit the current UI against DESIGN.md v3.1 §17. List each violation with file:line and fix it. Flag any hardcoded color, radius, duration, easing, or red hover border.

---

# 17. Final checklist (run before every UI PR)

Visual
- [ ] No hardcoded colors, sizes, radii, durations or easings outside §2
- [ ] Dark page is `#000000`, light page is `#FFFFFF`; both themes checked
- [ ] All borders 1px hairline; red lines strictly reserved for selected/active/focus (2px nav lines, active badges); ZERO red bounding boxes on cards
- [ ] No box-shadow on in-page elements; floating layers only
- [ ] One filled red element per section; no red areas, gradients or glows
- [ ] Headings `wght 500`, sentence case; no uppercase eyebrows; no arrows on buttons
- [ ] Numbers in mono with tabular-nums; words never in mono
- [ ] Section spacing 96/64/48; page hero present on every page

Interaction & Motion
- [ ] Clean hairline hover brightening (`--hairline-2`); ZERO red bounding boxes, corner ticks, or fake confidence labels anywhere
- [ ] Every hover behaviour has a focus and a tap equivalent
- [ ] Only one ambient video loop (hero), one status loop (live dot); zero scroll-jacking or unwanted horizontal scrollbars
- [ ] Reduced motion switch and media query both honoured
- [ ] Success morph on async buttons; toasts via Sonner; undo where destructive

Forms & Dashboard Architecture
- [ ] Form modals and drawers have exactly ONE set of Save/Cancel action buttons placed in the header (zero duplicate buttons inside form body or footer)
- [ ] Action buttons strictly use high-visibility crimson (`bg-[var(--red)] text-white`); zero low-contrast or black-on-black buttons
- [ ] Navigation between Admin and User views consolidated exclusively in sidebar footer; zero duplicate view-switching buttons in header
- [ ] Admin telemetry charts sort months strictly chronologically (`year * 100 + month`)
- [ ] Theme toggle and user avatar present in dashboard header

Content Truth & Deduplication
- [ ] Featured projects strictly deduplicated from the project card grid below
- [ ] Team member cards have zero gradient scrim overlays across portraits
- [ ] Recruitment open domains render as responsive 3-column card grid with speculative slot counts removed
- [ ] Workshop events use authentic photography (`/assets/event_workshop.png`), never certificate images
- [ ] Strict Content Truth: zero hardcoded fake blog writeups or fake projects; clean EmptyState rendered when data is absent

Mobile & Responsive
- [ ] Bottom dock present < 900px; hides under sheets and keyboard
- [ ] Works at 360/375/390/430/768/1024/1280/1440; zero horizontal scroll
- [ ] Touch targets ≥ 44px; inputs ≥ 16px font; safe-area insets respected

Accessibility
- [ ] Focus visible everywhere; keyboard complete; Esc closes overlays; focus returns
- [ ] Contrast passes in both themes; status never colour-only
- [ ] axe: zero serious/critical; Lighthouse a11y ≥ 98

Performance
- [ ] Route lazy-loaded; heavy libs only on their routes; bundle report attached
- [ ] Images sized with srcset/sizes, LQIP, no CLS; hero preloaded
- [ ] Fonts self-hosted, preloaded, 2 files
- [ ] Lighthouse mobile ≥ 90 on `/`, `/events`, `/recruitment`; INP ≤ 150ms in Profiler
- [ ] Skeleton, empty, error states for every async list

Process
- [ ] DOCS.md feature ledger updated; CLAUDE.md still consistent with this file
- [ ] Any new package has a row in §13 (or §13.1 as copy-paste source); no library outside those lists

---

# Appendix A — Suggested changes to `CLAUDE.md`

The current `CLAUDE.md` restates token values and the team-card spec inline. It now **contradicts** this file (different hex values, "uppercase bold white" names, 3-column rule). Fix:

1. Remove every hex value and typography value from `CLAUDE.md`. Replace the "Core Visual Standards" block with one line: *All visual decisions come from `DESIGN.md` §2–§11; never restate tokens here.*
2. Keep only behavioural rules in `CLAUDE.md`: git safety, env handling, documentation duty, testing duty, and these UI-process rules:
   - Before any UI change: read `DESIGN.md` §0, the relevant §7/§8 entries, and run §17 after.
   - Never add a dependency without a row in `DESIGN.md` §13.
   - Never add an autoplaying animation (§5.1).
   - Every PR touching `client/` attaches the bundle report and Lighthouse mobile scores for the routes it changes.
3. Update the team-card paragraph to: "TeamCard follows DESIGN.md §7.3.8 (full-colour portraits, 4:5, name in sentence case)".
4. Add a "Definition of done" section: types pass, lint passes, a11y check passes, budgets pass, DOCS.md entry written.
5. Add an "Agent etiquette" section: ask before deleting components listed in §15; never rewrite files outside the task's scope; prefer editing shadcn files over creating parallel `v6-*` variants (that pattern is what created the current duplication).

# Appendix B — Suggested structure for `DOCS.md`

Keep `DOCS.md` as the system record, not a second design file:

1. **Architecture** (keep): monorepo tree, stack, environments, how to run.
2. **Data model**: one table per Mongoose model (fields, types, indexes, who can write).
3. **API reference**: route table (method, path, auth/role, request, response, cache headers).
4. **Front-end map**: route → page file → data hooks → components used. Generated by a script if possible.
5. **Design implementation status**: a table of every component in `DESIGN.md` §7 with status (todo / in progress / done / verified) and the file path. This is how an agent knows what exists.
6. **Performance log**: date, route, LCP/INP/CLS p75, bundle size, what changed.
7. **Feature ledger** (keep, mandatory): date, author/agent, summary, files, how to test, follow-ups.
8. **Decisions (ADR-lite)**: one paragraph per decision with the "why" (for example "Replaced framer-motion with motion", "Project detail is a route, not a modal").
9. **Known issues / tech debt**.

Remove the design-token section from `DOCS.md`; link to `DESIGN.md` §2 instead so there is a single source of truth.