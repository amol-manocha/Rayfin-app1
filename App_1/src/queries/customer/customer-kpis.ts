import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxString } from "@/lib/dax";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Total Claim Amount", format: "$#,0" },
    "[OpenCount]": { name: "OpenCount", displayName: "Open Claims", format: "#,0" },
    "[AvgAmount]": { name: "AvgAmount", displayName: "Average Claim", format: "$#,0" },
    "[Exposure]": { name: "Exposure", displayName: "Active Exposure", format: "$#,0" },
    "[CoverageLimit]": { name: "CoverageLimit", displayName: "Coverage Limit", format: "$#,0" },
};

/** Headline KPIs and total coverage for a single customer. */
export function customerKpis(customerId: string) {
    const id = daxString(customerId);
    const query = `
EVALUATE
ROW(
    "ClaimCount", CALCULATE([Claim Count], 'Claims'[Customer ID] = ${id}),
    "TotalAmount", CALCULATE([Total Claim Amount], 'Claims'[Customer ID] = ${id}),
    "OpenCount", CALCULATE([Open Claim Count], 'Claims'[Customer ID] = ${id}),
    "AvgAmount", CALCULATE([Average Claim Amount], 'Claims'[Customer ID] = ${id}),
    "Exposure", CALCULATE([Total Claim Amount], 'Claims'[Customer ID] = ${id}, 'Claims'[Claim Status] IN { "Open", "Under Review" }),
    "CoverageLimit", CALCULATE(SUM('Policy'[Coverage Limit]), 'Policy'[Customer ID] = ${id})
)`.trim();

    return { connection, query, columnMetadata };
}
