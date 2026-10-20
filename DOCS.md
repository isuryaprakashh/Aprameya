# APRAMEYA Autonomous Systems Lab — System Documentation (DOCS.md)

Welcome to the central technical documentation for **APRAMEYA Autonomous Systems Club** (KL University). This document details the system architecture, design tokens, database schemas, active features, and the mandatory ledger for all new features added by contributors and AI agents.

---

## 1. System Architecture

```
APRAMEYA-ASC/
├── client/                     # Vite + React + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # Design system UI tokens & specialized cards
│   │   │   ├── TeamMemberCard.tsx # Standardized 3-column personnel card
│   │   │   ├── ProjectCard.tsx    # Autonomous project card
│   │   │   ├── EventCard.tsx      # Workshop & competition card
│   │   │   ├── ui/                # ChamferedButton, StatusBadge, FormField
│   │   │   └── Navbar.tsx         # Responsive brand header
│   │   ├── pages/              # Routed views (Home, Teams, Projects, Events, etc.)
│   │   ├── lib/                # Types, static fallback data, slug utilities
│   │   └── context/            # Authentication & session context
│   └── .env.example            # Client environment template
├── server/                     # Node.js + Express + MongoDB Backend
│   ├── src/
│   │   ├── models/             # Mongoose schemas (User, TeamMember, Project, etc.)
│   │   ├── routes/             # REST endpoints (auth, teams, events, tickets, etc.)
│   │   ├── middleware/         # Auth verification & role guards
│   │   └── db.ts               # MongoDB Atlas connection lifecycle
│   └── .env.example            # Server environment template
├── DESIGN.md                   # Strict design specifications & token manual
├── CLAUDE.md                   # AI & Contributor behavioral directives
└── DOCS.md                     # System documentation & feature ledger (This file)
```

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Wouter (lightweight routing), TanStack React Query v5, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, MongoDB Atlas with Mongoose ODM, express-session with connect-mongo session storage, bcryptjs, Nodemailer.
- **Build Tools**: Vite 5 for lightning-fast bundling, PostCSS, Autoprefixer.

---

## 2. Design System Tokens & Guidelines

All frontend styles must derive from `DESIGN.md`:

| Token | CSS Variable | Dark Value | Light Value | Usage |
|---|---|---|---|---|
| Background | `--bg` | `#080808` | `#FFFFFF` | Page canvas |
| Surface | `--surface` | `#101010` | `#FAFAFA` | Cards, popovers, modals |
| Surface Secondary | `--surface-2` | `#171717` | `#F4F4F5` | Chips, search inputs, nested containers |
| Border | `--border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` | Standard 1px container dividers |
| Border Strong | `--border-strong` | `rgba(255,255,255,0.16)` | `rgba(0,0,0,0.16)` | Hover & active container states |
| Primary Text | `--text` | `#F4F4F5` | `#0A0A0A` | Headings, active values, card titles |
| Secondary Text | `--text-2` | `#A1A1AA` | `#52525B` | Paragraphs, descriptions, subheadings |
| Tertiary Text | `--text-3` | `#71717A` | `#8A8A93` | Metadata, tags, mono dates, labels |
| Red Accent | `--red` | `#D9383A` | `#DC2626` | Primary action button fills |
| Red Text | `--red-text` | `#FF5A5C` | `#DC2626` | High-priority accents, active status |
| Red Soft | `--red-soft` | `rgba(217,56,58,0.12)` | `rgba(220,38,38,0.07)` | Badge backgrounds, active chip fill |
| Red Line | `--red-line` | `rgba(217,56,58,0.40)` | `rgba(220,38,38,0.35)` | Active category badge borders |

### Red Budget Rule
Never saturate screens with red. Exactly **ONE** primary red filled button is permitted per viewport section. Secondary actions must use dark surface outline buttons.

---

## 3. Core Features & Module Documentation

### 3.1. Team Roster (`Teams.tsx` & `TeamMemberCard.tsx`)
- **Route**: `/team` and `/teams`
- **Sections**:
  1. **`MENTORS`**: Faculty advisors and technical mentors guiding autonomy initiatives.
  2. **`CLUB LEADS`**: Student executive leadership (President, VP, General Secretary, Technical Heads).
  3. **`ADVISORS`**: Strategic advisors and alumni steering laboratory governance.
- **Card Specifications**:
  - **Color**: Full color portrait photos (no grayscale filter).
  - **Grid**: 3 cards per row on desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`).
  - **Portrait Framing**: 15% bottom-trimmed aspect ratio (`aspect-[1/1.02]`) with `object-cover object-top`.
  - **Overlays**: Year badge top-left (`3RD YEAR`, `FACULTY`), Category badge top-right (`CORE TEAM`, `FACULTY MENTOR`).
  - **Name**: Uppercase Space Grotesk 500 white text (remains white on hover) with `#order` pill tag.
  - **Role & Dept**: Red uppercase role tag with mono `Dept: <Department>`.
  - **Action Link**: `View Profile & Credentials →` in light coral (`#ff7875`), with no underline text decoration on hover.
  - **Footer Strip**: Monospace `APRAMEYA LAB` on the left, social links (`Mail`, `LinkedIn`, `GitHub`) on the right.

### 3.2. Home Screen Hero (`Home.tsx`)
- **Route**: `/`
- **Pill Eyebrow**: Capsule badge with red indicator dot: `KL University • Autonomous Systems & Robotics Club`.
- **Headline**: 4-line balanced display typography:
  - `We are APRAMEYA` (silver + bold white)
  - `and we build` (silver)
  - `autonomous` (vivid red)
  - `systems.` (vivid red)
- **Action Buttons**: Primary `Join Aprameya` + Secondary `Explore Repositories →`.
- **Hero Video Frame**: Looping physical vehicle video (`/assets/hero-loop.mp4`) with clean metadata scrim (`Physical Autonomous Vehicle` / `KL-AV-01`).
- **4-Metric Stats Strip**: `2019` (Founded), `50+` (Active Members), `3rd` (National Rank), `100%` (Hands-on Engineering).

### 3.3. Recruitment System (`Recruitment.tsx`, `RecruitmentApply.tsx`, `RecruitmentStatus.tsx`)
- **Routes**: `/recruitment`, `/recruitment/apply`, `/recruitment/status`
- **Tracks**: Technical (Software, Hardware, Autonomy) & Non-Technical (Designing, Broadcasting, Event Management).
- **Application Flow**: Multi-step application submission, review dashboard for Core/Admin leads, and status tracker for applicants (`pending_review`, `interview_scheduled`, `accepted`, `rejected`).

### 3.4. Events & QR Ticketing (`Events.tsx`, `TicketRegistration.tsx`, `AdminScanQR.tsx`)
- **Routes**: `/events`, `/tickets`, `/admin/scan-qr`
- **Features**: Event listings, registration forms, QR code generation for physical check-in, and camera scanner interface for laboratory administrators.

---

## 4. Database Schema Reference (MongoDB)

### `TeamMember` Schema
```ts
{
  name: string;        // Full member name
  role: string;        // Club designation (e.g. "PRESIDENT", "Technical Head")
  category: string;    // "Faculty Mentors" | "Club Leads" | "Core Team" | "Advisors"
  department: string;  // Department code (e.g. "CSE", "ECE")
  year: string;        // Academic year (e.g. "3RD YEAR", "Faculty")
  image?: string;      // Image URL (full color portrait)
  bio?: string;        // Detailed member background
  email?: string;      // Contact email
  linkedin?: string;   // LinkedIn profile URL
  github?: string;     // GitHub profile URL
  order?: number;      // Display rank (#1, #2, etc.)
}
```

### `RecruitmentApplication` Schema
```ts
{
  userId?: ObjectId;
  fullName: string;
  rollNumber: string;
  department: string;
  specialization: string;
  year: string;
  track: "TECH" | "NON_TECH";
  wing: string;
  roleInterest?: string;
  motivation: string;
  status: "pending_review" | "interview_scheduled" | "accepted" | "rejected";
  appliedAt: Date;
}
```

---

## 5. Mandatory Protocol for New Features

Whenever a contributor or AI coding agent implements a new feature or architectural change:
1. **Never break existing commit histories** or overwrite others' work.
2. **Follow `DESIGN.md` strictly** for all UI tokens.
3. **Log the feature below in Section 6 (Feature Ledger & Changelog)** including:
   - Feature Title & Date
   - Files Modified / Created
   - Summary of Changes & User Value
   - Verification Steps Performed

---

## 6. Feature Ledger & Changelog

### [2026-10-20] — Team Page Revamp & Reference Card Implementation
- **Files Modified**: `client/src/components/TeamMemberCard.tsx`, `client/src/pages/Teams.tsx`
- **Summary**:
  - Removed grayscale image filters to make all personnel photos full-color.
  - Divided team directory into 3 distinct sections: `MENTORS`, `CLUB LEADS`, and `ADVISORS`.
  - Re-architected member cards to 3 cards per row on desktop with 15% bottom-trimmed portraits (`aspect-[1/1.02]`).
  - Added year badge, category badge, `#order` tag, light coral link (`#ff7875`), and monospace footer.
  - Preserved white text for member names on hover and removed link underlines.
- **Verification**: `npm run build` passed with 0 errors in 14.82s.

### [2026-10-20] — Home Page Hero Revamp & Video Frame Restoration
- **Files Modified**: `client/src/pages/Home.tsx`, `client/src/components/Navbar.tsx`
- **Summary**:
  - Implemented 4-line color-balanced headline (`We are APRAMEYA and we build autonomous systems.`).
  - Added pill eyebrow with pulsing red dot (`KL University • Autonomous Systems & Robotics Club`).
  - Restored the looping vehicle video (`/assets/hero-loop.mp4`) with bottom metadata scrim.
  - Added 4-metric statistics strip (`2019`, `50+`, `3rd`, `100%`) under hero.
  - Enlarged navbar vehicle logo icon to `h-8 sm:h-9 w-auto` and changed branding text to uppercase `APRAMEYA`.
- **Verification**: `npm run build` passed cleanly in 8.59s.

### [2026-10-20] — AI & Contributor Governance (`CLAUDE.md` & `DOCS.md`)
- **Files Created**: `CLAUDE.md`, `Aprameya/CLAUDE.md`, `DOCS.md`, `Aprameya/DOCS.md`
- **Summary**:
  - Established strict rules prohibiting destructive git operations (`git reset --hard`, `git push --force`) to safeguard all authors' commits.
  - Mandated exclusive adherence to `DESIGN.md`.
  - Enforced automatic logging of all future features into `DOCS.md` for all AI agents and IDEs.
