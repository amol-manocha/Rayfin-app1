import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxInt } from "@/lib/dax";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[Claim_ID]": { name: "Claim_ID", displayName: "Claim" },
    "[Claim_Status]": { name: "Claim_Status", displayName: "Status" },
    "[Claim_Amount]": { name: "Claim_Amount", displayName: "Claim Amount", format: "$#,0" },
    "[Claim_Date]": { name: "Claim_Date", displayName: "Filed" },
    "[Claim_CloseDate]": { name: "Claim_CloseDate", displayName: "Closed" },
    "[Claim_Type_Name]": { name: "Claim_Type_Name", displayName: "Type" },
    "[Customer_ID]": { name: "Customer_ID", displayName: "Customer ID" },
    "[Customer_Name]": { name: "Customer_Name", displayName: "Customer" },
    "[Customer_Age]": { name: "Customer_Age", displayName: "Age" },
    "[Customer_Gender]": { name: "Customer_Gender", displayName: "Gender" },
    "[Customer_City]": { name: "Customer_City", displayName: "City" },
    "[Customer_State]": { name: "Customer_State", displayName: "State" },
    "[Vehicle_Make]": { name: "Vehicle_Make", displayName: "Make" },
    "[Vehicle_Model]": { name: "Vehicle_Model", displayName: "Model" },
    "[Vehicle_Year]": { name: "Vehicle_Year", displayName: "Year" },
    "[Vehicle_Type]": { name: "Vehicle_Type", displayName: "Body" },
    "[Vehicle_VIN]": { name: "Vehicle_VIN", displayName: "VIN" },
    "[Vehicle_Value]": { name: "Vehicle_Value", displayName: "Vehicle Value", format: "$#,0" },
    "[Adjuster_ID]": { name: "Adjuster_ID", displayName: "Adjuster ID" },
    "[Adjuster_Name]": { name: "Adjuster_Name", displayName: "Adjuster" },
    "[Adjuster_Region]": { name: "Adjuster_Region", displayName: "Region" },
    "[Adjuster_Experience]": { name: "Adjuster_Experience", displayName: "Experience (yrs)" },
    "[Shop_Name]": { name: "Shop_Name", displayName: "Repair Shop" },
    "[Shop_Network]": { name: "Shop_Network", displayName: "Network" },
    "[Shop_City]": { name: "Shop_City", displayName: "City" },
    "[Shop_State]": { name: "Shop_State", displayName: "State" },
    "[Shop_AvgRepairDays]": { name: "Shop_AvgRepairDays", displayName: "Avg Repair Days" },
    "[Shop_Specialty]": { name: "Shop_Specialty", displayName: "Specialty" },
    "[Policy_Number]": { name: "Policy_Number", displayName: "Policy" },
    "[Policy_Type]": { name: "Policy_Type", displayName: "Policy Type" },
    "[Coverage_Limit]": { name: "Coverage_Limit", displayName: "Coverage Limit", format: "$#,0" },
    "[Policy_Start]": { name: "Policy_Start", displayName: "Policy Start" },
    "[Policy_End]": { name: "Policy_End", displayName: "Policy End" },
};

/** Full single-claim detail joined across every dimension for the Claim 360. */
export function claimDetail(claimId: number) {
    const query = `
EVALUATE
SELECTCOLUMNS(
    FILTER('Claims', 'Claims'[Claim ID] = ${daxInt(claimId)}),
    "Claim_ID", 'Claims'[Claim ID],
    "Claim_Status", 'Claims'[Claim Status],
    "Claim_Amount", 'Claims'[Claim Amount],
    "Claim_Date", 'Claims'[Claim Date],
    "Claim_CloseDate", 'Claims'[Claim Close Date],
    "Claim_Type_Name", RELATED('Claim Type'[Claim Type Name]),
    "Customer_ID", 'Claims'[Customer ID],
    "Customer_Name", RELATED('Customer'[Customer Name]),
    "Customer_Age", RELATED('Customer'[Customer Age]),
    "Customer_Gender", RELATED('Customer'[Gender]),
    "Customer_City", RELATED('Customer'[City]),
    "Customer_State", RELATED('Customer'[State]),
    "Vehicle_Make", RELATED('Vehicle'[Make]),
    "Vehicle_Model", RELATED('Vehicle'[Model]),
    "Vehicle_Year", RELATED('Vehicle'[Year]),
    "Vehicle_Type", RELATED('Vehicle'[Vehicle Type]),
    "Vehicle_VIN", RELATED('Vehicle'[VIN]),
    "Vehicle_Value", RELATED('Vehicle'[Vehicle Value]),
    "Adjuster_ID", 'Claims'[Adjuster ID],
    "Adjuster_Name", RELATED('Adjuster'[Adjuster Name]),
    "Adjuster_Region", RELATED('Adjuster'[Region]),
    "Adjuster_Experience", RELATED('Adjuster'[Experience Years]),
    "Shop_Name", RELATED('Repair Shop'[Shop Name]),
    "Shop_Network", RELATED('Repair Shop'[Network Type]),
    "Shop_City", RELATED('Repair Shop'[City]),
    "Shop_State", RELATED('Repair Shop'[State]),
    "Shop_AvgRepairDays", RELATED('Repair Shop'[Avg Repair Days]),
    "Shop_Specialty", RELATED('Repair Shop'[Specialty]),
    "Policy_Number", RELATED('Policy'[Policy Number]),
    "Policy_Type", RELATED('Policy'[Policy Type]),
    "Coverage_Limit", RELATED('Policy'[Coverage Limit]),
    "Policy_Start", RELATED('Policy'[Policy Start Date]),
    "Policy_End", RELATED('Policy'[Policy End Date])
)`.trim();

    return { connection, query, columnMetadata };
}
