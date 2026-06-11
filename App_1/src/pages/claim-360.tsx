//-----------------------------------------------------------------------
// Claim 360 — everything about a single claim on one investigative page:
// the parties, the vehicle, the policy, who's handling it, how it compares
// to similar claims, and where it sits against the coverage limit.
//-----------------------------------------------------------------------

import { Card, CardContent, CardHeader } from "@/components/card";
import { Field, FieldGrid, PageHeader } from "@/components/detail";
import { StatusBadge } from "@/components/status-badge";
import { CustomerLink, AdjusterLink } from "@/components/entity-link";
import { CoverageGauge } from "@/components/coverage-gauge";
import { QueryState } from "@/components/states";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { firstRowObject, num, str } from "@/lib/rows";
import { claimDetail } from "@/queries/claim/claim-detail";
import { ClaimContextBars } from "@/components/claim/claim-context-bars";
import { ClaimNotesPanel } from "@/components/claim/claim-notes-panel";
import { formatCurrency, formatDate } from "@/lib/format";

export function Claim360Page({ claimId }: { claimId: number }) {
    const { dataTable, isLoading, isEmpty, error, refetch } = useVisualQuery(
        claimDetail(claimId),
    );
    const claim = firstRowObject(dataTable);

    return (
        <div className="flex flex-col gap-l">
            <QueryState
                isLoading={isLoading}
                isEmpty={isEmpty}
                error={error}
                onRetry={refetch}
                emptyMessage={`We couldn't find Claim ${claimId}.`}
            >
                {claim ? (
                    <>
                        <PageHeader
                            eyebrow="Claim 360"
                            title={`Claim ${num(claim.Claim_ID)}`}
                            badge={<StatusBadge status={str(claim.Claim_Status)} />}
                            actions={
                                <div className="flex items-center gap-l">
                                    <div className="text-right">
                                        <p className="text-[length:var(--text-100)] uppercase tracking-wide text-muted-foreground">
                                            Claim amount
                                        </p>
                                        <p className="tabular text-[length:var(--text-500)] font-semibold text-foreground">
                                            {formatCurrency(num(claim.Claim_Amount))}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[length:var(--text-100)] uppercase tracking-wide text-muted-foreground">
                                            Filed
                                        </p>
                                        <p className="text-[length:var(--text-300)] font-medium text-foreground">
                                            {formatDate(claim.Claim_Date)}
                                        </p>
                                    </div>
                                </div>
                            }
                        />

                        <div className="grid grid-cols-1 gap-l lg:grid-cols-3">
                            <Card className="lg:col-span-2">
                                <CardHeader title="Claim in context" subtitle="How this claim compares to similar claims" />
                                <CardContent>
                                    <ClaimContextBars
                                        claimType={str(claim.Claim_Type_Name)}
                                        amount={num(claim.Claim_Amount)}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader title="Coverage" subtitle="Claim amount vs policy limit" />
                                <CardContent className="items-center justify-center">
                                    <CoverageGauge
                                        used={num(claim.Claim_Amount)}
                                        limit={num(claim.Coverage_Limit)}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 gap-l md:grid-cols-2">
                            <Card>
                                <CardHeader title="Customer" />
                                <CardContent>
                                    <FieldGrid>
                                        <Field label="Name">
                                            <CustomerLink
                                                id={str(claim.Customer_ID)}
                                                name={str(claim.Customer_Name)}
                                            />
                                        </Field>
                                        <Field label="Age">{str(claim.Customer_Age)}</Field>
                                        <Field label="Gender">{str(claim.Customer_Gender)}</Field>
                                        <Field label="Location">
                                            {str(claim.Customer_City)}, {str(claim.Customer_State)}
                                        </Field>
                                    </FieldGrid>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader title="Vehicle" />
                                <CardContent>
                                    <FieldGrid>
                                        <Field label="Make & model">
                                            {str(claim.Vehicle_Make)} {str(claim.Vehicle_Model)}
                                        </Field>
                                        <Field label="Year">{str(claim.Vehicle_Year)}</Field>
                                        <Field label="Body">{str(claim.Vehicle_Type)}</Field>
                                        <Field label="Value">
                                            {formatCurrency(num(claim.Vehicle_Value))}
                                        </Field>
                                        <Field label="VIN" className="col-span-2">
                                            <span className="tabular">{str(claim.Vehicle_VIN)}</span>
                                        </Field>
                                    </FieldGrid>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader title="Policy" />
                                <CardContent>
                                    <FieldGrid>
                                        <Field label="Policy">{str(claim.Policy_Number)}</Field>
                                        <Field label="Type">{str(claim.Policy_Type)}</Field>
                                        <Field label="Coverage limit">
                                            {formatCurrency(num(claim.Coverage_Limit))}
                                        </Field>
                                        <Field label="Term">
                                            {formatDate(claim.Policy_Start)} – {formatDate(claim.Policy_End)}
                                        </Field>
                                    </FieldGrid>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader title="Handling" />
                                <CardContent>
                                    <FieldGrid>
                                        <Field label="Adjuster">
                                            <AdjusterLink
                                                id={num(claim.Adjuster_ID)}
                                                name={str(claim.Adjuster_Name)}
                                            />
                                        </Field>
                                        <Field label="Region">{str(claim.Adjuster_Region)}</Field>
                                        <Field label="Repair shop">{str(claim.Shop_Name)}</Field>
                                        <Field label="Network">{str(claim.Shop_Network)}</Field>
                                        <Field label="Avg repair days">
                                            {str(claim.Shop_AvgRepairDays)}
                                        </Field>
                                        <Field label="Specialty">{str(claim.Shop_Specialty)}</Field>
                                    </FieldGrid>
                                </CardContent>
                            </Card>
                        </div>

                        <ClaimNotesPanel claimId={claimId} />
                    </>
                ) : null}
            </QueryState>
        </div>
    );
}
