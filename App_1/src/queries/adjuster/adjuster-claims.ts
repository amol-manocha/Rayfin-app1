import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxInt } from "@/lib/dax";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[Claim_ID]": { name: "Claim_ID", displayName: "Claim" },
    "[Claim_Date]": { name: "Claim_Date", displayName: "Filed" },
    "[Customer_ID]": { name: "Customer_ID", displayName: "Customer ID" },
    "[Customer_Name]": { name: "Customer_Name", displayName: "Customer" },
    "[Claim_Type_Name]": { name: "Claim_Type_Name", displayName: "Type" },
    "[Claim_Status]": { name: "Claim_Status", displayName: "Status" },
    "[Amount]": { name: "Amount", displayName: "Amount", format: "$#,0" },
};

/** The roster of claims handled by a single adjuster, most recent first. */
export function adjusterClaims(adjusterId: number) {
    const query = `
EVALUATE
SELECTCOLUMNS(
    FILTER('claims_fact', 'claims_fact'[Adjuster_ID] = ${daxInt(adjusterId)}),
    "Claim_ID", 'claims_fact'[Claim_ID],
    "Claim_Date", 'claims_fact'[Claim_Date],
    "Customer_ID", 'claims_fact'[Customer_ID],
    "Customer_Name", RELATED('customer_dim'[Customer_Name]),
    "Claim_Type_Name", RELATED('claimtype_dim'[Claim_Type_Name]),
    "Claim_Status", 'claims_fact'[Claim_Status],
    "Amount", 'claims_fact'[Claim_Amount]
)
ORDER BY [Claim_Date] DESC`.trim();

    return { connection, query, columnMetadata };
}
