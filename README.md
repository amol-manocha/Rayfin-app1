
# Claims Insight

**Investigate any auto-insurance claim, customer, policy, or adjuster in seconds.**

Claims Insight is a professional investigation workbench for insurance claims professionals — adjusters, claims managers, and risk analysts. It surfaces data from a Microsoft Fabric semantic model as an interactive, task-oriented web app. Every screen answers a real question the moment it loads.

![Platform](https://img.shields.io/badge/platform-Microsoft%20Fabric-blue)
![Framework](https://img.shields.io/badge/framework-React%2019%20%2B%20Vite-purple)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What it does

| Screen | Purpose |
|--------|---------|
| **Book Overview** | Home dashboard — KPI tiles with sparklines, claims-over-time area chart, status donut, regional bars, largest open claims, and high-frequency filers. |
| **Claim 360** | Deep dive into a single claim — status badge, amount, coverage gauge, customer/vehicle/policy/adjuster context cards, and shared investigator notes. |
| **Customer 360** | Full customer picture — claim history timeline, exposure breakdown, coverage utilization arc, and a clickable claims grid. |
| **Adjuster 360** | Adjuster workload — claim count, status mix, amount-over-time trend, and a filterable roster of all adjusters. |
| **Repair Shops** | Network performance — shop directory, specialty distribution, network-type donut, and trend sparklines. |
| **Global Search** | Persistent command bar to find any claim, customer, or adjuster by name or ID. |

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| UI framework | React 19, TypeScript, Tailwind CSS 4 |
| Build tool | Vite |
| Charts & visuals | `@microsoft/fabric-visuals` (area, bar, donut, sparkline, gauge) |
| Data grid | `@microsoft/fabric-datagrid` |
| Data layer | DAX queries via `@microsoft/fabric-app-data` against a Fabric semantic model |
| Write-back (notes) | Rayfin Data Service (GraphQL over MSSQL via Data API Builder) |
| Auth | Microsoft Fabric authentication (`@microsoft/rayfin-auth-provider-fabric`) |
| Hosting | Microsoft Fabric Apps |

---

## Project structure

```
App_1/
├── src/
│   ├── pages/            # Top-level page components (book-overview, claim-360, etc.)
│   ├── components/       # Reusable UI: cards, KPI tiles, charts, shell, search
│   ├── queries/          # DAX query definitions organized by page
│   ├── hooks/            # React hooks (auth, theme, semantic model queries, notes)
│   ├── lib/              # Utilities — router, formatting, DAX helpers, Rayfin client
│   └── services/         # Auth service integration
├── rayfin/
│   ├── rayfin.yml        # Rayfin config (data service enabled)
│   └── data/             # Entity definitions for the notes backend
├── fabric.yaml           # Fabric semantic model connection config
├── vite.config.ts        # Vite build config
└── package.json
```

---

## Getting started

### Prerequisites

- **Node.js v22+** — [download](https://nodejs.org/)
- **Azure CLI** — [install](https://learn.microsoft.com/cli/azure/install-azure-cli), then run `az login`
- Access to a **Microsoft Fabric workspace** with the `autoclaims_sm` semantic model

### Install & run locally

```bash
git clone https://github.com/amol-manocha/Rayfin-app1.git
cd Rayfin-app1/App_1
npm install
npm run dev
```

The app starts at `http://localhost:5173`.

### Preview inside Fabric

1. Open the app artifact in the Fabric portal.
2. Append `&devUri=http://localhost:5173` to the URL to connect your local dev server to the Fabric shell.

### Build for production

```bash
npm run build
```

### Deploy to Fabric

```bash
npx rayfin up
```

---

## Key features

- **Animated KPI tiles** with trend sparklines and period-over-period deltas
- **Interactive charts** — hover tooltips, click-to-drill from any visual into 360 pages
- **Coverage utilization gauge** — radial arc with over-limit alert state (turns red)
- **Shared claim notes** — investigators can add persistent, attributed notes to any claim
- **Light & dark mode** — toggle in the top bar
- **Breadcrumb navigation** — retrace your path (Book Overview › Customer 360 › Claim 6915)
- **Status badges as filters** — toggle Open / Under Review / Closed

---

## Semantic model

The app reads from the **`autoclaims_sm`** semantic model in Fabric. Key tables and measures:

| Table | Key columns |
|-------|-------------|
| Claims | Claim_ID, Claim Date, Claim Amount, Claim Status, Claim Type |
| Customer | Customer_ID, Name, City, State |
| Policy | Policy_ID, Coverage Limit |
| Adjuster | Adjuster_ID, Name, Region, Experience |
| Repair Shop | Shop Name, Network Type, Specialty, City, State |

**Measures:** `[Claim Count]`, `[Total Claim Amount]`, `[Open Claim Count]`, `[Average Claim Amount]`

The connection is configured in `fabric.yaml` — update the `workspaceId` and `itemId` to point to your own semantic model.

---

## Claim Notes (write-back)

The only write feature. Notes are stored server-side via Rayfin's Data Service (MSSQL-backed GraphQL). To enable:

1. Ensure `services.data.enabled: true` in `rayfin/rayfin.yml`
2. The entity is defined in `rayfin/data/claim-note.ts`
3. Run `npx rayfin db apply` to provision the table
4. Notes are attributed to the signed-in Fabric user automatically

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start local dev server (Vite, hot reload) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:fabric` | Open the app in the Fabric portal shell |

---

## License

MIT