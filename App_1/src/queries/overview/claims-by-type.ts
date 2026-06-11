import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./claims-by-type.dax?raw";
import spec from "./claims-by-type.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "claimtype_dim[Claim_Type_Name]": { name: "Claim_Type_Name", displayName: "Claim Type" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Total Claim Amount", format: "$#,0" },
};

/** Vertical column chart of claim counts by claim type. */
export function claimsByType() {
    return {
        connection,
        query: baseQuery,
        columnMetadata,
        vegaLiteSpec: spec as unknown as VisualizationSpec,
    };
}
