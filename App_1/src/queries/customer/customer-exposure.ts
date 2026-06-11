import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxString } from "@/lib/dax";
import barSpec from "@/queries/_shared/status-bar.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "claims_fact[Claim_Status]": { name: "Claim_Status", displayName: "Status" },
    "[Amount]": { name: "Amount", displayName: "Claim Amount", format: "$#,0" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
};

/** Claim amount by status for a single customer (colored horizontal bars). */
export function customerExposure(customerId: string) {
    const query = `
EVALUATE
CALCULATETABLE(
    SUMMARIZECOLUMNS(
        'claims_fact'[Claim_Status],
        "Amount", [Total Claim Amount],
        "ClaimCount", [Claim Count]
    ),
    'claims_fact'[Customer_ID] = ${daxString(customerId)}
)`.trim();

    return {
        connection,
        query,
        columnMetadata,
        vegaLiteSpec: barSpec as unknown as VisualizationSpec,
    };
}
