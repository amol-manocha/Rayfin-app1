import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./adjusters-directory.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Adjuster[Adjuster ID]": { name: "Adjuster_ID", displayName: "Adjuster ID", format: "0" },
    "Adjuster[Adjuster Name]": { name: "Adjuster_Name", displayName: "Adjuster" },
    "Adjuster[Region]": { name: "Region", displayName: "Region" },
    "Adjuster[Experience Years]": { name: "Experience_Years", displayName: "Experience (yrs)", format: "#,0" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[OpenAmount]": { name: "OpenAmount", displayName: "Open Claim Amount", format: "$#,0" },
};

/** Full adjuster directory for global search and the adjuster directory page. */
export function adjustersDirectory() {
    return { connection, query: baseQuery, columnMetadata };
}
