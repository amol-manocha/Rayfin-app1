//-----------------------------------------------------------------------
// A small comparison panel that places a single claim's amount against the
// average for its type, the book-wide average, and the largest claim of
// that type — so an investigator can instantly gauge whether it's unusual.
//-----------------------------------------------------------------------

import { QueryState } from "@/components/states";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { firstRowObject, num } from "@/lib/rows";
import { claimContext } from "@/queries/claim/claim-context";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Bar {
    label: string;
    value: number;
    accent: boolean;
}

export function ClaimContextBars({
    claimType,
    amount,
}: {
    claimType: string;
    amount: number;
}) {
    const { dataTable, isLoading, isEmpty, error, refetch } = useVisualQuery(
        claimContext(claimType),
    );
    const ctx = firstRowObject(dataTable);

    const bars: Bar[] = [
        { label: "This claim", value: amount, accent: true },
        { label: `${claimType} average`, value: num(ctx?.TypeAvg), accent: false },
        { label: "Book average", value: num(ctx?.OverallAvg), accent: false },
        { label: `Largest ${claimType}`, value: num(ctx?.TypeMax), accent: false },
    ];
    const max = Math.max(...bars.map((b) => b.value), 1);

    return (
        <QueryState
            isLoading={isLoading}
            isEmpty={isEmpty}
            error={error}
            onRetry={refetch}
            skeleton={<div className="h-full w-full animate-pulse rounded-xl bg-muted/60" />}
        >
            <ul className="flex flex-col gap-m">
                {bars.map((bar) => {
                    const pct = Math.max(3, (bar.value / max) * 100);
                    return (
                        <li key={bar.label} className="flex flex-col gap-xs">
                            <div className="flex items-baseline justify-between gap-s">
                                <span
                                    className={cn(
                                        "text-[length:var(--text-200)] font-medium",
                                        bar.accent ? "text-foreground" : "text-muted-foreground",
                                    )}
                                >
                                    {bar.label}
                                </span>
                                <span className="tabular text-[length:var(--text-300)] font-semibold text-foreground">
                                    {formatCurrency(bar.value)}
                                </span>
                            </div>
                            <div className="h-(--spacing-s) overflow-hidden rounded-full bg-muted">
                                <div
                                    className={cn(
                                        "h-full rounded-full",
                                        bar.accent ? "bg-primary" : "bg-brand/45",
                                    )}
                                    style={{ width: `${pct}%` }}
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </QueryState>
    );
}
