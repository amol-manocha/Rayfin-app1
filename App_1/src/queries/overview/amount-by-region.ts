import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./amount-by-region.dax?raw";
import spec from "./amount-by-region.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "adjuster_dim[Region]": { name: "Region", displayName: "Region" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Total Claim Amount", format: "$#,0" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
};

/** Horizontal bar chart of total claim amount by region, ranked descending. */
export function amountByRegion() {
    return {
        connection,
        query: baseQuery,
        columnMetadata,
        vegaLiteSpec: spec as unknown as VisualizationSpec,
    };
}
