import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxString } from "@/lib/dax";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[Claim_ID]": { name: "Claim_ID", displayName: "Claim" },
    "[Claim_Date]": { name: "Claim_Date", displayName: "Filed" },
    "[Claim_Type_Name]": { name: "Claim_Type_Name", displayName: "Type" },
    "[Claim_Status]": { name: "Claim_Status", displayName: "Status" },
    "[Amount]": { name: "Amount", displayName: "Amount", format: "$#,0" },
    "[Adjuster_ID]": { name: "Adjuster_ID", displayName: "Adjuster ID" },
    "[Adjuster_Name]": { name: "Adjuster_Name", displayName: "Adjuster" },
};

/** All claims filed by a single customer, most recent first. */
export function customerClaims(customerId: string) {
    const query = `
EVALUATE
SELECTCOLUMNS(
    FILTER('claims_fact', 'claims_fact'[Customer_ID] = ${daxString(customerId)}),
    "Claim_ID", 'claims_fact'[Claim_ID],
    "Claim_Date", 'claims_fact'[Claim_Date],
    "Claim_Type_Name", RELATED('claimtype_dim'[Claim_Type_Name]),
    "Claim_Status", 'claims_fact'[Claim_Status],
    "Amount", 'claims_fact'[Claim_Amount],
    "Adjuster_ID", 'claims_fact'[Adjuster_ID],
    "Adjuster_Name", RELATED('adjuster_dim'[Adjuster_Name])
)
ORDER BY [Claim_Date] DESC`.trim();

    return { connection, query, columnMetadata };
}
