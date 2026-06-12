//-----------------------------------------------------------------------
// Accident network — a radial node-link map placing the focal customer at
// the centre, surrounded by the other parties they've been in incidents
// with. Each counterparty node is colour-coded by insurance carrier
// (Nationwide vs. another carrier) so the carrier mix reads at a glance.
//
// NOTE: the claims semantic model has no counterparty or carrier data, so
// the connections below are deterministically *simulated* from the
// customer id (stable per customer) purely for demonstration. A disclaimer
// is rendered at the bottom of the card.
//-----------------------------------------------------------------------

import { ShieldCheck, Building2, User } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/card";

const FIRST_NAMES = [
    "Jordan", "Casey", "Riley", "Morgan", "Avery", "Quinn", "Devon",
    "Harper", "Reese", "Sawyer", "Emerson", "Rowan", "Parker", "Hayden",
];
const LAST_NAMES = [
    "Reyes", "Nguyen", "Patel", "Brooks", "Walsh", "Carter", "Diaz",
    "Foster", "Hughes", "Iverson", "Klein", "Marsh", "Okafor", "Sandoval",
];
const OTHER_CARRIERS = [
    "State Farm", "Geico", "Progressive", "Allstate", "Liberty Mutual", "Farmers",
];
const INCIDENT_TYPES = [
    "Rear-end collision", "Intersection", "Parking lot", "Side-swipe",
    "Multi-vehicle", "Lane change",
];

// --- deterministic seeded RNG (FNV-1a hash + mulberry32) ---------------
function hashSeed(input: string): number {
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

interface PartyNode {
    name: string;
    nationwide: boolean;
    incidents: number;
    type: string;
}

function buildNetwork(customerId: string): PartyNode[] {
    const rand = mulberry32(hashSeed(`net:${customerId}`));
    const count = 4 + Math.floor(rand() * 3); // 4–6 counterparties
    const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
    const seen = new Set<string>();
    const nodes: PartyNode[] = [];

    while (nodes.length < count) {
        const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
        if (seen.has(name)) continue;
        seen.add(name);
        nodes.push({
            name,
            nationwide: rand() < 0.45,
            incidents: 1 + Math.floor(rand() * 3),
            type: pick(INCIDENT_TYPES),
        });
    }
    return nodes;
}

const NATIONWIDE = "var(--color-status-review)"; // blue
const OTHER = "var(--color-status-open)"; // amber

function firstName(name: string): string {
    return name.split(" ")[0] ?? name;
}

export function AccidentNetworkCard({
    customerId,
    customerName,
    className,
}: {
    customerId: string;
    customerName: string;
    className?: string;
}) {
    const parties = buildNetwork(customerId);
    const nationwideCount = parties.filter((p) => p.nationwide).length;

    // --- radial geometry -------------------------------------------------
    const W = 460;
    const H = 380;
    const cx = W / 2;
    const cy = H / 2;
    const radius = 118;
    const centerR = 34;

    const placed = parties.map((p, i) => {
        const angle = -Math.PI / 2 + (i / parties.length) * Math.PI * 2;
        return {
            ...p,
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
            r: 22 + p.incidents * 2,
        };
    });

    const initials = (customerName || "?")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <Card className={className}>
            <CardHeader
                title="Accident network"
                subtitle="People this customer has been in incidents with"
                action={
                    <div className="flex flex-col items-end gap-xxs text-[length:var(--text-100)]">
                        <span className="inline-flex items-center gap-xs font-medium text-muted-foreground">
                            <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ background: NATIONWIDE }}
                            />
                            Nationwide
                        </span>
                        <span className="inline-flex items-center gap-xs font-medium text-muted-foreground">
                            <span
                                className="inline-block h-2.5 w-2.5 rounded-full"
                                style={{ background: OTHER }}
                            />
                            Other carrier
                        </span>
                    </div>
                }
            />
            <CardContent className="gap-s">
                <p className="text-[length:var(--text-200)] text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {nationwideCount}
                    </span>{" "}
                    of {parties.length} counterparties insured by Nationwide
                </p>

                <div className="flex min-h-0 flex-1 items-center justify-center">
                    <svg
                        viewBox={`0 0 ${W} ${H}`}
                        className="h-full max-h-[380px] w-full"
                        preserveAspectRatio="xMidYMid meet"
                        role="img"
                        aria-label={`Accident network for ${customerName}: ${parties.length} connected parties, ${nationwideCount} with Nationwide.`}
                    >
                        {/* edges */}
                        {placed.map((p) => (
                            <line
                                key={`edge-${p.name}`}
                                x1={cx}
                                y1={cy}
                                x2={p.x}
                                y2={p.y}
                                stroke="var(--color-border)"
                                strokeWidth={1 + p.incidents}
                                strokeLinecap="round"
                            />
                        ))}

                        {/* counterparty nodes */}
                        {placed.map((p) => {
                            const fill = p.nationwide ? NATIONWIDE : OTHER;
                            const labelBelow = p.y >= cy;
                            return (
                                <g key={`node-${p.name}`}>
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={p.r}
                                        fill={fill}
                                        stroke="var(--color-card)"
                                        strokeWidth={3}
                                    />
                                    <text
                                        x={p.x}
                                        y={p.y + 5}
                                        textAnchor="middle"
                                        fontSize={13}
                                        fontWeight={600}
                                        fill="#ffffff"
                                    >
                                        {p.incidents}×
                                    </text>
                                    <text
                                        x={p.x}
                                        y={labelBelow ? p.y + p.r + 16 : p.y - p.r - 8}
                                        textAnchor="middle"
                                        fontSize={12}
                                        fontWeight={600}
                                        fill="var(--color-foreground)"
                                    >
                                        {firstName(p.name)}
                                    </text>
                                    <text
                                        x={p.x}
                                        y={labelBelow ? p.y + p.r + 30 : p.y - p.r - 22}
                                        textAnchor="middle"
                                        fontSize={10}
                                        fill="var(--color-muted-foreground)"
                                    >
                                        {p.nationwide ? "Nationwide" : "Other carrier"}
                                    </text>
                                </g>
                            );
                        })}

                        {/* focal customer (centre) */}
                        <circle
                            cx={cx}
                            cy={cy}
                            r={centerR}
                            fill="var(--color-primary)"
                            stroke="var(--color-card)"
                            strokeWidth={4}
                        />
                        <text
                            x={cx}
                            y={cy + 6}
                            textAnchor="middle"
                            fontSize={16}
                            fontWeight={700}
                            fill="var(--color-primary-foreground)"
                        >
                            {initials}
                        </text>
                    </svg>
                </div>

                {/* legend chips for carrier meaning */}
                <div className="flex flex-wrap items-center justify-center gap-x-l gap-y-xs text-[length:var(--text-100)] text-muted-foreground">
                    <span className="inline-flex items-center gap-xs">
                        <ShieldCheck
                            className="icon-size-100"
                            style={{ color: NATIONWIDE }}
                            aria-hidden
                        />
                        Insured by Nationwide
                    </span>
                    <span className="inline-flex items-center gap-xs">
                        <Building2
                            className="icon-size-100"
                            style={{ color: OTHER }}
                            aria-hidden
                        />
                        Other carrier
                    </span>
                    <span className="inline-flex items-center gap-xs">
                        <User className="icon-size-100" aria-hidden />
                        This customer
                    </span>
                </div>

                <p className="mt-xs text-center text-[length:var(--text-100)] italic leading-100 text-muted-foreground">
                    Illustrative data — counterparty names and insurance carriers are
                    simulated for demonstration and are not sourced from the claims model.
                </p>
            </CardContent>
        </Card>
    );
}
