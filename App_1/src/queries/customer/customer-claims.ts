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
    FILTER('Claims', 'Claims'[Customer ID] = ${daxString(customerId)}),
    "Claim_ID", 'Claims'[Claim ID],
    "Claim_Date", 'Claims'[Claim Date],
    "Claim_Type_Name", RELATED('Claim Type'[Claim Type Name]),
    "Claim_Status", 'Claims'[Claim Status],
    "Amount", 'Claims'[Claim Amount],
    "Adjuster_ID", 'Claims'[Adjuster ID],
    "Adjuster_Name", RELATED('Adjuster'[Adjuster Name])
)
ORDER BY [Claim_Date] DESC`.trim();

    return { connection, query, columnMetadata };
}
