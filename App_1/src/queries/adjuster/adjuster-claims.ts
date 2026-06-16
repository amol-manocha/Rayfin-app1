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
    FILTER('Claims', 'Claims'[Adjuster ID] = ${daxInt(adjusterId)}),
    "Claim_ID", 'Claims'[Claim ID],
    "Claim_Date", 'Claims'[Claim Date],
    "Customer_ID", 'Claims'[Customer ID],
    "Customer_Name", RELATED('Customer'[Customer Name]),
    "Claim_Type_Name", RELATED('Claim Type'[Claim Type Name]),
    "Claim_Status", 'Claims'[Claim Status],
    "Amount", 'Claims'[Claim Amount]
)
ORDER BY [Claim_Date] DESC`.trim();

    return { connection, query, columnMetadata };
}
