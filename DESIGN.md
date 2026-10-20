---
version: 2.0
name: Aprameya Global Design System
scope: global (all pages, all roles)
description: |
  Minimal, modern, light-weight UI for Aprameya, the KL University Autonomous
  Systems & Robotics club. Black and white first, red only as a precise accent.
  Thin 1px borders, no shadows, lots of whitespace, quiet motion.
  Inspired by the restraint of Linear and Vercel (hairline borders instead of
  shadows, one accent color, whitespace as the layout).
replaces: aprameya_kluniversity_me-DESIGN.md (homepage-only file)
themes: [dark (default), light]
roles: [aspirant, core, admin]
pages: [Home, Projects, Events, Team, Recruitment, Blogs, About, Auth, Dashboard, Admin]
---

# 0. How an AI agent must use this file

1. Read this whole file before changing any UI.
2. Use ONLY the tokens in section 2. Never hardcode a hex color, px size, or radius that is not a token.
3. Apply the system to every page and component, not just the one being edited.
4. Keep existing content, text, routes, and logic. Change only visual styling and layout structure unless told otherwise.
5. Before finishing, run the checklist in section 14.

The single rule behind every decision: **if it looks heavy, remove something.**
Remove a border, a fill, a shadow, a size, a color. Do not add.

---

# 1. Design principles

| # | Principle | In practice |
|---|---|---|
| 1 | Quiet by default | Neutral surfaces, gray text. Color is rare so it means something. |
| 2 | Thin, not heavy | 1px borders at 8% white. No shadows. No thick strokes. No big filled blocks. |
| 3 | Red is a signal | Red = primary action, active state, live status. Never decoration, never large areas. |
| 4 | Space is the layout | Generous gaps between sections instead of boxes around everything. |
| 5 | One job per screen | Each section has one headline, one supporting line, one action. |
| 6 | Content first | Real photos, real project names, real dates. UI chrome stays out of the way. |
| 7 | Same everywhere | Same nav, button, card, spacing on all pages and all roles. |

Old design problems this file fixes:
- Red borders (`#EF4444`) on everything made the UI feel loud. Now borders are neutral gray, red only on focus and active.
- Bold 700 weight everywhere. Now 500 for headings, 400 for body.
- Huge 72px headlines at weight 700. Now fluid 40–64px at weight 500.
- Solid dark-gray filled buttons and cards. Now transparent with a thin border.
- Cards tinted on hover with a red border. Now a subtle border brighten only.

---

# 2. Design tokens

## 2.1 Colors

### Dark theme (default)

```css
:root,
[data-theme="dark"] {
  /* surfaces */
  --bg:            #0A0A0A;   /* page background */
  --surface:       #0F0F10;   /* cards, panels (barely lifted) */
  --surface-2:     #151516;   /* hover, inputs, menus */

  /* text */
  --text:          #FAFAFA;   /* headings, key text */
  --text-2:        #A1A1AA;   /* body text */
  --text-3:        #71717A;   /* captions, placeholders, meta (non-essential only) */

  /* borders */
  --border:        rgba(255,255,255,0.08);   /* default 1px line */
  --border-strong: rgba(255,255,255,0.16);   /* hover, inputs, focus-adjacent */

  /* brand */
  --red:           #DC2626;   /* primary buttons, active indicators */
  --red-hover:     #EF4444;
  --red-text:      #F87171;   /* red used as TEXT or icon on dark (passes contrast) */
  --red-soft:      rgba(220,38,38,0.10);     /* tinted background for badges/alerts */
  --red-line:      rgba(220,38,38,0.40);     /* only for active/selected border */

  --on-red:        #FFFFFF;

  /* inverse (white button on dark) */
  --invert-bg:     #FAFAFA;
  --invert-text:   #0A0A0A;

  /* status */
  --success:       #4ADE80;   --success-soft: rgba(74,222,128,0.10);
  --warning:       #FBBF24;   --warning-soft: rgba(251,191,36,0.10);
  --info:          #A1A1AA;   --info-soft:    rgba(255,255,255,0.06);
  /* error uses --red-text / --red-soft */

  --focus-ring:    #F87171;
}
```

### Light theme

```css
[data-theme="light"] {
  --bg:            #FFFFFF;
  --surface:       #FAFAFA;
  --surface-2:     #F4F4F5;

  --text:          #0A0A0A;
  --text-2:        #52525B;
  --text-3:        #8A8A93;

  --border:        rgba(0,0,0,0.08);
  --border-strong: rgba(0,0,0,0.16);

  --red:           #DC2626;
  --red-hover:     #B91C1C;
  --red-text:      #DC2626;
  --red-soft:      rgba(220,38,38,0.07);
  --red-line:      rgba(220,38,38,0.35);
  --on-red:        #FFFFFF;

  --invert-bg:     #0A0A0A;
  --invert-text:   #FAFAFA;

  --success:       #16A34A;   --success-soft: rgba(22,163,74,0.08);
  --warning:       #B45309;   --warning-soft: rgba(180,83,9,0.08);
  --info:          #52525B;   --info-soft:    rgba(0,0,0,0.05);

  --focus-ring:    #DC2626;
}
```

### Color rules
- Page background is `--bg`. Cards are `--surface` only when they need separation, otherwise just a border on `--bg`.
- Red usage budget: at most ONE red filled element visible per screen section (the main CTA). Everything else red is text, a 2px indicator, a dot, or a soft badge.
- Never use red for borders except `--red-line` on selected/active items.
- No gradients except the image scrim in 2.7. No glows. No neon.

## 2.2 Typography

Fonts: **Space Grotesk** (display, headings), **Inter** (body, UI), **JetBrains Mono** (labels, dates, metadata, code).
Fallbacks: `system-ui, -apple-system, "Segoe UI", sans-serif` and `ui-monospace, monospace`.

```css
:root {
  --font-display: "Space Grotesk", system-ui, sans-serif;
  --font-body:    "Inter", system-ui, sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, monospace;
}
```

| Token | Font | Size (desktop → mobile) | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| display | Space Grotesk | clamp(40px, 6vw, 64px) | 500 | 1.05 | -0.03em | Home hero only |
| h1 | Space Grotesk | clamp(32px, 4.5vw, 48px) | 500 | 1.1 | -0.025em | Page titles |
| h2 | Space Grotesk | clamp(24px, 3vw, 32px) | 500 | 1.2 | -0.02em | Section titles |
| h3 | Space Grotesk | 20px | 500 | 1.3 | -0.01em | Card titles |
| h4 | Inter | 16px | 600 | 1.4 | 0 | Small headings |
| body-lg | Inter | 18px | 400 | 1.6 | 0 | Hero subtext, intros |
| body | Inter | 16px | 400 | 1.6 | 0 | Default text |
| body-sm | Inter | 14px | 400 | 1.5 | 0 | Card text, table cells |
| label | JetBrains Mono | 12px | 500 | 1.4 | 0.06em, UPPERCASE | Eyebrows, tags, dates, meta |
| button | Inter | 14px | 500 | 1 | 0 | All buttons |
| code | JetBrains Mono | 13px | 400 | 1.6 | 0 | Code blocks |

Rules:
- Heading weight is 500, never 700. Hierarchy comes from size and color, not boldness.
- Heading color `--text`, body color `--text-2`, meta color `--text-3`.
- Max line length for paragraphs: 65ch. Blog article body: 68ch at 17–18px.
- Every section starts with a small mono **eyebrow label** (example: `01 — PROJECTS`) in `--text-3`, then an h2.

## 2.3 Spacing (8px grid)

```css
:root {
  --s-1: 4px;   --s-2: 8px;   --s-3: 12px;  --s-4: 16px;
  --s-5: 24px;  --s-6: 32px;  --s-7: 48px;  --s-8: 64px;
  --s-9: 96px;  --s-10: 128px;
}
```

| Context | Value |
|---|---|
| Space between page sections | 96px desktop, 64px tablet, 48px mobile |
| Hero top/bottom padding | 128px desktop, 80px mobile |
| Card padding | 24px (compact: 16px) |
| Gap between cards | 16px (feature grids: 24px) |
| Heading → paragraph | 12px |
| Paragraph → button | 24px |
| Page side padding | 24px mobile, 32px tablet, 48px desktop |

## 2.4 Radius

```css
:root {
  --r-sm:   6px;      /* tags, small buttons, inputs */
  --r-md:   10px;     /* buttons, cards */
  --r-lg:   14px;     /* large cards, modals, image frames */
  --r-full: 999px;    /* pills, avatars, role badges */
}
```
Buttons and inputs: `--r-md`. Cards: `--r-lg`. Avatars and badges: `--r-full`.

## 2.5 Borders

- Width is always **1px**. Never 2px except the focus ring and the active nav indicator.
- Default color `--border`. Hover `--border-strong`. Selected `--red-line`.
- Prefer a divider line between rows over boxing every row in a card.

## 2.6 Elevation

- **No box-shadows on cards, buttons, or inputs.**
- Floating layers only (dropdown, modal, toast, command palette): `box-shadow: 0 8px 30px rgba(0,0,0,0.35)` in dark, `0 8px 30px rgba(0,0,0,0.08)` in light, plus the 1px `--border-strong` border.
- Modal backdrop: `rgba(0,0,0,0.6)` with `backdrop-filter: blur(4px)`.

## 2.7 Image scrim

Use only on images that carry text:
`linear-gradient(to top, rgba(10,10,10,0.85), rgba(10,10,10,0) 60%)`

## 2.8 Motion

```css
:root {
  --ease: cubic-bezier(0.2, 0, 0, 1);
  --t-fast: 120ms;
  --t-base: 200ms;
  --t-slow: 400ms;
}
```
- Hover and focus changes: `--t-fast`, color and border only.
- Page section reveal on scroll: fade + 12px upward move, `--t-slow`, once, stagger 60ms.
- No bouncing, no parallax, no scale-up on hover, no spinning, no auto-playing loops except a single subtle hero visual.
- Respect `prefers-reduced-motion: reduce` by disabling all movement.

## 2.9 Layout

| Breakpoint | Width | Columns | Container |
|---|---|---|---|
| mobile | < 640px | 4 | 100% − 48px |
| tablet | 640–1023px | 8 | 100% − 64px |
| desktop | 1024–1439px | 12 | 1120px max |
| wide | ≥ 1440px | 12 | 1200px max |

- Content grids: 1 column mobile, 2 tablet, 3 desktop (4 for team and logos).
- Reading pages (blog post, long About text) use a single centered 680px column.
- Z-index: content 1, sticky nav 50, dropdown 60, modal 80, toast 100.

## 2.10 Icons
- Lucide icon set, 1.5px stroke, 16px inline / 20px standalone, color `--text-2`.
- Never filled icons. Never emoji in the UI chrome.

---

# 3. Roles (Aspirant, Core, Admin)

Roles control what a signed-in person sees. Visual language stays the same for all roles. Only content and a small role badge change.

| | **Aspirant** | **Core** | **Admin** |
|---|---|---|---|
| Who | Student applying or following the club | Active club member / team lead | Club head, site manager |
| Badge style | Outline, `--text-2` | Soft red (`--red-soft`, `--red-text`) | Inverted (`--invert-bg`, `--invert-text`) |
| Sees | Public pages, own application status, own profile, event RSVP | Everything Aspirant sees + member area, project workspace, attendance, review applications assigned to them | Everything + manage users, roles, content (projects, events, blogs, team), all applications, analytics |
| Primary CTA in nav | `Apply` (if not applied) or `My Application` | `Dashboard` | `Admin` |
| Dashboard layout | Single column, status tracker | Two column: tasks + activity | Sidebar layout with tables and stats |

### Role badge component
```
height: 22px; padding: 0 10px; border-radius: var(--r-full);
font: label token (mono 11px, uppercase); border: 1px solid var(--border);
```
- aspirant: transparent background, `--text-2`
- core: `--red-soft` background, `--red-text` text, border `--red-line`
- admin: `--invert-bg` background, `--invert-text` text, no border

### Role UI rules
- Hide, do not disable, features the role cannot use. Exception: show a locked state with one line of explanation when it motivates progress (example: Aspirant sees "Core members only" on a project workspace).
- Admin-only controls (edit, delete, publish) appear inline on hover as small ghost icon buttons, and in a visible "Manage" bar at the top of the page for Admins.
- Role badge shows beside the avatar in the nav dropdown and on the profile page. Never in public content like blog bylines (show a Core badge on team cards only).

---

# 4. Global components

## 4.1 Buttons

All buttons: height 40px (default), font `button` token, radius `--r-md`, padding 0 16px, 1px border, transition `--t-fast`. Icon gap 8px.

| Variant | Background | Text | Border | Hover | Use |
|---|---|---|---|---|---|
| primary | `--red` | `--on-red` | transparent | bg `--red-hover` | The one main action per section |
| inverse | `--invert-bg` | `--invert-text` | transparent | opacity 0.9 | Strong secondary (hero second CTA, nav CTA on dark) |
| secondary | transparent | `--text` | `--border-strong` | bg `--surface-2` | Most buttons |
| ghost | transparent | `--text-2` | transparent | text `--text`, bg `--surface-2` | Tertiary, icon buttons, table actions |
| danger | transparent | `--red-text` | `--red-line` | bg `--red-soft` | Delete, reject |

Sizes: `sm` 32px / 13px text, `md` 40px, `lg` 48px (hero and form submit). Mobile primary CTAs use `lg`.
States: disabled opacity 0.4 and `cursor: not-allowed`; loading shows a 14px spinner and keeps width; active `transform: none` (no press scale).
Link-style button: text with an arrow `→`, arrow shifts 2px right on hover.

## 4.2 Navigation (global header)

- Height 64px, sticky, background `--bg` at 80% with `backdrop-filter: blur(12px)`, bottom border 1px `--border`. Border appears only after the page scrolls 8px.
- Left: logo (24px mark + "Aprameya" in Space Grotesk 500 16px).
- Center (desktop): `Home  Projects  Events  Team  Recruitment  Blogs  About` in Inter 14px, `--text-2`. Hover `--text`. **Active page: `--text` plus a 2px red underline 8px below the label** (no filled white pill).
- Right: theme toggle (ghost icon), then
  - signed out: `Sign in` (ghost) + `Apply` (primary, sm)
  - signed in: avatar (28px) opening a dropdown with name, role badge, Dashboard / Profile / (Admin) / Sign out.
- Mobile (< 900px): logo left, menu icon right. Menu opens a full-screen sheet on `--bg` with large links (h2 size, 56px row height, 1px dividers), CTA pinned at the bottom.

## 4.3 Footer
- Top border 1px `--border`. Padding 64px top, 32px bottom. Background `--bg`.
- 4 columns desktop: brand + one-line mission + social icon buttons (ghost, 36px) | Explore (the 7 pages) | Join (Apply, Events, Contact) | Contact (email, location "KL University, Vijayawada").
- Bottom row: copyright left, "Built by Aprameya" right, in `label` token. 1px divider above it.
- Mobile: columns stack, 2 columns for link lists.

## 4.4 Cards (base)
```
background: transparent (or --surface when needed);
border: 1px solid var(--border);
border-radius: var(--r-lg);
padding: 24px;
transition: border-color var(--t-fast) var(--ease), background var(--t-fast) var(--ease);
hover: border-color var(--border-strong); background var(--surface);
```
- No shadow, no scale, no red border on hover.
- Entire card is one clickable link when it leads somewhere (single focus target).
- Image inside card: radius `--r-md`, aspect ratio fixed (16:10 for project/event/blog), `object-fit: cover`, border 1px `--border`.

## 4.5 Tags / chips
Height 24px, padding 0 10px, radius `--r-full`, `label` token, border 1px `--border`, color `--text-2`. Selected filter chip: border `--red-line`, color `--red-text`, background `--red-soft`.

## 4.6 Form controls
- Input/textarea/select: height 44px (textarea min 120px), background transparent, border 1px `--border-strong`, radius `--r-md`, padding 0 14px, text `--text`, placeholder `--text-3`.
- Focus: border `--focus-ring` plus `box-shadow: 0 0 0 3px var(--red-soft)`. No outline jumping.
- Label above the field: Inter 13px 500 `--text`. Helper text below: 13px `--text-3`.
- Error: border `--red-text`, message in `--red-text` with a 14px alert icon. Success: check icon in `--success`.
- Checkbox/radio 18px, 1px border, checked fill `--red` with white mark.
- Toggle: 36×20 pill, off `--surface-2` + border, on `--red`.
- Forms are one column, max width 480px, 20px gap between fields. Multi-step forms use the stepper (4.9).

## 4.7 Tabs and segmented filters
- Tabs: text row with a 1px bottom divider; active tab `--text` with a 2px red underline overlapping the divider. Inactive `--text-2`.
- Filter bar (Projects, Events, Blogs): horizontally scrollable row of chips, plus a search input (right, 240px) on desktop.

## 4.8 Tables (Admin and Core)
- No outer card fill. Header row: `label` token, `--text-3`, 1px bottom border. Rows: 56px height, 1px bottom `--border`, hover bg `--surface`.
- Sticky header, row actions as ghost icon buttons revealed on row hover (always visible on touch).
- Status cells use soft badges (4.10). Mobile: rows turn into stacked cards.

## 4.9 Stepper / progress (Recruitment, application status)
- Horizontal on desktop, vertical on mobile. Each step: 8px dot + label + date.
- Done: dot filled `--text`. Current: dot `--red` with 4px `--red-soft` ring. Upcoming: dot outlined `--border-strong`. Connecting line 1px `--border`.

## 4.10 Status badges
Soft style: height 22px, padding 0 8px, radius `--r-sm`, `label` token, 6px dot before the text.
- Open / Live / Accepted → `--success` on `--success-soft`
- Upcoming / Pending / In review → `--warning` on `--warning-soft`
- Closed / Past / Draft → `--text-3` on `--info-soft`
- Rejected / Error → `--red-text` on `--red-soft`
- Live event pulse: the dot pulses `opacity 1 → 0.4` over 1.6s (the only looping animation allowed).

## 4.11 Modal, drawer, toast, dropdown
- Modal: max width 480px (form 560px), background `--surface`, border 1px `--border-strong`, radius `--r-lg`, padding 24px, floating shadow. Title h3, close ghost icon top right. Footer buttons right-aligned: secondary then primary.
- Mobile: modals become bottom sheets (radius 14px on top corners).
- Drawer (admin edit forms): 440px from the right.
- Toast: bottom right, 360px, `--surface`, 1px border, 12px radius, 4s auto dismiss, left 2px color bar by status.
- Dropdown/menu: `--surface-2`, 1px `--border-strong`, radius `--r-md`, items 36px high, hover `--surface`.

## 4.12 Avatars
Sizes 28 / 40 / 64 / 96px, always circular, 1px `--border`. Fallback: initials in `--surface-2` with `--text-2`.

## 4.13 Empty, loading, error states
- Skeleton: `--surface-2` blocks with a slow shimmer (1.4s), same shape as final content. No spinners for page loads.
- Empty state: centered, 20px icon in `--text-3`, h4 title, one line of body-sm, one secondary button. Example: "No events this month. Check past events →".
- Error page (404/500): large mono `404` in `--text-3`, h1, one line, primary "Back to home".

## 4.14 Accordion (FAQ)
Rows separated by 1px dividers, 64px row height, plus/minus icon right (`--text-2`), open content body-sm `--text-2`, height animates `--t-base`.

## 4.15 Command palette (optional, nice to have)
`Ctrl/⌘ + K` opens a centered 560px search over pages, projects, events, blog posts. Same modal styling, results in 40px rows with mono type labels on the right.

---

# 5. Page designs

Every page begins with the same **page header**: eyebrow label, h1, one-line description (body-lg, `--text-2`, max 56ch), bottom padding 64px. Left aligned, never centered, except the Home hero closing section.

## 5.1 Home

User goal: "What is this club, is it impressive, how do I join or see their work?" Answer in 5 seconds.

Section order:
1. **Hero** (full viewport height minus nav)
   - Eyebrow: `AUTONOMOUS SYSTEMS & ROBOTICS · KL UNIVERSITY`
   - Display headline, 2 lines max, one key word in `--red-text` (only here)
   - body-lg subtext, 1–2 lines
   - Buttons: `Join the club` (primary, lg) + `See our projects` (secondary, lg)
   - Visual: one real photo or the robot/car image on the right (desktop) in a `--r-lg` frame with 1px border, or below text on mobile. No glow.
   - Under the buttons: 3 tiny stats in mono (`12 PROJECTS · 40+ MEMBERS · 5 COMPETITIONS`) separated by 1px vertical dividers.
2. **Trusted / achievements strip**: one row of competition or partner names in `--text-3`, 1px top and bottom borders. Quiet, no logos boxes.
3. **What we build** (3 cards): domains (Autonomous vehicles, Drones, Robotics) with a line icon, h3, two lines of text.
4. **Featured projects**: 3 project cards in a row (see 5.2 card), link `View all projects →`.
5. **Upcoming events**: next 3 events as a list of horizontal rows (date block left, title, location, status badge, arrow). 1px dividers between rows, not boxed cards.
6. **How to join**: 3-step horizontal row (Apply → Interview/Task → Onboard) with mono numbers `01 02 03`. One primary CTA.
7. **Latest from the blog**: 3 blog cards.
8. **Final CTA band**: centered h2 "Build the future with us.", primary button. Top and bottom 1px borders, no fill.
9. Footer.

## 5.2 Projects

User goal: browse what the club has built, see how serious it is, find one to read or contribute to.

- Page header + filter bar (chips: All, Autonomous, Drone, Robotics, Software, AI; sort dropdown: Newest / Featured). Search input.
- **Featured project** at the top: large horizontal card (image left 55%, text right), status badge, tags, 2-line summary, `View project →`.
- **Project grid**: 3 columns. Project card = image (16:10) + status badge over image top-left + h3 title + 2-line summary + footer row (tags left, year in mono right).
- **Project detail page**:
  - Header: title (h1), status badge, one-line summary, buttons `View code` (secondary) and `Read write-up` (ghost).
  - Hero image in `--r-lg` frame.
  - Two columns: left long-form content (680px), right sticky sidebar card with Team (avatars), Tech stack (chips), Timeline (dates), Links.
  - Bottom: Gallery (masonry, 1px borders) and "Related projects" (3 cards).
  - Core and Admin see a `Manage` bar and an `Open workspace` button. Aspirant sees a locked card "Join the club to contribute".

## 5.3 Events

User goal: "What is happening, when, where, can I join?"

- Page header + tabs: `Upcoming` | `Past`. View toggle: List / Calendar (ghost icon buttons).
- **Next event spotlight** (only on Upcoming): wide card with date (large mono day + month), title h2, location and time with icons, countdown in mono (`04D 12H 30M`), buttons `Register` (primary) + `Add to calendar` (secondary).
- **Event list rows**: date block (64px, month in mono label, day in h2) | title h3 + tag chips + one line | location | status badge | `Register →`. Dividers between rows.
- Event detail: banner image, key facts bar (date, time, venue, seats left, price) in 4 cells divided by 1px lines, agenda timeline, speakers/host avatars, FAQ accordion, sticky bottom CTA bar on mobile with `Register`.
- Registration is a modal form (name, email, roll no, year) with a success state that offers "Add to calendar".
- **Past events**: grid with photo, title, date, and `View recap`. Recap pages show a photo gallery and summary. Post-event pages replace the Register button with a recap, never a dead form.
- Core/Admin: attendance list, QR check-in button, edit event.

## 5.4 Team

User goal: "Who runs this, are they credible, can I reach them?"

- Page header + role/domain filter chips: All, Leads, Core, Alumni, and domain chips.
- **Leadership row**: 3–4 larger cards (avatar 96px, name h3, role in mono label, one-line bio, GitHub/LinkedIn ghost icons).
- **Core members grid**: 4 columns desktop, 2 mobile. Card: square photo (radius `--r-md`, grayscale by default, color on hover, `--t-base`), name, role, domain tag.
- Clicking a member opens a side drawer (not a new page) with bio, projects they worked on, links.
- **Alumni**: compact text list in two columns, with year and current company.
- Core badge appears on member cards only for Core/Admin viewers' management view.

## 5.5 Recruitment

User goal: "Can I join, what is required, what happens next, when is the deadline?" This is the most important conversion page.

1. Page header with a status badge (`Applications open` / `Closed`) and deadline in mono.
2. **Roles/domains** list: rows with domain name, one-line description, open slots, `Apply →`. Dividers, no boxes.
3. **Process**: horizontal stepper (Apply → Screening → Task → Interview → Result) with dates.
4. **Eligibility and what we look for**: two simple columns of short text.
5. **Apply section**:
   - Not signed in: card with `Sign in with college email` primary button.
   - Signed in Aspirant: multi-step form (1 Basics, 2 Interests, 3 Experience, 4 Review). Progress bar thin 2px at top. Autosave, with "Saved" mono text. Large 44px inputs, one question group per step.
   - After submit: **Application tracker** with the stepper and current status badge, plus "Edit" until the deadline.
6. FAQ accordion.
7. Contact line for questions.

Core: sees `Review applications` shortcut. Admin: full applications table (filters, status change, notes, export CSV).

## 5.6 Blogs

User goal: "Read something useful, find articles on a topic."

- Page header + topic chips + search.
- **Featured post**: large horizontal card at the top.
- **Post grid**: 3 columns. Card = cover image (16:10), topic chip, h3 title (2 lines max), excerpt (2 lines), footer: author avatar 20px + name + date + reading time in mono.
- **Article page**: centered 680px column. Order: topic eyebrow, h1, byline row, cover image, body (17–18px, line-height 1.7), headings h2/h3, code blocks (`--surface`, 1px border, mono 13px, copy button), blockquote with 2px left border `--border-strong`, images full-width with caption in `--text-3`. Sticky thin 2px red reading-progress bar at the top. Footer of article: author card, share buttons, previous/next, related posts.
- Core/Admin: `Write post` button, markdown editor with live preview, draft/published badge.

## 5.7 About

User goal: "What is the story and mission, can I trust them?"

1. Page header with mission statement as the h1 (one sentence).
2. Story: two-column, left big text (h2), right 2 paragraphs `--text-2`.
3. Numbers row: 4 stats separated by 1px vertical lines (mono labels).
4. Values: 3–4 items with icon, h3, short line (open layout, no card boxes).
5. Timeline: vertical 1px line, mono years, short milestones (founded, first competition, first prize).
6. Achievements list (rows with year, title, result badge).
7. Mentors / faculty coordinators: small avatar cards.
8. Sponsors and partners: logo row, grayscale, `--text-3` captions.
9. Contact and location block, CTA to Recruitment.

## 5.8 Auth (Sign in / Sign up)
- Centered 400px card on `--bg`, no heavy decoration. Logo on top, h2 "Welcome back", `Continue with college email` (inverse, lg), divider "or", email field + secondary button. Footer text link to Recruitment.
- Roles are assigned by Admin. New accounts default to **Aspirant**.

## 5.9 Dashboard (signed in)
- **Aspirant**: greeting, application status stepper, upcoming registered events, recommended projects/blogs.
- **Core**: left column tasks / assigned reviews, right column club activity feed, quick links (my projects, attendance, upcoming events).
- Layout: top nav stays, content in 12-col grid, cards with 1px borders, widgets titled with `label` token.

## 5.10 Admin panel
- Left sidebar 240px (collapsible to 64px icons), 1px right border. Items: Overview, Applications, Users and roles, Projects, Events, Team, Blogs, Settings. Active item: `--surface-2` background with 2px red left indicator.
- Overview: 4 stat cards (number in Space Grotesk 32px, label mono, delta in `--success` or `--red-text`), recent applications table, upcoming events.
- Every list page: table (4.8), search, filters, `+ New` primary button top right, edit in a drawer.
- Role management: table with user, current role badge, dropdown to change role with confirm modal.
- Destructive actions always ask for confirmation in a modal using the danger button.

---

# 6. Content and voice
- Short, direct, confident. Sentence case for all headings and buttons ("Join the club", not "JOIN THE CLUB").
- Only the `label` token is uppercase.
- Button text starts with a verb: Apply, Register, Read, View.
- Dates: `12 NOV 2026` in mono. Times: 24h or `6:00 PM` consistently.
- Numbers need context: "12 projects built since 2022".

---

# 7. Imagery
- Real photos of the team, builds, and competitions beat stock images. Apply a consistent treatment: slightly desaturated, 1px border, `--r-lg` or `--r-md`.
- Aspect ratios fixed: 16:10 cards, 1:1 team, 21:9 banners.
- Use `loading="lazy"`, `width`/`height` attributes, WebP/AVIF, and a blurred placeholder.
- Provide `alt` text on every image.

---

# 8. Responsive behavior

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Nav | Menu icon + full-screen sheet | Same as desktop if it fits, else sheet | Inline links |
| Hero | Text then image, display 40px | Display 52px | Two columns, display 64px |
| Card grids | 1 col | 2 col | 3 col (team 4) |
| Event row | Stacked: date + title + badge | Row | Row |
| Tables | Stacked cards | Table | Table |
| Modals | Bottom sheet | Centered | Centered |
| Admin sidebar | Bottom sheet menu | Collapsed icons | Expanded |

- Touch targets at least 44×44px (buttons `lg` on mobile for primary actions).
- Test at 375, 768, 1024, 1440 px. No horizontal scroll at any width.
- Body text never goes below 14px.

---

# 9. Accessibility
- Text contrast at least 4.5:1 (use `--red-text` for red text on dark, never `--red`).
- Visible focus on every interactive element: `outline: 2px solid var(--focus-ring); outline-offset: 2px`.
- Keyboard: all menus, modals, drawers, tabs operable with keyboard; modals trap focus and close on Esc.
- Semantic HTML: one h1 per page, `nav`, `main`, `footer`, `button` vs `a` used correctly.
- Never use color alone for status (always dot + text).
- Support `prefers-reduced-motion` and `prefers-color-scheme` (default to the user's system, with a manual toggle saved in localStorage).

---

# 10. Performance
- Fonts: self-host Space Grotesk, Inter, JetBrains Mono with `font-display: swap`, subset to Latin, load only used weights (400, 500, 600).
- Images lazy-loaded and sized; hero image preloaded.
- Skeletons for any content that loads after the first paint.

---

# 11. Do and Don't

**Do**
- Use 1px borders at `--border` and let whitespace do the separating.
- Left-align text and headings.
- Keep one primary red button per section.
- Use weight 500 headings with tight tracking.
- Keep hover effects to border and background color shifts.
- Show real status (Open, Live, Closed) with soft badges.
- Use the same components on every page.

**Don't**
- Don't add box-shadows to cards or buttons.
- Don't use red borders, red backgrounds, or red gradients on large areas.
- Don't use bold 700 headings or all-caps headings.
- Don't use filled gray blocks around every item.
- Don't use more than 2 font weights on one screen.
- Don't scale, rotate, or bounce on hover.
- Don't center long text blocks.
- Don't introduce new colors, radii, or fonts outside the tokens.
- Don't show disabled admin features to Aspirants.

---

# 12. Tailwind mapping (if the project uses Tailwind)

```js
// tailwind.config.js (extend)
theme: {
  extend: {
    colors: {
      bg: "var(--bg)", surface: "var(--surface)", "surface-2": "var(--surface-2)",
      text: "var(--text)", "text-2": "var(--text-2)", "text-3": "var(--text-3)",
      border: "var(--border)", "border-strong": "var(--border-strong)",
      red: { DEFAULT: "var(--red)", hover: "var(--red-hover)", text: "var(--red-text)", soft: "var(--red-soft)", line: "var(--red-line)" },
    },
    borderRadius: { sm: "6px", md: "10px", lg: "14px" },
    fontFamily: {
      display: ["Space Grotesk", "system-ui", "sans-serif"],
      body: ["Inter", "system-ui", "sans-serif"],
      mono: ["JetBrains Mono", "ui-monospace", "monospace"],
    },
    transitionTimingFunction: { DEFAULT: "cubic-bezier(0.2,0,0,1)" },
  },
}
```
Default utility pattern for a card: `border border-border rounded-lg p-6 hover:border-border-strong hover:bg-surface transition-colors`.

---

# 13. Ready-to-use prompts for the AI

**Full redesign**
> Read DESIGN.md fully. Redesign the whole site UI to match it exactly: update global CSS variables, fonts, nav, footer, buttons, cards, forms, and every page (Home, Projects, Events, Team, Recruitment, Blogs, About, Auth, Dashboard, Admin). Keep all content, routes, and logic unchanged. Use only the tokens in section 2.

**One page**
> Using DESIGN.md, redesign the [Events] page following section 5.3. Reuse the global components from section 4. Do not change other pages.

**One component**
> Using DESIGN.md section 4.4 and 4.10, restyle the project card. Thin 1px border, no shadow, hover only brightens the border.

**Review**
> Audit the current UI against DESIGN.md section 14 and list every violation with file and line, then fix them.

---

# 14. Final checklist (agent must verify)

- [ ] No hardcoded colors, sizes, or radii outside tokens
- [ ] All borders are 1px and neutral (red only for active/selected/focus)
- [ ] No box-shadow on cards, buttons, inputs
- [ ] Headings weight 500, tracking negative, sentence case
- [ ] Max one filled red button per section
- [ ] Nav active state is a 2px red underline, not a white pill
- [ ] Section spacing 96 / 64 / 48 px (desktop / tablet / mobile)
- [ ] Every page has eyebrow + h1 + one-line description
- [ ] Role badges and role-based visibility implemented (aspirant, core, admin)
- [ ] Loading, empty, and error states exist for every list
- [ ] Focus rings visible, keyboard navigation works, contrast passes
- [ ] Works at 375 / 768 / 1024 / 1440 px with no horizontal scroll
- [ ] Dark and light themes both render correctly
- [ ] Reduced-motion respected
