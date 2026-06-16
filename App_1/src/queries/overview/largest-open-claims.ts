import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./largest-open-claims.dax?raw";
import spec from "./largest-open-claims.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Claims[Claim ID]": { name: "Claim_ID", displayName: "Claim", format: "0" },
    "Customer[Customer ID]": { name: "Customer_ID", displayName: "Customer ID" },
    "Customer[Customer Name]": { name: "Customer_Name", displayName: "Customer" },
    "Claim Type[Claim Type Name]": { name: "Claim_Type_Name", displayName: "Type" },
    "Claims[Claim Status]": { name: "Claim_Status", displayName: "Status" },
    "Claims[Claim Date]": { name: "Claim_Date", displayName: "Date", format: "mmm d, yyyy" },
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
