//-----------------------------------------------------------------------
// High-frequency filers — a compact lollipop list ranking the customers
// with the most claims. Each name links to the Customer 360.
//-----------------------------------------------------------------------

import { Card, CardHeader, CardContent } from "@/components/card";
import { QueryState } from "@/components/states";
import { CustomerLink } from "@/components/entity-link";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { tableToObjects, num, str } from "@/lib/rows";
import { highFrequencyFilers } from "@/queries/overview/high-frequency-filers";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export function HighFrequencyFilersCard({ className }: { className?: string }) {
    const chart = highFrequencyFilers();
    const { dataTable, isLoading, isEmpty, error, refetch } = useVisualQuery(chart);
    const rows = tableToObjects(dataTable);
    const max = rows.reduce((m, r) => Math.max(m, num(r.ClaimCount)), 0) || 1;

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader
                title="High-frequency filers"
                subtitle="Customers with the most claims on file"
            />
            <CardContent>
                <QueryState
                    isLoading={isLoading}
                    isEmpty={isEmpty}
                    error={error}
                    onRetry={refetch}
                >
                    <ul className="flex min-h-0 flex-1 flex-col gap-m">
                        {rows.map((r) => {
                            const count = num(r.ClaimCount);
                            const pct = Math.max(6, (count / max) * 100);
                            return (
                                <li
                                    key={str(r.Customer_ID)}
                                    className="flex flex-col gap-xs"
                                >
                                    <div className="flex items-baseline justify-between gap-s">
                                        <CustomerLink
                                            id={str(r.Customer_ID)}
                                            name={str(r.Customer_Name)}
                                            className="text-[length:var(--text-300)]"
                                        />
                                        <span className="tabular shrink-0 text-[length:var(--text-200)] text-muted-foreground">
                                            {formatCurrency(num(r.TotalAmount))}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-s">
                                        <div className="h-(--spacing-s) min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-brand"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="tabular w-8 shrink-0 text-right text-[length:var(--text-300)] font-semibold text-foreground">
                                            {count}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </QueryState>
            </CardContent>
        </Card>
    );
}
