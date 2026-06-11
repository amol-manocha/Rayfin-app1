//-----------------------------------------------------------------------
// Global search — a persistent type-ahead in the top bar. Lazily loads the
// claim / customer / adjuster directories on first focus, then filters them
// client-side and groups matches by entity type.
//-----------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Search, User, UserCog, X } from "lucide-react";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { useRouter, type Route } from "@/lib/router";
import { tableToObjects, num, str } from "@/lib/rows";
import { claimsDirectory } from "@/queries/search/claims-directory";
import { customersDirectory } from "@/queries/search/customers-directory";
import { adjustersDirectory } from "@/queries/search/adjusters-directory";
import { StatusBadge } from "@/components/status-badge";

interface Hit {
    key: string;
    route: Route;
    icon: typeof FileText;
    primary: string;
    secondary: string;
    badge?: string;
}

const GROUP_LIMIT = 5;

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full max-w-[420px]">
            <div className="flex items-center gap-s rounded-full border border-border bg-card px-m py-xs shadow-sm focus-within:ring-2 focus-within:ring-ring">
                <Search className="icon-size-200 shrink-0 text-muted-foreground" aria-hidden />
                <input
                    type="text"
                    value={query}
                    placeholder="Search claims, customers, adjusters…"
                    onFocus={() => setOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") setOpen(false);
                    }}
                    className="min-w-0 flex-1 bg-transparent text-[length:var(--text-300)] text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                {query ? (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => setQuery("")}
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                    >
                        <X className="icon-size-200" aria-hidden />
                    </button>
                ) : null}
            </div>

            {open ? (
                <SearchPanel query={query} onClose={() => setOpen(false)} />
            ) : null}
        </div>
    );
}

function SearchPanel({ query, onClose }: { query: string; onClose: () => void }) {
    const { navigate } = useRouter();
    const claims = useVisualQuery(claimsDirectory());
    const customers = useVisualQuery(customersDirectory());
    const adjusters = useVisualQuery(adjustersDirectory());

    const loading = claims.isLoading || customers.isLoading || adjusters.isLoading;
    const q = query.trim().toLowerCase();

    const hits = useMemo(() => {
        const claimRows = tableToObjects(claims.dataTable);
        const customerRows = tableToObjects(customers.dataTable);
        const adjusterRows = tableToObjects(adjusters.dataTable);

        const claimHits: Hit[] = claimRows
            .filter((r) => {
                if (!q) return false;
                return (
                    String(num(r.Claim_ID)).includes(q) ||
                    str(r.Customer_Name).toLowerCase().includes(q) ||
                    str(r.Claim_Type_Name).toLowerCase().includes(q)
                );
            })
            .slice(0, GROUP_LIMIT)
            .map((r) => ({
                key: `claim-${num(r.Claim_ID)}`,
                route: { name: "claim", id: num(r.Claim_ID), label: `Claim ${num(r.Claim_ID)}` } as Route,
                icon: FileText,
                primary: `Claim ${num(r.Claim_ID)}`,
                secondary: `${str(r.Customer_Name)} · ${str(r.Claim_Type_Name)}`,
                badge: str(r.Claim_Status),
            }));

        const customerHits: Hit[] = customerRows
            .filter((r) => q && str(r.Customer_Name).toLowerCase().includes(q))
            .slice(0, GROUP_LIMIT)
            .map((r) => ({
                key: `customer-${str(r.Customer_ID)}`,
                route: { name: "customer", id: str(r.Customer_ID), label: str(r.Customer_Name) } as Route,
                icon: User,
                primary: str(r.Customer_Name),
                secondary: `${str(r.City)}, ${str(r.State)} · ${num(r.ClaimCount)} claims`,
            }));

        const adjusterHits: Hit[] = adjusterRows
            .filter((r) => q && str(r.Adjuster_Name).toLowerCase().includes(q))
            .slice(0, GROUP_LIMIT)
            .map((r) => ({
                key: `adjuster-${num(r.Adjuster_ID)}`,
                route: { name: "adjuster", id: num(r.Adjuster_ID), label: str(r.Adjuster_Name) } as Route,
                icon: UserCog,
                primary: str(r.Adjuster_Name),
                secondary: `${str(r.Region)} · ${num(r.ClaimCount)} claims`,
            }));

        return { claimHits, customerHits, adjusterHits };
    }, [claims.dataTable, customers.dataTable, adjusters.dataTable, q]);

    const total =
        hits.claimHits.length + hits.customerHits.length + hits.adjusterHits.length;

    function select(route: Route) {
        navigate(route);
        onClose();
    }

    return (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg">
            <div className="max-h-[60vh] overflow-auto p-xs">
                {!q ? (
                    <p className="px-m py-l text-center text-[length:var(--text-200)] text-muted-foreground">
                        Start typing to find a claim, customer, or adjuster.
                    </p>
                ) : loading ? (
                    <p className="px-m py-l text-center text-[length:var(--text-200)] text-muted-foreground">
                        Searching…
                    </p>
                ) : total === 0 ? (
                    <p className="px-m py-l text-center text-[length:var(--text-200)] text-muted-foreground">
                        No matches for “{query}”.
                    </p>
                ) : (
                    <>
                        <HitGroup label="Claims" hits={hits.claimHits} onSelect={select} />
                        <HitGroup label="Customers" hits={hits.customerHits} onSelect={select} />
                        <HitGroup label="Adjusters" hits={hits.adjusterHits} onSelect={select} />
                    </>
                )}
            </div>
        </div>
    );
}

function HitGroup({
    label,
    hits,
    onSelect,
}: {
    label: string;
    hits: Hit[];
    onSelect: (route: Route) => void;
}) {
    if (hits.length === 0) return null;
    return (
        <div className="py-xs">
            <p className="px-m py-xxs text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <ul>
                {hits.map((hit) => {
                    const Icon = hit.icon;
                    return (
                        <li key={hit.key}>
                            <button
                                type="button"
                                onClick={() => onSelect(hit.route)}
                                className="flex w-full items-center gap-s rounded-lg px-m py-s text-left transition-colors hover:bg-hover focus-visible:bg-hover focus-visible:outline-none"
                            >
                                <Icon className="icon-size-200 shrink-0 text-brand-foreground" aria-hidden />
                                <span className="min-w-0 flex-1">
                                    <span className="block truncate text-[length:var(--text-300)] font-medium text-foreground">
                                        {hit.primary}
                                    </span>
                                    <span className="block truncate text-[length:var(--text-200)] text-muted-foreground">
                                        {hit.secondary}
                                    </span>
                                </span>
                                {hit.badge ? (
                                    <StatusBadge status={hit.badge} soft className="shrink-0" />
                                ) : null}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
