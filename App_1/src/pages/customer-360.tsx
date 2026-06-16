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
import { CommunicationsCard, type CustomerClaimRef } from "@/components/customer/communications-card";
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
import { cn } from "@/lib/utils";

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

function ExposureStat({
    label,
    value,
    tone = "foreground",
}: {
    label: string;
    value: string;
    tone?: "foreground" | "positive" | "alert" | "muted";
}) {
    const toneClass = {
        foreground: "text-foreground",
        positive: "text-positive",
        alert: "text-alert",
        muted: "text-muted-foreground",
    }[tone];
    return (
        <div className="flex flex-col gap-xxs">
            <dt className="text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className={cn("tabular text-[length:var(--text-500)] font-semibold leading-500", toneClass)}>
                {value}
            </dd>
        </div>
    );
}

/** Exposure gauge paired with the supporting figures so the radial never
 *  floats in empty space — gauge on the left, the dollar story on the right. */
function ExposurePanel({ used, limit }: { used: number; limit: number }) {
    const headroom = limit - used;
    const over = limit > 0 && used > limit;
    return (
        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-xl gap-y-l sm:flex-nowrap sm:justify-start">
            <CoverageGauge used={used} limit={limit} size={150} />
            <dl className="flex min-w-[150px] flex-1 flex-col gap-m sm:border-l sm:border-border sm:pl-xl">
                <ExposureStat label="Active exposure" value={formatCurrency(used)} />
                <ExposureStat label="Coverage limit" value={formatCurrency(limit)} tone="muted" />
                <ExposureStat
                    label={over ? "Over limit by" : "Remaining headroom"}
                    value={formatCurrency(Math.abs(headroom))}
                    tone={over ? "alert" : "positive"}
                />
            </dl>
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

    const communicationClaims: CustomerClaimRef[] = claimRows.map((r) => ({
        id: num(r.Claim_ID),
        type: str(r.Claim_Type_Name),
        status: str(r.Claim_Status),
    }));

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

            {/* Vital signs — headline KPIs */}
            <div className="grid grid-cols-2 gap-m sm:grid-cols-4">
                <KpiTile label="Total Claims" value={num(k?.ClaimCount)} format="number" compact isLoading={kpis.isLoading} />
                <KpiTile label="Total Amount" value={num(k?.TotalAmount)} format="currencyCompact" compact isLoading={kpis.isLoading} />
                <KpiTile label="Open Claims" value={num(k?.OpenCount)} format="number" compact isLoading={kpis.isLoading} />
                <KpiTile label="Average Claim" value={num(k?.AvgAmount)} format="currencyCompact" compact isLoading={kpis.isLoading} />
            </div>

            {/* Exposure & value mix — paired, equal-height analytics */}
            <div className="grid grid-cols-1 items-stretch gap-l lg:h-[300px] lg:grid-cols-12">
                <Card className="lg:col-span-5">
                    <CardHeader title="Active exposure" subtitle="Open claim value against total coverage" />
                    <CardContent className="justify-center py-s">
                        <QueryState
                            isLoading={kpis.isLoading}
                            isEmpty={kpis.isEmpty}
                            error={kpis.error}
                            onRetry={kpis.refetch}
                        >
                            <ExposurePanel used={num(k?.Exposure)} limit={num(k?.CoverageLimit)} />
                        </QueryState>
                    </CardContent>
                </Card>
                <div className="min-h-[300px] lg:col-span-7">
                    <ChartCard
                        className="h-full"
                        title="Value by status"
                        subtitle="How this customer's claim value is distributed"
                        chart={customerExposure(customerId)}
                    />
                </div>
            </div>

            {/* Claims over time — full-width trend */}
            <div className="h-[300px]">
                <TrendCard
                    className="h-full"
                    title="Claims over time"
                    subtitle="Filing volume and value by month"
                    initialMetric="amount"
                    makeChart={(metric) => customerHistory(customerId, metric)}
                />
            </div>

            {/* Records & communications — equal-height, each scrolls internally */}
            <div className="grid grid-cols-1 items-stretch gap-l lg:h-[460px] lg:grid-cols-12">
                <Card className="lg:col-span-7">
                    <CardHeader title="Claim history" subtitle="Every claim on file for this customer" />
                    <CardContent className="min-h-0">
                        <QueryState
                            isLoading={claimsList.isLoading}
                            isEmpty={claimsList.isEmpty}
                            error={claimsList.error}
                            onRetry={claimsList.refetch}
                            skeleton={<div className="h-40 w-full animate-pulse rounded-xl bg-muted/60" />}
                        >
                            <div className="flex min-h-[360px] flex-1 flex-col overflow-hidden lg:min-h-0">
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

                <CommunicationsCard
                    className="lg:col-span-5"
                    customerId={customerId}
                    customerName={str(person?.Customer_Name)}
                    claims={communicationClaims}
                />
            </div>
        </div>
    );
}
