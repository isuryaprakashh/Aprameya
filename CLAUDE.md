# APRAMEYA Autonomous Systems Club — AI & Contributor Directives (CLAUDE.md)

This file sets the universal rules and constraints for all AI coding agents (Claude Code, Cursor, Antigravity, Copilot, Windsurf) and human contributors working on the **APRAMEYA** codebase.

---

## 1. Absolute Rule: Follow `DESIGN.md` Exclusively

All frontend styling, layout decisions, typography, and color tokens must strictly adhere to [`DESIGN.md`](./DESIGN.md). Never invent ad-hoc colors, borders, gradients, or glows.

### Core Visual Standards
1. **Color Tokens**:
   - Background: `--bg` (`#080808` in dark, `#FFFFFF` in light)
   - Surfaces: `--surface` (`#101010`), `--surface-2` (`#171717`)
   - Borders: 1px solid `--border` (`rgba(255,255,255,0.08)`), `--border-strong` (`rgba(255,255,255,0.16)`)
   - Text Hierarchy: `--text` (primary, `#F4F4F5`), `--text-2` (secondary, `#A1A1AA`), `--text-3` (tertiary/mono, `#71717A`)
   - Red Accent Token: `--red` (`#D9383A`), `--red-text` (`#FF5A5C`), `--red-soft` (`rgba(217,56,58,0.12)`), `--red-line` (`rgba(217,56,58,0.40)`)
2. **Red Signal Budget**:
   - At most **ONE** red filled button visible per screen section (the primary CTA).
   - All other red elements are limited to text, status badges, dots, or 2px active indicators.
3. **Typography**:
   - **Headings & Display**: Space Grotesk (weight 500, tight tracking).
   - **Body & UI**: Inter (weight 400/500).
   - **Labels, Dates, Badges, Code**: JetBrains Mono (weight 500, uppercase, tracking `0.06em`).
4. **No Shadows or Glows**:
   - Zero `box-shadow` glows or neon borders. Depth is achieved purely through 1px borders and surface steps.
5. **Team Cards Specification**:
   - **Color**: Portrait photos must be **full color** by default (no grayscale filter).
   - **Grid**: Exactly 3 cards per row on desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`).
   - **Portraits**: Top 15% bottom-trimmed aspect ratio (`aspect-[1/1.02]`) with `object-cover object-top`.
   - **Content**: Year badge (top-left), Category badge (top-right), Member name (uppercase bold white, remains white on hover), Role (red uppercase), `Dept: <Department>`, `View Profile & Credentials →` link (lighter coral `#ff7875`, no underline on hover).
   - **No Description**: Do not show bio paragraphs on the card face.

---

## 2. Git Safety: Never Override or Erase Commits

To protect the collaborative work of all team members (Surya, Yash, Uday, and other contributors):

1. **NEVER Force Push**:
   - `git push --force` or `git push --force-with-lease` is strictly prohibited unless explicitly authorized in writing by the repository owner.
2. **NEVER Destructively Reset**:
   - Do NOT run `git reset --hard` against remote branches. Doing so destroys untracked work and local `.env` configurations.
3. **No Squashing or Rewriting Others' Work**:
   - When pulling or integrating branches, preserve the full commit history and author attribution:
     ```bash
     git pull --no-rebase origin main
     ```
4. **Preserve Environment Variables**:
   - Never wipe out, commit, or overwrite `.env` files in `client/` or `server/`.
   - Always maintain and update `client/.env.example` and `server/.env.example` when adding new configuration variables.

---

## 3. Mandatory Documentation: Update `DOCS.md`

Any AI assistant, IDE extension, or developer that commits changes or adds features **MUST** document their work in [`DOCS.md`](./DOCS.md).

### What Must Be Documented:
- **New Features**: Component additions, pages, routing, or state handlers.
- **API Changes**: New or modified REST endpoints, query parameters, auth middleware.
- **Database Schema Updates**: Changes to MongoDB models (`User`, `TeamMember`, `Project`, `Event`, `RecruitmentApplication`, `TicketRegistration`).
- **Design System Adjustments**: Token updates, component variants, or layout reorganizations.

### Protocol for Every AI Agent / IDE:
Before finishing any task or concluding a coding turn:
1. Review changes made in the active turn.
2. Open [`DOCS.md`](./DOCS.md).
3. Append or update the relevant architectural section and the **Changelog / Feature Ledger**.
4. Verify that the documentation is accurate, complete, and references file paths cleanly.

---

## 4. Development & Build Verification Commands

Always verify that changes compile with 0 errors before committing:

```bash
# Frontend Build Verification (from client/)
cd client
npm run build

# Backend Syntax & Connection Check (from server/)
cd server
npm run check
```
