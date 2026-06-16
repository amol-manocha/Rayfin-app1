import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import donutSpec from "@/queries/repair-shops/repair-shop-network-donut.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Repair Shop[Network Type]": { name: "Network_Type", displayName: "Network" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Claim Amount", format: "$#,0" },
    "[AvgRepairDays]": { name: "AvgRepairDays", displayName: "Avg Repair Days", format: "#,0.0" },
};

/** Open claim volume by repair-shop network type (excludes unassigned claims). */
export function repairShopNetworkMix() {
    const query = `
EVALUATE
FILTER(
    SUMMARIZECOLUMNS(
        'Repair Shop'[Network Type],
        "ClaimCount", [Open Claim Count],
        "TotalAmount", [Total Claim Amount],
        "AvgRepairDays", AVERAGE('Repair Shop'[Avg Repair Days])
    ),
    NOT ISBLANK('Repair Shop'[Network Type])
)
`.trim();

    return {
        connection,
        query,
        columnMetadata,
        vegaLiteSpec: donutSpec as unknown as VisualizationSpec,
    };
}
