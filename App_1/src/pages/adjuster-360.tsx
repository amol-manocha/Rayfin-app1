//-----------------------------------------------------------------------
// Adjuster 360 — doubles as a directory when no adjuster is selected, and
// a workload profile when one is. Shows status mix, trend, and the roster
// of claims an adjuster is responsible for.
//-----------------------------------------------------------------------

import { Card, CardContent, CardHeader } from "@/components/card";
import { PageHeader } from "@/components/detail";
import { KpiTile } from "@/components/kpi-tile";
import { ChartCard } from "@/components/chart-card";
import { TrendCard } from "@/components/trend-card";
import { DataGridTable, type GridColumn } from "@/components/data-grid-table";
import { StatusBadge } from "@/components/status-badge";
import { ClaimLink, AdjusterLink, CustomerLink } from "@/components/entity-link";
import { QueryState } from "@/components/states";
import { useRouter } from "@/lib/router";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { firstRowObject, tableToObjects, num, str } from "@/lib/rows";
import { adjustersDirectory } from "@/queries/search/adjusters-directory";
import { adjusterDetail } from "@/queries/adjuster/adjuster-detail";
import { adjusterStatusMix } from "@/queries/adjuster/adjuster-status-mix";
import { adjusterOverTime } from "@/queries/adjuster/adjuster-over-time";
import { adjusterClaims } from "@/queries/adjuster/adjuster-claims";
import { formatCurrency, formatDate } from "@/lib/format";

export function Adjuster360Page({ adjusterId }: { adjusterId?: number }) {
    if (adjusterId == null) return <AdjusterDirectory />;
    return <AdjusterProfile adjusterId={adjusterId} />;
}

function AdjusterDirectory() {
    const { navigate } = useRouter();
    const dir = useVisualQuery(adjustersDirectory());
    const rows = tableToObjects(dir.dataTable);

    const columns: GridColumn[] = [
        {
            key: "Adjuster_Name",
            header: "Adjuster",
            sortable: true,
            render: (r) => (
                <AdjusterLink id={num(r.Adjuster_ID)} name={str(r.Adjuster_Name)} />
            ),
        },
        { key: "Region", header: "Region", sortable: true },
        {
            key: "Experience_Years",
            header: "Experience",
            align: "right",
            tabular: true,
            sortable: true,
            sortAccessor: (r) => num(r.Experience_Years),
            render: (r) => `${num(r.Experience_Years)} yrs`,
        },
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
            key: "OpenAmount",
            header: "Open Claim Amount",
            align: "right",
            tabular: true,
            sortable: true,
            sortAccessor: (r) => num(r.OpenAmount),
            render: (r) => formatCurrency(num(r.OpenAmount)),
        },
    ];

    return (
        <div className="flex flex-col gap-l">
            <PageHeader
                eyebrow="Adjuster Directory"
                title="Adjusters"
            />
            <Card>
                <CardHeader title="All adjusters" subtitle="Select an adjuster to see their workload" />
                <CardContent>
                    <QueryState
                        isLoading={dir.isLoading}
                        isEmpty={dir.isEmpty}
                        error={dir.error}
                        onRetry={dir.refetch}
                        skeleton={<div className="h-64 w-full animate-pulse rounded-xl bg-muted/60" />}
                    >
                        <div className="flex max-h-[600px] flex-col overflow-hidden">
                            <DataGridTable
                                rows={rows}
                                columns={columns}
                                getRowKey={(r) => str(r.Adjuster_ID)}
                                onRowClick={(r) =>
                                    navigate({
                                        name: "adjuster",
                                        id: num(r.Adjuster_ID),
                                        label: str(r.Adjuster_Name),
                                    })
                                }
                            />
                        </div>
                    </QueryState>
                </CardContent>
            </Card>
        </div>
    );
}

function AdjusterProfile({ adjusterId }: { adjusterId: number }) {
    const { navigate } = useRouter();
    const detail = useVisualQuery(adjusterDetail(adjusterId));
    const roster = useVisualQuery(adjusterClaims(adjusterId));

    const a = firstRowObject(detail.dataTable);
    const rosterRows = tableToObjects(roster.dataTable);

    const columns: GridColumn[] = [
        {
            key: "Claim_ID",
            header: "Claim",
            render: (r) => <ClaimLink id={num(r.Claim_ID)} />,
        },
        { key: "Claim_Date", header: "Filed", render: (r) => formatDate(r.Claim_Date) },
        {
            key: "Customer_Name",
            header: "Customer",
            render: (r) => (
                <CustomerLink id={str(r.Customer_ID)} name={str(r.Customer_Name)} />
            ),
        },
        { key: "Claim_Type_Name", header: "Type" },
        {
            key: "Claim_Status",
            header: "Status",
            render: (r) => <StatusBadge status={str(r.Claim_Status)} soft />,
        },
        {
            key: "Amount",
            header: "Amount",
            align: "right",
            tabular: true,
            render: (r) => formatCurrency(num(r.Amount)),
        },
    ];

    return (
        <div className="flex flex-col gap-l">
            <QueryState
                isLoading={detail.isLoading}
                isEmpty={detail.isEmpty}
                error={detail.error}
                onRetry={detail.refetch}
                emptyMessage="We couldn't find this adjuster."
            >
                {a ? (
                    <PageHeader
                        eyebrow="Adjuster 360"
                        title={str(a.Adjuster_Name)}
                        actions={
                            <div className="text-right">
                                <p className="text-[length:var(--text-100)] uppercase tracking-wide text-muted-foreground">
                                    {str(a.Region)} region
                                </p>
                                <p className="text-[length:var(--text-300)] font-medium text-foreground">
                                    {num(a.Experience)} yrs experience
                                </p>
                            </div>
                        }
                    />
                ) : null}
            </QueryState>

            <div className="grid grid-cols-1 gap-l sm:grid-cols-2 xl:grid-cols-4">
                <KpiTile label="Claims Handled" value={num(a?.ClaimCount)} format="number" isLoading={detail.isLoading} />
                <KpiTile label="Total Amount" value={num(a?.TotalAmount)} format="currencyCompact" isLoading={detail.isLoading} />
                <KpiTile label="Open Claims" value={num(a?.OpenCount)} format="number" isLoading={detail.isLoading} />
                <KpiTile label="Average Claim" value={num(a?.AvgAmount)} format="currencyCompact" isLoading={detail.isLoading} />
            </div>

            <div className="grid grid-cols-1 gap-l lg:grid-cols-2">
                <div className="h-[340px]">
                    <ChartCard
                        className="h-full"
                        title="Caseload by status"
                        subtitle="Mix of claims this adjuster owns"
                        chart={adjusterStatusMix(adjusterId)}
                    />
                </div>
                <div className="h-[340px]">
                    <TrendCard
                        className="h-full"
                        title="Workload over time"
                        subtitle="Claims taken on by month"
                        initialMetric="volume"
                        makeChart={(metric) => adjusterOverTime(adjusterId, metric)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader title="Claim roster" subtitle="Every claim assigned to this adjuster" />
                <CardContent>
                    <QueryState
                        isLoading={roster.isLoading}
                        isEmpty={roster.isEmpty}
                        error={roster.error}
                        onRetry={roster.refetch}
                        skeleton={<div className="h-40 w-full animate-pulse rounded-xl bg-muted/60" />}
                    >
                        <div className="flex max-h-[480px] flex-col overflow-hidden">
                            <DataGridTable
                                rows={rosterRows}
                                columns={columns}
                                getRowKey={(r) => str(r.Claim_ID)}
                                onRowClick={(r) =>
                                    navigate({
                                        name: "claim",
                                        id: num(r.Claim_ID),
                                        label: `Claim ${num(r.Claim_ID)}`,
                                    })
                                }
                            />
                        </div>
                    </QueryState>
                </CardContent>
            </Card>
        </div>
    );
}
