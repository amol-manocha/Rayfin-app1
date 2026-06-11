//-----------------------------------------------------------------------
// Book Overview — the home dashboard. Answers "how healthy is the book?"
// at a glance, then invites investigation through click-through visuals.
//-----------------------------------------------------------------------

import { ChartCard } from "@/components/chart-card";
import { KpiStrip } from "@/components/overview/kpi-strip";
import { ClaimsOverTimeCard } from "@/components/overview/claims-over-time-card";
import { StatusDonutCard } from "@/components/overview/status-donut-card";
import { LargestOpenClaimsCard } from "@/components/overview/largest-open-claims-card";
import { HighFrequencyFilersCard } from "@/components/overview/high-frequency-filers-card";
import { amountByRegion } from "@/queries/overview/amount-by-region";
import { claimsByType } from "@/queries/overview/claims-by-type";

export function BookOverviewPage() {
    return (
        <div className="flex flex-col gap-l">
            <header className="flex flex-col gap-xxs">
                <h1 className="text-[length:var(--text-600)] font-semibold leading-600 text-foreground">
                    Book Overview
                </h1>
                <p className="text-[length:var(--text-300)] text-muted-foreground">
                    The health of the claims book at a glance — trends, exposure, and where to look next.
                </p>
            </header>

            <KpiStrip />

            <div className="grid grid-cols-1 gap-l xl:grid-cols-3">
                <div className="h-[380px] xl:col-span-2">
                    <ClaimsOverTimeCard className="h-full" />
                </div>
                <div className="h-[380px]">
                    <StatusDonutCard className="h-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-l lg:grid-cols-3">
                <div className="h-[340px]">
                    <ChartCard
                        className="h-full"
                        title="Claim amount by region"
                        subtitle="Where exposure concentrates"
                        chart={amountByRegion()}
                    />
                </div>
                <div className="h-[340px]">
                    <ChartCard
                        className="h-full"
                        title="Claims by type"
                        subtitle="Volume across claim categories"
                        chart={claimsByType()}
                    />
                </div>
                <div className="h-[340px]">
                    <HighFrequencyFilersCard className="h-full" />
                </div>
            </div>

            <div className="min-h-[440px]">
                <LargestOpenClaimsCard className="h-full" />
            </div>
        </div>
    );
}
