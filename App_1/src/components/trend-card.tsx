//-----------------------------------------------------------------------
// A reusable time-series card with a volume/amount segmented toggle. Used
// by the customer and adjuster 360 pages.
//-----------------------------------------------------------------------

import { useState, type ReactNode } from "react";
import { ChartCard, type ChartSpec } from "@/components/chart-card";
import { cn } from "@/lib/utils";

export type TrendMetric = "volume" | "amount";

const OPTIONS: { value: TrendMetric; label: string }[] = [
    { value: "volume", label: "Volume" },
    { value: "amount", label: "Amount" },
];

export function TrendCard({
    title,
    subtitle,
    makeChart,
    initialMetric = "volume",
    className,
}: {
    title: ReactNode;
    subtitle?: ReactNode;
    makeChart: (metric: TrendMetric) => ChartSpec;
    initialMetric?: TrendMetric;
    className?: string;
}) {
    const [metric, setMetric] = useState<TrendMetric>(initialMetric);

    return (
        <ChartCard
            className={className}
            title={title}
            subtitle={subtitle}
            chart={makeChart(metric)}
            action={
                <div
                    role="tablist"
                    aria-label="Trend metric"
                    className="inline-flex rounded-full border border-border bg-muted p-xxs"
                >
                    {OPTIONS.map((opt) => {
                        const active = metric === opt.value;
                        return (
                            <button
                                key={opt.value}
                                role="tab"
                                aria-selected={active}
                                type="button"
                                onClick={() => setMetric(opt.value)}
                                className={cn(
                                    "rounded-full px-m py-xxs text-[length:var(--text-200)] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    active
                                        ? "bg-card text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            }
        />
    );
}
