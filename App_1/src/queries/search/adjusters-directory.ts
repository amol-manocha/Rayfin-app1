import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./adjusters-directory.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "adjuster_dim[Adjuster_ID]": { name: "Adjuster_ID", displayName: "Adjuster ID", format: "0" },
    "adjuster_dim[Adjuster_Name]": { name: "Adjuster_Name", displayName: "Adjuster" },
    "adjuster_dim[Region]": { name: "Region", displayName: "Region" },
    "adjuster_dim[Experience_Years]": { name: "Experience_Years", displayName: "Experience (yrs)", format: "#,0" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[OpenAmount]": { name: "OpenAmount", displayName: "Open Claim Amount", format: "$#,0" },
};

/** Full adjuster directory for global search and the adjuster directory page. */
export function adjustersDirectory() {
    return { connection, query: baseQuery, columnMetadata };
}
