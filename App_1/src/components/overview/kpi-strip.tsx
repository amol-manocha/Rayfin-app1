//-----------------------------------------------------------------------
// The Book Overview KPI strip. Combines the single-row headline figures
// with the monthly trend series so each tile shows a sparkline and a
// period-over-period delta.
//-----------------------------------------------------------------------

import { KpiTile, type KpiFormat } from "@/components/kpi-tile";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { firstRowObject, tableToObjects, num } from "@/lib/rows";
import { overviewKpis } from "@/queries/overview/kpis";
import { overviewKpiTrend } from "@/queries/overview/kpi-trend";

interface TileDef {
    label: string;
    value: number;
    format: KpiFormat;
    spark: number[];
    delta?: number;
}

function deltaOf(series: number[]): number | undefined {
    if (series.length < 2) return undefined;
    const prev = series[series.length - 2];
    const last = series[series.length - 1];
    if (!Number.isFinite(prev) || prev === 0) return undefined;
    return (last - prev) / prev;
}

export function KpiStrip() {
    const kpis = useVisualQuery(overviewKpis());
    const trend = useVisualQuery(overviewKpiTrend());

    const isLoading = kpis.isLoading || trend.isLoading;
    const head = firstRowObject(kpis.dataTable);
    const series = tableToObjects(trend.dataTable);

    const claimCounts = series.map((r) => num(r.ClaimCount));
    const amounts = series.map((r) => num(r.TotalAmount));
    const openCounts = series.map((r) => num(r.OpenCount));
    const exposures = series.map((r) => num(r.Exposure));
    const openRates = series.map((r) =>
        num(r.ClaimCount) > 0 ? num(r.OpenCount) / num(r.ClaimCount) : 0,
    );

    const tiles: TileDef[] = [
        {
            label: "Total Claims",
            value: num(head?.ClaimCount),
            format: "number",
            spark: claimCounts,
            delta: deltaOf(claimCounts),
        },
        {
            label: "Total Claim Amount",
            value: num(head?.TotalClaimAmount),
            format: "currencyCompact",
            spark: amounts,
            delta: deltaOf(amounts),
        },
        {
            label: "Open Claims",
            value: num(head?.OpenClaimCount),
            format: "number",
            spark: openCounts,
            delta: deltaOf(openCounts),
        },
        {
            label: "Open Rate",
            value: num(head?.OpenClaimRate),
            format: "percent",
            spark: openRates,
            delta: deltaOf(openRates),
        },
        {
            label: "Active Exposure",
            value: num(head?.Exposure),
            format: "currencyCompact",
            spark: exposures,
            delta: deltaOf(exposures),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-l sm:grid-cols-2 xl:grid-cols-5">
            {tiles.map((tile) => (
                <KpiTile
                    key={tile.label}
                    label={tile.label}
                    value={tile.value}
                    format={tile.format}
                    spark={tile.spark}
                    delta={tile.delta}
                    higherIsBetter={false}
                    isLoading={isLoading}
                />
            ))}
        </div>
    );
}
