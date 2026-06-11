import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./kpis.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[Claim Count]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[Total Claim Amount]": { name: "TotalClaimAmount", displayName: "Total Claim Amount", format: "$#,0" },
    "[Open Claim Count]": { name: "OpenClaimCount", displayName: "Open Claims", format: "#,0" },
    "[Open Claim Rate]": { name: "OpenClaimRate", displayName: "Open Rate", format: "0.0%" },
    "[Exposure]": { name: "Exposure", displayName: "Overall Exposure", format: "$#,0" },
};

/** Headline KPI figures for the Book Overview strip (single-row result). */
export function overviewKpis() {
    return { connection, query: baseQuery, columnMetadata };
}
