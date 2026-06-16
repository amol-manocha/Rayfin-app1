import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxInt } from "@/lib/dax";
import donutSpec from "@/queries/_shared/status-donut.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Claims[Claim Status]": { name: "Claim_Status", displayName: "Status" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
};

/** Status mix of the claims handled by a single adjuster. */
export function adjusterStatusMix(adjusterId: number) {
    const query = `
EVALUATE
CALCULATETABLE(
    SUMMARIZECOLUMNS(
        'Claims'[Claim Status],
        "ClaimCount", [Claim Count]
    ),
    'Claims'[Adjuster ID] = ${daxInt(adjusterId)}
)`.trim();

    return {
        connection,
        query,
        columnMetadata,
        vegaLiteSpec: donutSpec as unknown as VisualizationSpec,
    };
}
