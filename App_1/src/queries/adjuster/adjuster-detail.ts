import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxInt } from "@/lib/dax";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[Adjuster_Name]": { name: "Adjuster_Name", displayName: "Adjuster" },
    "[Region]": { name: "Region", displayName: "Region" },
    "[Experience]": { name: "Experience", displayName: "Experience (yrs)" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Total Claim Amount", format: "$#,0" },
    "[OpenCount]": { name: "OpenCount", displayName: "Open Claims", format: "#,0" },
    "[ClosedCount]": { name: "ClosedCount", displayName: "Closed Claims", format: "#,0" },
    "[AvgAmount]": { name: "AvgAmount", displayName: "Average Claim", format: "$#,0" },
};

/** Profile and workload metrics for a single adjuster. */
export function adjusterDetail(adjusterId: number) {
    const id = daxInt(adjusterId);
    const query = `
EVALUATE
ROW(
    "Adjuster_Name", CALCULATE(SELECTEDVALUE('adjuster_dim'[Adjuster_Name]), 'adjuster_dim'[Adjuster_ID] = ${id}),
    "Region", CALCULATE(SELECTEDVALUE('adjuster_dim'[Region]), 'adjuster_dim'[Adjuster_ID] = ${id}),
    "Experience", CALCULATE(SELECTEDVALUE('adjuster_dim'[Experience_Years]), 'adjuster_dim'[Adjuster_ID] = ${id}),
    "ClaimCount", CALCULATE([Claim Count], 'claims_fact'[Adjuster_ID] = ${id}),
    "TotalAmount", CALCULATE([Total Claim Amount], 'claims_fact'[Adjuster_ID] = ${id}),
    "OpenCount", CALCULATE([Open Claim Count], 'claims_fact'[Adjuster_ID] = ${id}),
    "ClosedCount", CALCULATE([Closed Claim Count], 'claims_fact'[Adjuster_ID] = ${id}),
    "AvgAmount", CALCULATE([Average Claim Amount], 'claims_fact'[Adjuster_ID] = ${id})
)`.trim();

    return { connection, query, columnMetadata };
}
