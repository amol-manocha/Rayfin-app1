import type { ColumnMetadataMap } from "@/lib/to-data-table";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Repair Shop[Shop Name]": { name: "Shop_Name", displayName: "Repair Shop" },
    "Repair Shop[Network Type]": { name: "Network_Type", displayName: "Network" },
    "Repair Shop[Specialty]": { name: "Specialty", displayName: "Specialty" },
    "Repair Shop[City]": { name: "City", displayName: "City" },
    "Repair Shop[State]": { name: "State", displayName: "State" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Claim Amount", format: "$#,0" },
    "[AvgRepairDays]": { name: "AvgRepairDays", displayName: "Avg Repair Days", format: "#,0.0" },
};

/** Ranked repair-shop directory for the new insights page (excludes unassigned claims). */
export function repairShopDirectory() {
    const query = `
EVALUATE
FILTER(
    SUMMARIZECOLUMNS(
        'Repair Shop'[Shop Name],
        'Repair Shop'[Network Type],
        'Repair Shop'[Specialty],
        'Repair Shop'[City],
        'Repair Shop'[State],
        "ClaimCount", [Claim Count],
        "TotalAmount", [Total Claim Amount],
        "AvgRepairDays", AVERAGE('Repair Shop'[Avg Repair Days])
    ),
    NOT ISBLANK('Repair Shop'[Shop Name])
)
ORDER BY [TotalAmount] DESC
`.trim();

    return { connection, query, columnMetadata };
}
