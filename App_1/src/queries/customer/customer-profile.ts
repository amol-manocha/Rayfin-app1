import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxString } from "@/lib/dax";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[Customer_Name]": { name: "Customer_Name", displayName: "Customer" },
    "[Customer_Age]": { name: "Customer_Age", displayName: "Age" },
    "[Gender]": { name: "Gender", displayName: "Gender" },
    "[Address]": { name: "Address", displayName: "Address" },
    "[City]": { name: "City", displayName: "City" },
    "[State]": { name: "State", displayName: "State" },
    "[DOB]": { name: "DOB", displayName: "Date of birth" },
};

/** Customer demographic profile for the Customer 360 header and residence card. */
export function customerProfile(customerId: string) {
    const query = `
EVALUATE
SELECTCOLUMNS(
    FILTER('Customer', 'Customer'[Customer ID] = ${daxString(customerId)}),
    "Customer_Name", 'Customer'[Customer Name],
    "Customer_Age", 'Customer'[Customer Age],
    "Gender", 'Customer'[Gender],
    "Address", 'Customer'[Address],
    "City", 'Customer'[City],
    "State", 'Customer'[State],
    "DOB", 'Customer'[Date of Birth]
)`.trim();

    return { connection, query, columnMetadata };
}
