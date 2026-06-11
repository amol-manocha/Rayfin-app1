//-----------------------------------------------------------------------
// Claims over time — a smooth area chart with a volume/amount segmented
// toggle in the card header.
//-----------------------------------------------------------------------

import { useState } from "react";
import { ChartCard } from "@/components/chart-card";
import { claimsOverTime, type TrendMetric } from "@/queries/overview/claims-over-time";
import { cn } from "@/lib/utils";

const OPTIONS: { value: TrendMetric; label: string }[] = [
    { value: "volume", label: "Volume" },
    { value: "amount", label: "Amount" },
];

export function ClaimsOverTimeCard({ className }: { className?: string }) {
    const [metric, setMetric] = useState<TrendMetric>("volume");

    return (
        <ChartCard
            className={className}
            title="Claims over time"
            subtitle={metric === "amount" ? "Total claim amount by month" : "Claim volume by month"}
            chart={claimsOverTime({ metric })}
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
