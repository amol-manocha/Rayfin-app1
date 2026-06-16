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
    "Adjuster_Name", CALCULATE(SELECTEDVALUE('Adjuster'[Adjuster Name]), 'Adjuster'[Adjuster ID] = ${id}),
    "Region", CALCULATE(SELECTEDVALUE('Adjuster'[Region]), 'Adjuster'[Adjuster ID] = ${id}),
    "Experience", CALCULATE(SELECTEDVALUE('Adjuster'[Experience Years]), 'Adjuster'[Adjuster ID] = ${id}),
    "ClaimCount", CALCULATE([Claim Count], 'Claims'[Adjuster ID] = ${id}),
    "TotalAmount", CALCULATE([Total Claim Amount], 'Claims'[Adjuster ID] = ${id}),
    "OpenCount", CALCULATE([Open Claim Count], 'Claims'[Adjuster ID] = ${id}),
    "ClosedCount", CALCULATE([Closed Claim Count], 'Claims'[Adjuster ID] = ${id}),
    "AvgAmount", CALCULATE([Average Claim Amount], 'Claims'[Adjuster ID] = ${id})
)`.trim();

    return { connection, query, columnMetadata };
}
