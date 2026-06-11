import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./claims-directory.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "claims_fact[Claim_ID]": { name: "Claim_ID", displayName: "Claim", format: "0" },
    "customer_dim[Customer_ID]": { name: "Customer_ID", displayName: "Customer ID" },
    "customer_dim[Customer_Name]": { name: "Customer_Name", displayName: "Customer" },
    "claimtype_dim[Claim_Type_Name]": { name: "Claim_Type_Name", displayName: "Type" },
    "claims_fact[Claim_Status]": { name: "Claim_Status", displayName: "Status" },
    "[Amount]": { name: "Amount", displayName: "Amount", format: "$#,0" },
};

/** Full claim directory for the global type-ahead search. */
export function claimsDirectory() {
    return { connection, query: baseQuery, columnMetadata };
}
