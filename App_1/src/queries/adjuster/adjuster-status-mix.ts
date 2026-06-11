import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxInt } from "@/lib/dax";
import donutSpec from "@/queries/_shared/status-donut.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "claims_fact[Claim_Status]": { name: "Claim_Status", displayName: "Status" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
};

/** Status mix of the claims handled by a single adjuster. */
export function adjusterStatusMix(adjusterId: number) {
    const query = `
EVALUATE
CALCULATETABLE(
    SUMMARIZECOLUMNS(
        'claims_fact'[Claim_Status],
        "ClaimCount", [Claim Count]
    ),
    'claims_fact'[Adjuster_ID] = ${daxInt(adjusterId)}
)`.trim();

    return {
        connection,
        query,
        columnMetadata,
        vegaLiteSpec: donutSpec as unknown as VisualizationSpec,
    };
}
