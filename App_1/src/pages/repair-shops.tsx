//-----------------------------------------------------------------------
// Repair Shops — network and specialty insights for the repair-shop
// footprint that supports the claims book.
//-----------------------------------------------------------------------

import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/card";
import { PageHeader } from "@/components/detail";
import { KpiTile } from "@/components/kpi-tile";
import { ChartCard } from "@/components/chart-card";
import { DataGridTable, type GridColumn } from "@/components/data-grid-table";
import { QueryState } from "@/components/states";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { formatCurrency } from "@/lib/format";
import { firstRowObject, tableToObjects, num, str } from "@/lib/rows";
import { repairShopDirectory } from "@/queries/repair-shops/repair-shop-directory";
import { repairShopKpis } from "@/queries/repair-shops/repair-shop-kpis";
import { repairShopKpiTrend } from "@/queries/repair-shops/repair-shop-trend";
import { repairShopNetworkMix } from "@/queries/repair-shops/repair-shop-network-mix";
import { repairShopSpecialtyMix } from "@/queries/repair-shops/repair-shop-specialty-mix";

function deltaOf(series: number[]): number | undefined {
    if (series.length < 2) return undefined;
    const prev = series[series.length - 2];
    const last = series[series.length - 1];
    if (!Number.isFinite(prev) || prev === 0) return undefined;
    return (last - prev) / prev;
}

// Shared network-type color map so the composition bar and the table
// swatches stay in lockstep.
const NETWORK_COLORS: Record<string, string> = {
    Independent: "#4c78a8",
    Partner: "#f58518",
    Preferred: "#e45756",
};

function NetworkMixCard() {
    const chart = repairShopNetworkMix();
    const { dataTable, isLoading, isEmpty, error, refetch } = useVisualQuery(chart);
    const rows = tableToObjects(dataTable)
        .slice()
        .sort((a, b) => num(b.ClaimCount) - num(a.ClaimCount));

    const totalClaims = rows.reduce((sum, r) => sum + num(r.ClaimCount), 0);

    return (
        <Card className="h-full overflow-hidden">
            <CardHeader
                title="Network mix"
                subtitle="Open claims by network type, ranked by volume"
            />
            <CardContent className="overflow-hidden">
                <QueryState
                    isLoading={isLoading}
                    isEmpty={isEmpty}
                    error={error}
                    onRetry={refetch}
                >
                    <div className="flex min-h-0 flex-1 flex-col gap-m">
                        {/* 100% stacked composition bar — the at-a-glance part-to-whole story. */}
                        <div>
                            <span className="mb-xs block text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                                Share of open claims
                            </span>
                            <div className="flex h-7 w-full overflow-hidden rounded-lg">
                                {rows.map((row) => {
                                    const share = totalClaims ? num(row.ClaimCount) / totalClaims : 0;
                                    const color = NETWORK_COLORS[str(row.Network_Type)] ?? "var(--color-muted-foreground)";
                                    return (
                                        <div
                                            key={str(row.Network_Type)}
                                            className="flex items-center justify-center"
                                            style={{ width: `${share * 100}%`, background: color }}
                                            title={`${str(row.Network_Type)} — ${(share * 100).toFixed(0)}%`}
                                        >
                                            {share >= 0.12 ? (
                                                <span className="text-[length:var(--text-100)] font-semibold text-white">
                                                    {(share * 100).toFixed(0)}%
                                                </span>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Detailed companion table. */}
                        <div className="min-h-0 flex-1 overflow-auto">
                            <table className="w-full border-collapse text-[length:var(--text-200)]">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-xs py-s text-left text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                                            Network type
                                        </th>
                                        <th className="px-xs py-s text-right text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                                            Claims
                                        </th>
                                        <th className="px-xs py-s text-right text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                                            % of open
                                        </th>
                                        <th className="px-xs py-s text-right text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                                            Exposure
                                        </th>
                                        <th className="px-xs py-s text-right text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                                            Avg days
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row) => {
                                        const count = num(row.ClaimCount);
                                        const share = totalClaims ? count / totalClaims : 0;
                                        return (
                                            <tr key={str(row.Network_Type)} className="border-b border-border/60 last:border-0">
                                                <td className="px-xs py-s font-medium text-foreground">
                                                    <span className="flex items-center gap-s">
                                                        <span
                                                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                                                            style={{ background: NETWORK_COLORS[str(row.Network_Type)] ?? "var(--color-muted-foreground)" }}
                                                            aria-hidden
                                                        />
                                                        {str(row.Network_Type)}
                                                    </span>
                                                </td>
                                                <td className="px-xs py-s text-right tabular text-foreground">
                                                    {count.toLocaleString("en-US")}
                                                </td>
                                                <td className="px-xs py-s text-right tabular text-muted-foreground">
                                                    {(share * 100).toFixed(0)}%
                                                </td>
                                                <td className="px-xs py-s text-right tabular text-foreground">
                                                    {formatCurrency(num(row.TotalAmount))}
                                                </td>
                                                <td className="px-xs py-s text-right tabular text-foreground">
                                                    {num(row.AvgRepairDays).toFixed(1)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </QueryState>
            </CardContent>
        </Card>
    );
}

export function RepairShopsPage() {
    const kpis = useVisualQuery(repairShopKpis());
    const trend = useVisualQuery(repairShopKpiTrend());
    const directory = useVisualQuery(repairShopDirectory());

    const head = firstRowObject(kpis.dataTable);
    const rows = tableToObjects(directory.dataTable);
    const series = tableToObjects(trend.dataTable);
    const kpisLoading = kpis.isLoading || trend.isLoading;

    const shopCounts = series.map((r) => num(r.ShopCount));
    const claimCounts = series.map((r) => num(r.ClaimCount));
    const amounts = series.map((r) => num(r.TotalAmount));
    const repairDays = series.map((r) => num(r.AvgRepairDays));
    const noShopCounts = series.map((r) => num(r.NoShopCount));

    const maxRepairDays = Math.max(1, ...rows.map((r) => num(r.AvgRepairDays)));

    const columns: GridColumn[] = [
        { key: "Shop_Name", header: "Repair shop", sortable: true },
        { key: "Network_Type", header: "Network", sortable: true },
        { key: "Specialty", header: "Specialty", sortable: true },
        { key: "City", header: "City", sortable: true },
        { key: "State", header: "State", sortable: true },
        {
            key: "ClaimCount",
            header: "Claims",
            align: "right",
            tabular: true,
            sortable: true,
            sortAccessor: (r) => num(r.ClaimCount),
            render: (r) => num(r.ClaimCount).toLocaleString("en-US"),
        },
        {
            key: "TotalAmount",
            header: "Claim amount",
            align: "right",
            tabular: true,
            sortable: true,
            sortAccessor: (r) => num(r.TotalAmount),
            render: (r) => formatCurrency(num(r.TotalAmount)),
        },
        {
            key: "AvgRepairDays",
            header: "Avg repair days",
            align: "right",
            tabular: true,
            sortable: true,
            sortAccessor: (r) => num(r.AvgRepairDays),
            render: (r) => {
                const value = num(r.AvgRepairDays);
                const pct = Math.max(4, (value / maxRepairDays) * 100);
                return (
                    <div className="flex items-center justify-end gap-s">
                        <span className="w-[72px] overflow-hidden rounded-full bg-muted/60">
                            <span
                                className="block h-1.5 rounded-full bg-brand-foreground/70"
                                style={{ width: `${pct}%` }}
                            />
                        </span>
                        <span className="w-10 text-right tabular-nums">{value.toFixed(1)}</span>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="flex flex-col gap-l">
            <PageHeader
                eyebrow="Repair Shops"
                title="Repair shop insights"
                actions={
                    <div className="flex items-center gap-s rounded-xl border border-border bg-card px-m py-s text-muted-foreground">
                        <Building2 className="icon-size-200" aria-hidden />
                        <span className="text-[length:var(--text-200)]">Network and specialty coverage</span>
                    </div>
                }
            />

            <div className="grid grid-cols-1 gap-l sm:grid-cols-2 xl:grid-cols-5">
                <KpiTile label="Repair shops" value={num(head?.ShopCount)} format="number" spark={shopCounts} delta={deltaOf(shopCounts)} isLoading={kpisLoading} />
                <KpiTile label="Claims tied to shops" value={num(head?.ClaimCount)} format="number" spark={claimCounts} delta={deltaOf(claimCounts)} isLoading={kpisLoading} />
                <KpiTile label="Total claim amount" value={num(head?.TotalAmount)} format="currencyCompact" spark={amounts} delta={deltaOf(amounts)} isLoading={kpisLoading} />
                <KpiTile label="Avg repair days" value={num(head?.AvgRepairDays)} format="decimal1" spark={repairDays} delta={deltaOf(repairDays)} higherIsBetter={false} isLoading={kpisLoading} />
                <KpiTile label="Claims w/o repair shop" value={num(head?.ClaimsNoShop)} format="number" spark={noShopCounts} delta={deltaOf(noShopCounts)} higherIsBetter={false} isLoading={kpisLoading} />
            </div>

            <div className="grid grid-cols-1 gap-l lg:grid-cols-2">
                <div className="h-[340px]">
                    <NetworkMixCard />
                </div>
                <div className="h-[340px]">
                    <ChartCard
                        className="h-full"
                        title="Specialty mix"
                        subtitle="Which repair specialties are handling the most claims"
                        chart={repairShopSpecialtyMix()}
                    />
                </div>
            </div>

            <Card>
                <CardHeader
                    title="Repair shop directory"
                    subtitle="Top shops by claims and exposure, with network and specialty context"
                />
                <CardContent>
                    <QueryState
                        isLoading={directory.isLoading}
                        isEmpty={directory.isEmpty}
                        error={directory.error}
                        onRetry={directory.refetch}
                        skeleton={<div className="h-64 w-full animate-pulse rounded-xl bg-muted/60" />}
                    >
                        <div className="flex max-h-[520px] flex-col overflow-hidden">
                            <DataGridTable
                                rows={rows}
                                columns={columns}
                                getRowKey={(r) => str(r.Shop_Name)}
                            />
                        </div>
                    </QueryState>
                </CardContent>
            </Card>
        </div>
    );
}
