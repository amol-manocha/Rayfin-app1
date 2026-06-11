//-----------------------------------------------------------------------
// Status mix donut with a total claims count overlaid in the center hole —
// Vega can't easily render a centered total, so we layer it with HTML.
//-----------------------------------------------------------------------

import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";
import { Card, CardHeader, CardContent } from "@/components/card";
import { QueryState } from "@/components/states";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { tableToObjects, num, str } from "@/lib/rows";
import { statusMix } from "@/queries/overview/status-mix";
import { CLAIM_STATUSES, STATUS_DOT_CLASS, type ClaimStatus } from "@/lib/status";
import { formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function StatusDonutCard({ className }: { className?: string }) {
    const theme = useCssTheme();
    const chart = statusMix();
    const { dataTable, isLoading, isEmpty, error, refetch } = useVisualQuery(chart);

    const rows = tableToObjects(dataTable);
    const total = rows.reduce((sum, r) => sum + num(r.ClaimCount), 0);
    const byStatus = new Map<string, number>(
        rows.map((r) => [str(r.Claim_Status), num(r.ClaimCount)]),
    );

    return (
        <Card className={cn("h-full", className)}>
            <CardHeader
                title="Claims by status"
                subtitle="Distribution across the active book"
            />
            <CardContent>
                <QueryState
                    isLoading={isLoading}
                    isEmpty={isEmpty}
                    error={error}
                    onRetry={refetch}
                >
                    <div className="flex min-h-0 flex-1 flex-col items-center gap-l sm:flex-row">
                        <div className="relative aspect-square w-full max-w-[200px] shrink-0">
                            {dataTable ? (
                                <VegaVisual
                                    spec={chart.vegaLiteSpec}
                                    data={dataTable}
                                    theme={theme}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            ) : null}
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="tabular text-[length:var(--text-hero-700)] font-semibold leading-hero-700 text-foreground">
                                    {formatNumber(total)}
                                </span>
                                <span className="text-[length:var(--text-100)] uppercase tracking-wide text-muted-foreground">
                                    claims
                                </span>
                            </div>
                        </div>

                        <ul className="flex w-full min-w-0 flex-1 flex-col gap-xs">
                            {CLAIM_STATUSES.map((status) => {
                                const value = byStatus.get(status) ?? 0;
                                const share = total > 0 ? value / total : 0;
                                return (
                                    <li
                                        key={status}
                                        className="flex items-center gap-s rounded-lg px-s py-xs"
                                    >
                                        <span
                                            aria-hidden
                                            className={cn(
                                                "size-(--spacing-s) shrink-0 rounded-full",
                                                STATUS_DOT_CLASS[status as ClaimStatus],
                                            )}
                                        />
                                        <span className="min-w-0 flex-1 truncate text-[length:var(--text-300)] font-medium text-foreground">
                                            {status}
                                        </span>
                                        <span className="tabular text-[length:var(--text-300)] font-semibold text-foreground">
                                            {formatNumber(value)}
                                        </span>
                                        <span className="tabular w-12 text-right text-[length:var(--text-200)] text-muted-foreground">
                                            {formatPercent(share)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </QueryState>
            </CardContent>
        </Card>
    );
}
