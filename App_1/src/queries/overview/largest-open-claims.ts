import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./largest-open-claims.dax?raw";
import spec from "./largest-open-claims.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "claims_fact[Claim_ID]": { name: "Claim_ID", displayName: "Claim", format: "0" },
    "customer_dim[Customer_ID]": { name: "Customer_ID", displayName: "Customer ID" },
    "customer_dim[Customer_Name]": { name: "Customer_Name", displayName: "Customer" },
    "claimtype_dim[Claim_Type_Name]": { name: "Claim_Type_Name", displayName: "Type" },
    "claims_fact[Claim_Status]": { name: "Claim_Status", displayName: "Status" },
    "claims_fact[Claim_Date]": { name: "Claim_Date", displayName: "Date", format: "mmm d, yyyy" },
    "[Amount]": { name: "Amount", displayName: "Claim Amount", format: "$#,0" },
};

/** Largest open claims — shared by the ranked bar chart and the detail grid. */
export function largestOpenClaims() {
    return {
        connection,
        query: baseQuery,
        columnMetadata,
        vegaLiteSpec: spec as unknown as VisualizationSpec,
    };
}
