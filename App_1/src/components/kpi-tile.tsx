//-----------------------------------------------------------------------
// KPI metric tile — large animated number, trend sparkline, and a subtle
// ▲/▼ delta versus the prior period. The "answer first" hero element.
//-----------------------------------------------------------------------

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "./card";
import { Sparkline } from "./sparkline";
import { Skeleton } from "./states";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

export type KpiFormat = "number" | "decimal1" | "currency" | "currencyCompact" | "percent";

function render(value: number, format: KpiFormat): string {
    switch (format) {
        case "decimal1":
            return value.toLocaleString("en-US", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            });
        case "currency":
            return value.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
            });
        case "currencyCompact": {
            const abs = Math.abs(value);
            if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
            if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
            return `$${value.toFixed(0)}`;
        }
        case "percent":
            return `${(value * 100).toFixed(1)}%`;
        case "number":
        default:
            return Math.round(value).toLocaleString("en-US");
    }
}

export interface KpiTileProps {
    label: string;
    value: number;
    format?: KpiFormat;
    /** Period-over-period change as a ratio (0.12 = +12%). */
    delta?: number;
    /** Higher is better? Drives the green/red coloring of the delta. */
    higherIsBetter?: boolean;
    spark?: number[];
    isLoading?: boolean;
    /** Denser tile with a smaller value — for half-width / multi-tile blocks. */
    compact?: boolean;
}

export function KpiTile({
    label,
    value,
    format = "number",
    delta,
    higherIsBetter = true,
    spark,
    isLoading = false,
    compact = false,
}: KpiTileProps) {
    const animated = useCountUp(value);

    if (isLoading) {
        return (
            <Card className={cn("gap-s", compact ? "p-m" : "p-l")}>
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className={cn("mt-s w-3/4", compact ? "h-6" : "h-8")} />
                {compact ? null : (
                    <Skeleton className="mt-m h-(--leading-hero-700) w-full" />
                )}
            </Card>
        );
    }

    const hasDelta = delta != null && Number.isFinite(delta) && delta !== 0;
    const positive = (delta ?? 0) >= 0;
    const good = positive === higherIsBetter;

    return (
        <Card className={cn("justify-between", compact ? "gap-xs p-m" : "gap-m p-l")}>
            <div className="flex items-start justify-between gap-s">
                <p
                    className={cn(
                        "font-medium uppercase tracking-wide text-muted-foreground",
                        compact
                            ? "text-[length:var(--text-100)]"
                            : "text-[length:var(--text-200)]",
                    )}
                >
                    {label}
                </p>
                {hasDelta ? (
                    <span
                        className={cn(
                            "inline-flex items-center gap-xxs rounded-full px-xs py-xxs text-[length:var(--text-100)] font-semibold",
                            good
                                ? "bg-status-closed-soft text-positive"
                                : "bg-destructive/10 text-alert",
                        )}
                    >
                        {positive ? (
                            <ArrowUpRight className="icon-size-100" aria-hidden />
                        ) : (
                            <ArrowDownRight className="icon-size-100" aria-hidden />
                        )}
                        {Math.abs(delta * 100).toFixed(1)}%
                    </span>
                ) : null}
            </div>

            <p
                className={cn(
                    "tabular font-semibold text-foreground",
                    compact
                        ? "text-[length:var(--text-600)] leading-600"
                        : "text-[length:var(--text-hero-800)] leading-hero-800",
                )}
                aria-label={`${label}: ${render(value, format)}`}
            >
                {render(animated, format)}
            </p>

            {spark && spark.length > 1 ? (
                <Sparkline values={spark} />
            ) : compact ? null : (
                <div className="h-(--leading-hero-700)" />
            )}
        </Card>
    );
}
