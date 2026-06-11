//-----------------------------------------------------------------------
// Largest open claims — a ranked bar chart paired with a detail grid that
// share a single query. Rows and bars click through to the Claim 360.
//-----------------------------------------------------------------------

import { VegaVisual, useCssTheme } from "@microsoft/fabric-visuals";
import { Card, CardHeader, CardContent } from "@/components/card";
import { QueryState } from "@/components/states";
import { DataGridTable, type GridColumn } from "@/components/data-grid-table";
import { StatusBadge } from "@/components/status-badge";
import { ClaimLink, CustomerLink } from "@/components/entity-link";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { useRouter } from "@/lib/router";
import { tableToObjects, num, str } from "@/lib/rows";
import { largestOpenClaims } from "@/queries/overview/largest-open-claims";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function LargestOpenClaimsCard({ className }: { className?: string }) {
    const theme = useCssTheme();
    const { navigate } = useRouter();
    const chart = largestOpenClaims();
    const { dataTable, isLoading, isEmpty, error, refetch } = useVisualQuery(chart);
    const rows = tableToObjects(dataTable);

    const columns: GridColumn[] = [
        {
            key: "Claim_ID",
            header: "Claim",
            render: (r) => <ClaimLink id={num(r.Claim_ID)} />,
        },
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
            key: "Claim_Date",
            header: "Filed",
            render: (r) => formatDate(r.Claim_Date),
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
        <Card className={cn("h-full", className)}>
            <CardHeader
                title="Largest open claims"
                subtitle="Highest-value claims still awaiting resolution"
            />
            <CardContent>
                <QueryState
                    isLoading={isLoading}
                    isEmpty={isEmpty}
                    error={error}
                    onRetry={refetch}
                >
                    <div className="grid min-h-0 flex-1 grid-cols-1 gap-l lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                        <div className="flex min-h-[260px] flex-col lg:min-h-0">
                            {dataTable ? (
                                <VegaVisual
                                    spec={chart.vegaLiteSpec}
                                    data={dataTable}
                                    theme={theme}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            ) : null}
                        </div>
                        <DataGridTable
                            rows={rows}
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
    );
}
