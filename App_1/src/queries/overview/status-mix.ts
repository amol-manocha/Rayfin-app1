import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./status-mix.dax?raw";
import spec from "./status-mix.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Claims[Claim Status]": { name: "Claim_Status", displayName: "Status" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
};

/** Donut of claim status mix with status-colored slices. */
export function statusMix() {
    return {
        connection,
        query: baseQuery,
        columnMetadata,
        vegaLiteSpec: spec as unknown as VisualizationSpec,
    };
}
