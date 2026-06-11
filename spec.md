# Claims Insight — Look & Feel Specification (spec.md)

> **Purpose of this document**
> This spec describes the **look and feel** of the Claims Insight application — its visual design, screens, layout, and interaction style. It intentionally does **not** cover architecture, data modeling, APIs, or any technical implementation detail. It is a design brief for how the app should *look, feel, and behave* to the people who use it.

---

## 1. Overview

**App name:** Claims Insight
**Tagline:** Investigate any auto-insurance claim, customer, policy, or adjuster in seconds.
**Source of truth:** The app surfaces data from the **`autoclaims_sm`** semantic model in the **Amol_dev** Fabric workspace. (Referenced here only as the origin of what's shown on screen — not a technical specification.)

### The experience in one line
Claims Insight is a calm, professional investigation workbench for insurance claims professionals. It feels less like a report and more like a focused, task-oriented tool — every screen answers a real question the moment it loads.

### What it should feel like
- **Trustworthy and enterprise-grade** — clean, confident, and quiet. Nothing flashy.
- **Insight-first** — the answer is always above the fold; supporting detail comes second.
- **Effortless to navigate** — one click moves from any claim, customer, or adjuster to their full picture.

### What it should *not* feel like
- Not a busy, generic BI dashboard crowded with every chart at once.
- Not a data-entry or editing tool — it reads and presents, it never asks the user to fill in forms.
- Not playful or consumer-y — the tone is composed and professional throughout.

---

## 2. Who it's for (and how that shapes the feel)

The app is built for claims professionals — adjusters, claims managers, and risk analysts — who need to pull the full context of a claim, customer, or adjuster quickly and confidently. Because they live in this tool during the workday, the design favors **clarity, density, and speed of recognition** over decoration. Familiar insurance language ("Open Claims", "Total Claim Amount", "Region") is used everywhere so terms feel instantly recognizable.

---

## 3. Screens & layout

A persistent **left-hand navigation rail** plus a **global search bar** at the top frame the entire app. Content sits on a clean, card-based canvas.

1. **Book Overview** *(home / landing)*
   - **Top KPI strip** — a row of five large, confident metric tiles (claim count, total amount, open claim count, open rate, overall exposure). Each tile carries a small **trend sparkline** and a subtle ▲/▼ delta versus the prior period, so the headline numbers feel alive rather than static.
   - **Claims & amount over time** — a full-width **smooth area / line chart** with a soft gradient fill spanning the top of the canvas. A segmented control toggles between *claim volume* and *claim amount*; hovering reveals a formatted tooltip. This is the screen's signature "this is an analytics app" moment.
   - **Claim status mix** — a compact **donut chart** with status-colored slices (Open = amber, Under Review = blue, Closed = green) and the total claim count anchored in the center.
   - **Amount by region** — a clean **horizontal bar chart**, ranked descending, so the heaviest regions read top-down at a glance.
   - **Claims by type** — a small **vertical bar** or segmented bar (Collision, Comprehensive, Liability, …) sitting beside the region chart in a two-up row.
   - **Largest Open Claims** — a ranked **horizontal bar chart paired with a clean data grid, side by side**: the bars give instant visual ranking, the grid gives the detail. Every row clicks straight through to that claim.
   - **High-Frequency Filers** — a card with a bold count badge and a small **inline bar/lollipop list** of the top filers, drilling into the full list.

2. **Claim 360** *(single-claim deep dive)*
   - A clear header: the claim ID, a color-coded status badge, the claim amount, and the date.
   - Four context cards — **Customer**, **Vehicle**, **Policy**, and **Handling** (adjuster + repair shop) — each compact and scannable.
   - **Coverage utilization** — a prominent **radial gauge / progress arc** showing the claim amount as a share of the policy's coverage limit, with a clear **over-limit alert state** (arc turns red) when the claim exceeds coverage.
   - **Claim in context** — a small **micro-bar or bullet chart** placing this claim's amount against the average claim amount and the customer's typical claim, so an adjuster instantly sees whether it's large or routine.
   - **Notes** — a full-width card at the bottom of the page where investigators leave **shared, persistent notes** on the claim. A text box (placeholder *"Add a note about this claim…"*) sits above a **Save note** button, with a *"Posting as {your name}"* caption so authorship is clear before saving (⌘/Ctrl+Enter also saves). Saved notes appear newest-first below the composer, each with an **author avatar (initials), the author's name, a timestamp, and the note text**. Notes are visible to everyone in the workspace — the subtitle reads *"Shared notes on this claim — visible to everyone in the workspace."* This is the one place in the app where the user writes rather than reads; it uses the same calm card styling and the standard loading / empty (*"No notes yet — add the first one."*) / error states. See **Appendix A** for the implementation reference.

3. **Customer 360**
   - **Header KPIs** — metric tiles for total claims, distinct adjusters, distinct vehicles, and total exposure, each with a sparkline where a trend is meaningful.
   - **Coverage panel** — a **progress arc / horizontal gauge** comparing coverage limit to claim total, with a utilization percentage and a clear over/under indicator.
   - **Claim history over time** — a **timeline / dot-plot or small area chart** of this customer's claims, colored by status, giving a quick read of how often and how recently they file.
   - **Exposure by status** — a small **stacked bar or donut** splitting open vs. under-review exposure.
   - A claims-history **data grid** for the customer, each row clickable through to Claim 360.
   - A residence block with city, state, and address.

4. **Adjuster 360**
   - An adjuster profile: name, region, and experience.
   - **Workload visuals** — metric tiles for claim count and total amount handled, plus a **status-mix donut or segmented bar** (open / under review / closed) showing the shape of their book.
   - **Amount handled over time** — a compact **area/line sparkline-style chart** for a quick sense of load trend.
   - A searchable **roster grid** of all adjusters, with a small inline bar in the claim-count column so relative load reads at a glance.

5. **Global Search / Command bar** *(persistent, top of every screen)*
   - One input that accepts a claim ID, a customer name, or an adjuster name and routes to the right page.
   - Type-ahead suggestions grouped by entity (Claim / Customer / Adjuster).

---

## 4. Visual design system

### 4.1 Design principles
- **Calm, dense, trustworthy.** Generous whitespace, strong typographic hierarchy, no gratuitous color.
- **The answer comes first.** KPIs and the headline figure lead; detail supports.
- **Recognizable language.** Mirror the familiar insurance terms users already know.

### 4.2 Layout
- A fixed, collapsible left nav rail (~240px) and a top app bar with global search.
- A scrollable content canvas on a responsive 12-column grid.
- Content lives in **cards** with subtle 1px borders and soft shadows — light, clean, never heavy.

### 4.3 Typography
- Segoe UI (Fluent default) with a system sans fallback.
- Page titles 24–28px semibold; section headers 16–18px semibold; body 14px.
- Numeric KPIs are large (32–40px) using tabular-lining figures so numbers align cleanly.

### 4.4 Color palette *(professional, restrained)*
- **Surface:** white cards (`#FFFFFF`) on a soft canvas (`#F5F6F8`).
- **Brand accent:** deep indigo (`#2B3A67`) for headers, nav, and primary actions.
- **Status colors:** Open = amber (`#B7791F`); Under Review = blue (`#2563EB`); Closed = green (`#15803D`) — used as badge fills with accessible contrast.
- **Positive vs. alert:** under-limit = green; a claim exceeding coverage = red (`#B91C1C`).
- **Charts:** a restrained 6-color categorical ramp anchored on the indigo accent. Color is never the only signal — it's always paired with a label.

### 4.5 Components & states
- Fluent-style components throughout: data grids, cards, badges, personas, breadcrumbs, search box, tabs.
- Tables use sticky headers, right-aligned numbers, clean rows, and a clear hover affordance.
- **Loading:** skeleton shimmers while content loads — never a blank or jumping screen.
- **Empty:** friendly, plain-language empty states ("No open claims match").
- **Error:** a clear, calm error state with a retry ("Couldn't reach the claims model — retry").

### 4.6 Formatting
- Currency with thousands separators (`$1,234,567`); percentages to one decimal (`00.0%`); dates as `MMM D, YYYY`. Consistent everywhere.

### 4.7 Accessibility & responsiveness
- WCAG 2.1 AA: keyboard navigable, 4.5:1 text contrast, ARIA labels on KPIs and charts, visible focus rings.
- Desktop-first, graceful down to tablet width — KPI strips wrap, tables scroll horizontally.

---

## 5. Data visualization — modern & interactive

Insights are presented with **modern, animated, interactive visuals** — not static tables or flat numbers alone. Every screen that surfaces an insight pairs the headline figure with a polished, well-designed chart.

- **KPI / metric tiles** — large animated number cards with trend sparklines and subtle ▲/▼ delta indicators.
- **Largest open claims** — a ranked horizontal bar chart alongside a clean data grid.
- **Claim status mix** — a modern donut or segmented bar with status-colored slices and a center total.
- **Claims / amount over time** — a smooth area or line chart with gradient fill and hover tooltips.
- **Region & state distribution** — a horizontal bar or a clean map visual.
- **Coverage vs. claim amount** — a radial gauge or progress arc showing utilization, with an over-limit alert state.
- **Customer exposure & frequency** — a bubble/scatter or grouped bars pairing claim count and total amount.

**Interaction & polish:** hover tooltips with formatted values, click-to-drill from a chart element into a 360 page, animated transitions between states, rounded corners, soft gradients, tabular-lining numerals, and skeleton shimmer while data loads. Chart status colors always match the badge semantics (Open = amber, Under Review = blue, Closed = green). Meaning is never carried by color alone — visuals include labels and screen-reader-friendly descriptions.

---

## 6. Signature interactions

- Click any **claim ID** anywhere → Claim 360.
- Click any **customer name** → Customer 360.
- Click any **adjuster name** → Adjuster 360.
- A **breadcrumb trail** lets investigators retrace their path (Book Overview › Customer 360 › Claim 6915).
- **Status badges double as filter chips** on list screens — toggle Open / Under Review / Closed to focus the view.
- On **Claim 360**, anyone in the workspace can **add a note** to the claim; saved notes are attributed to their author and persist for everyone who opens that claim.

---

*This document describes look and feel only. Architecture, data modeling, query logic, deployment, and security are intentionally out of scope — **with the single exception of Appendix A**, which captures the Claim Notes panel in enough detail to recreate it.*

---

## Appendix A — Claim Notes panel (implementation reference)

> Unlike the rest of this document, this appendix **does** include technical detail. The Notes panel is the only feature that **writes** data, so recreating it requires a real backend; this section records what that takes. Everything here is additive to the read-only Claims Insight app — it does not change any existing screen except adding the Notes card to **Claim 360**.

### A.1 What it is
A card on the **Claim 360** page that lets any signed-in user add free-text notes to a specific claim and read everyone else's notes. Notes are **shared** (server-side, not per-browser) and **attributed** to the author, with a timestamp.

### A.2 Where the data lives
Notes persist in the **Rayfin-managed database** (Microsoft Data API Builder over MSSQL), accessed from the browser through the typed `RayfinClient` GraphQL data API. This is the app's standard data-write path — the read-only insights still come from the `autoclaims_sm` semantic model via DAX; **notes are entirely separate from the semantic model.**

### A.3 Backend — data model
1. **Enable the data service** in `rayfin/rayfin.yml` (it is off by default):
   ```yaml
   services:
     data:
       enabled: true
       dialect: mssql
   ```
2. **Define the entity** in `rayfin/data/claim-note.ts`:
   ```ts
   import { entity, authenticated, uuid, int, text, date } from "@microsoft/rayfin-core";

   @entity()
   @authenticated(["read", "create"])
   export class ClaimNote {
       @uuid() id!: string;
       @int() claim_id!: number;          // claims_fact[Claim_ID]
       @text({ max: 4000 }) body!: string;
       @text({ max: 256 }) author!: string;     // signed-in user's email (display)
       @text({ max: 128 }) author_id!: string;  // signed-in user's stable id
       @date() created_at!: Date;               // becomes DATETIME2
   }
   ```
   Notes on the decorators (these are the gotchas that cost real time):
   - `@authenticated` is **required** — **anonymous data access is blocked on Fabric**. Use the `authenticated` role only.
   - `@text` **must** set `max` for MSSQL (e.g. `max: 4000`); unbounded text breaks schema generation.
   - `@date` fields must be typed `Date` (not `string`) in the entity, even though the SDK returns them as ISO strings at read time.
3. **Register it** in `rayfin/data/schema.ts`:
   ```ts
   import { ClaimNote } from "./claim-note.js";   // .js suffix — nodenext resolution
   export { ClaimNote };
   export type AppSchema = { ClaimNote: ClaimNote };
   ```
4. **Add `rayfin/tsconfig.json`** so the CLI emits the entity to `.temp/compiled` (without this the schema silently never builds and `db apply` reports "no compiled data files"):
   ```jsonc
   {
     "extends": "../tsconfig.json",
     "compilerOptions": {
       "outDir": ".temp/compiled",
       "rootDir": ".",
       "declaration": true,
       "composite": true,
       "noEmit": false,
       "allowImportingTsExtensions": false,
       "module": "nodenext",
       "moduleResolution": "nodenext"
     },
     "include": ["**/*"],
     "exclude": [".temp/**/*"]
   }
   ```

### A.4 Frontend — files
- **`src/lib/claim-notes.ts`** — typed data access over `getRayfinClient()`:
  - `listClaimNotes(claimId)` → `select([...]).where({ claim_id: { eq } }).orderBy({ created_at: "desc" }).execute()`.
  - `addClaimNote({ claimId, body, author, authorId })` → `ClaimNote.create({ id: crypto.randomUUID(), ..., created_at: new Date().toISOString() })`.
- **`src/hooks/use-claim-notes.ts`** — loads notes for a claim, exposes `addNote(body)`, `isLoading/isSaving/error`, and `authorName`. **Author identity comes from the auth session** (`useAuth().session.user.email` and `.id`) — the user never types their name.
- **`src/components/claim/claim-notes-panel.tsx`** — the card: textarea + Save button (disabled when empty/saving, ⌘/Ctrl+Enter to save), "Posting as {email}" caption, and a newest-first list rendering avatar initials, author, timestamp, and body. Reuses the shared `Card` primitives and matches the app's loading/empty/error states.
- **`src/pages/claim-360.tsx`** — renders `<ClaimNotesPanel claimId={claimId} />` at the bottom of the page.

### A.5 Authentication & attribution
No new sign-in work is required. The app already establishes a **Fabric SSO session on boot** (`AuthProvider` → `initEmbeddedAuth`), and the same `RayfinClient` backs both auth and data, so the bearer token is attached to data calls automatically. The `authenticated` role on `ClaimNote` authorizes those calls, and the note's `author` / `author_id` are taken from the signed-in user's session — so every note is reliably attributed.

### A.6 Deploy
- `npx rayfin up` builds + deploys the static app **and** applies pending schema migrations (creates/updates the `ClaimNotes` table) in one step.
- `npx rayfin up db apply` applies the schema only (useful while iterating on the entity).
- After deploy, the `ClaimNotes` table exists with: `id UNIQUEIDENTIFIER` (PK), `claim_id INT`, `body NVARCHAR(4000)`, `author NVARCHAR(256)`, `author_id NVARCHAR(128)`, `created_at DATETIME2`.


