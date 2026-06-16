import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./claims-directory.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Claims[Claim ID]": { name: "Claim_ID", displayName: "Claim", format: "0" },
    "Customer[Customer ID]": { name: "Customer_ID", displayName: "Customer ID" },
    "Customer[Customer Name]": { name: "Customer_Name", displayName: "Customer" },
    "Claim Type[Claim Type Name]": { name: "Claim_Type_Name", displayName: "Type" },
    "Claims[Claim Status]": { name: "Claim_Status", displayName: "Status" },
    "[Amount]": { name: "Amount", displayName: "Amount", format: "$#,0" },
};

/** Full claim directory for the global type-ahead search. */
export function claimsDirectory() {
    return { connection, query: baseQuery, columnMetadata };
}
