//-----------------------------------------------------------------------
// Customer 360 — the customer's relationship with the book: how many
// claims, how much exposure, how it trends, and the full claim history.
//-----------------------------------------------------------------------

import { User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/card";
import { PageHeader } from "@/components/detail";
import { KpiTile } from "@/components/kpi-tile";
import { CoverageGauge } from "@/components/coverage-gauge";
import { ChartCard } from "@/components/chart-card";
import { TrendCard } from "@/components/trend-card";
import { DataGridTable, type GridColumn } from "@/components/data-grid-table";
import { StatusBadge } from "@/components/status-badge";
import { ClaimLink, AdjusterLink } from "@/components/entity-link";
import { AccidentNetworkCard } from "@/components/customer/accident-network-card";
import { QueryState } from "@/components/states";
import { useRouter } from "@/lib/router";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { firstRowObject, tableToObjects, num, str } from "@/lib/rows";
import { customerProfile } from "@/queries/customer/customer-profile";
import { customerKpis } from "@/queries/customer/customer-kpis";
import { customerHistory } from "@/queries/customer/customer-history";
import { customerExposure } from "@/queries/customer/customer-exposure";
import { customerClaims } from "@/queries/customer/customer-claims";
import { formatCurrency, formatDate } from "@/lib/format";

function PolicyField({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex min-w-[110px] flex-col gap-xxs">
            <dt className="text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="text-[length:var(--text-300)] font-semibold text-foreground">
                {value || "—"}
            </dd>
        </div>
    );
}

export function Customer360Page({ customerId }: { customerId: string }) {
    const { navigate } = useRouter();
    const profile = useVisualQuery(customerProfile(customerId));
    const kpis = useVisualQuery(customerKpis(customerId));
    const claimsList = useVisualQuery(customerClaims(customerId));

    const person = firstRowObject(profile.dataTable);
    const k = firstRowObject(kpis.dataTable);
    const claimRows = tableToObjects(claimsList.dataTable);

    const columns: GridColumn[] = [
        {
            key: "Claim_ID",
            header: "Claim",
            render: (r) => <ClaimLink id={num(r.Claim_ID)} />,
        },
        { key: "Claim_Date", header: "Filed", render: (r) => formatDate(r.Claim_Date) },
        { key: "Claim_Type_Name", header: "Type" },
        {
            key: "Claim_Status",
            header: "Status",
            render: (r) => <StatusBadge status={str(r.Claim_Status)} soft />,
        },
        {
            key: "Adjuster_Name",
            header: "Adjuster",
            render: (r) => (
                <AdjusterLink id={num(r.Adjuster_ID)} name={str(r.Adjuster_Name)} />
            ),
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
                isLoading={profile.isLoading}
                isEmpty={profile.isEmpty}
                error={profile.error}
                onRetry={profile.refetch}
                emptyMessage="We couldn't find this customer."
            >
                {person ? (
                    <PageHeader
                        eyebrow="Customer 360"
                        title={str(person.Customer_Name)}
                    />
                ) : null}
            </QueryState>

            {person ? (
                <Card>
                    <div className="flex flex-wrap items-center gap-x-xl gap-y-m px-l py-m">
                        <div className="flex items-center gap-s">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground">
                                <User className="icon-size-200" aria-hidden />
                            </span>
                            <span className="text-[length:var(--text-300)] font-semibold text-foreground">
                                Policyholder
                            </span>
                        </div>
                        <div className="hidden h-8 w-px bg-border sm:block" />
                        <dl className="flex flex-1 flex-wrap items-center gap-x-xxxl gap-y-m">
                            <PolicyField label="Age" value={str(person.Customer_Age)} />
                            <PolicyField label="Gender" value={str(person.Gender)} />
                            <PolicyField
                                label="Residence"
                                value={`${str(person.City)}, ${str(person.State)}`}
                            />
                            <PolicyField label="Address" value={str(person.Address)} />
                        </dl>
                    </div>
                </Card>
            ) : null}

            <div className="grid grid-cols-1 items-stretch gap-l lg:grid-cols-2">
                {/* Left half — compact KPI grid + exposure gauge */}
                <div className="flex flex-col gap-l">
                    <div className="grid grid-cols-2 gap-m">
                        <KpiTile label="Total Claims" value={num(k?.ClaimCount)} format="number" compact isLoading={kpis.isLoading} />
                        <KpiTile label="Total Amount" value={num(k?.TotalAmount)} format="currencyCompact" compact isLoading={kpis.isLoading} />
                        <KpiTile label="Open Claims" value={num(k?.OpenCount)} format="number" compact isLoading={kpis.isLoading} />
                        <KpiTile label="Average Claim" value={num(k?.AvgAmount)} format="currencyCompact" compact isLoading={kpis.isLoading} />
                    </div>
                    <Card className="flex-1">
                        <CardHeader title="Active exposure" subtitle="Open exposure vs total coverage" />
                        <CardContent className="items-center justify-center">
                            <QueryState
                                isLoading={kpis.isLoading}
                                isEmpty={kpis.isEmpty}
                                error={kpis.error}
                                onRetry={kpis.refetch}
                            >
                                <CoverageGauge
                                    used={num(k?.Exposure)}
                                    limit={num(k?.CoverageLimit)}
                                />
                            </QueryState>
                        </CardContent>
                    </Card>
                </div>

                {/* Right half — accident network map */}
                <AccidentNetworkCard
                    className="h-full"
                    customerId={customerId}
                    customerName={str(person?.Customer_Name)}
                />
            </div>

            <div className="grid grid-cols-1 gap-l lg:grid-cols-2">
                <div className="h-[340px]">
                    <TrendCard
                        className="h-full"
                        title="Claim history"
                        subtitle="Claims filed over time"
                        initialMetric="amount"
                        makeChart={(metric) => customerHistory(customerId, metric)}
                    />
                </div>
                <div className="h-[340px]">
                    <ChartCard
                        className="h-full"
                        title="Amount by status"
                        subtitle="Where this customer's claim value sits"
                        chart={customerExposure(customerId)}
                    />
                </div>
            </div>

            <Card>
                <CardHeader title="Claim history" subtitle="Every claim on file for this customer" />
                <CardContent>
                    <QueryState
                        isLoading={claimsList.isLoading}
                        isEmpty={claimsList.isEmpty}
                        error={claimsList.error}
                        onRetry={claimsList.refetch}
                        skeleton={<div className="h-40 w-full animate-pulse rounded-xl bg-muted/60" />}
                    >
                        <div className="flex max-h-[420px] flex-col overflow-hidden">
                            <DataGridTable
                                rows={claimRows}
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
