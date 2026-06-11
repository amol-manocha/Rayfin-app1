import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./high-frequency-filers.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "customer_dim[Customer_ID]": { name: "Customer_ID", displayName: "Customer ID" },
    "customer_dim[Customer_Name]": { name: "Customer_Name", displayName: "Customer" },
    "customer_dim[City]": { name: "City", displayName: "City" },
    "customer_dim[State]": { name: "State", displayName: "State" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Total Claim Amount", format: "$#,0" },
};

/** Top filers by claim count — feeds the high-frequency filers lollipop list. */
export function highFrequencyFilers() {
    return { connection, query: baseQuery, columnMetadata };
}
