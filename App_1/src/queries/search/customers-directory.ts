import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./customers-directory.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Customer[Customer ID]": { name: "Customer_ID", displayName: "Customer ID" },
    "Customer[Customer Name]": { name: "Customer_Name", displayName: "Customer" },
    "Customer[City]": { name: "City", displayName: "City" },
    "Customer[State]": { name: "State", displayName: "State" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
};

/** Full customer directory for the global type-ahead search. */
export function customersDirectory() {
    return { connection, query: baseQuery, columnMetadata };
}
