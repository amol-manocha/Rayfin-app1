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
    FILTER('claims_fact', 'claims_fact'[Claim_ID] = ${daxInt(claimId)}),
    "Claim_ID", 'claims_fact'[Claim_ID],
    "Claim_Status", 'claims_fact'[Claim_Status],
    "Claim_Amount", 'claims_fact'[Claim_Amount],
    "Claim_Date", 'claims_fact'[Claim_Date],
    "Claim_CloseDate", 'claims_fact'[Claim_CloseDate],
    "Claim_Type_Name", RELATED('claimtype_dim'[Claim_Type_Name]),
    "Customer_ID", 'claims_fact'[Customer_ID],
    "Customer_Name", RELATED('customer_dim'[Customer_Name]),
    "Customer_Age", RELATED('customer_dim'[Customer_Age]),
    "Customer_Gender", RELATED('customer_dim'[Gender]),
    "Customer_City", RELATED('customer_dim'[City]),
    "Customer_State", RELATED('customer_dim'[State]),
    "Vehicle_Make", RELATED('vehicle_dim'[Make]),
    "Vehicle_Model", RELATED('vehicle_dim'[Model]),
    "Vehicle_Year", RELATED('vehicle_dim'[Year]),
    "Vehicle_Type", RELATED('vehicle_dim'[Vehicle_Type]),
    "Vehicle_VIN", RELATED('vehicle_dim'[Vehicle_VIN]),
    "Vehicle_Value", RELATED('vehicle_dim'[Value]),
    "Adjuster_ID", 'claims_fact'[Adjuster_ID],
    "Adjuster_Name", RELATED('adjuster_dim'[Adjuster_Name]),
    "Adjuster_Region", RELATED('adjuster_dim'[Region]),
    "Adjuster_Experience", RELATED('adjuster_dim'[Experience_Years]),
    "Shop_Name", RELATED('repair_shop_dim'[Shop_Name]),
    "Shop_Network", RELATED('repair_shop_dim'[Network_Type]),
    "Shop_City", RELATED('repair_shop_dim'[City]),
    "Shop_State", RELATED('repair_shop_dim'[State]),
    "Shop_AvgRepairDays", RELATED('repair_shop_dim'[Avg_Repair_Days]),
    "Shop_Specialty", RELATED('repair_shop_dim'[Specialty]),
    "Policy_Number", RELATED('policy_dim'[Policy_Number]),
    "Policy_Type", RELATED('policy_dim'[Policy_Type]),
    "Coverage_Limit", RELATED('policy_dim'[Coverage_Limit]),
    "Policy_Start", RELATED('policy_dim'[Policy_Start_Date]),
    "Policy_End", RELATED('policy_dim'[Policy_End_Date])
)`.trim();

    return { connection, query, columnMetadata };
}
