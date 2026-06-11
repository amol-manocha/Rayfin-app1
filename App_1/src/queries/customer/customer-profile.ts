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
    FILTER('customer_dim', 'customer_dim'[Customer_ID] = ${daxString(customerId)}),
    "Customer_Name", 'customer_dim'[Customer_Name],
    "Customer_Age", 'customer_dim'[Customer_Age],
    "Gender", 'customer_dim'[Gender],
    "Address", 'customer_dim'[Address],
    "City", 'customer_dim'[City],
    "State", 'customer_dim'[State],
    "DOB", 'customer_dim'[Date_of_Birth]
)`.trim();

    return { connection, query, columnMetadata };
}
