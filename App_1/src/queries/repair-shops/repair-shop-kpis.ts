import type { ColumnMetadataMap } from "@/lib/to-data-table";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[ShopCount]": { name: "ShopCount", displayName: "Repair Shops", format: "#,0" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Total Claim Amount", format: "$#,0" },
    "[AvgRepairDays]": { name: "AvgRepairDays", displayName: "Avg Repair Days", format: "#,0.0" },
    "[ClaimsNoShop]": { name: "ClaimsNoShop", displayName: "Claims W/O Repair Shop", format: "#,0" },
};

/** Headline repair-shop metrics from the semantic model. */
export function repairShopKpis() {
    const query = `
EVALUATE
ROW(
    "ShopCount", DISTINCTCOUNT('Repair Shop'[Shop Name]),
    "ClaimCount", [Claim Count],
    "TotalAmount",
        SUMX(
            FILTER(
                VALUES('Repair Shop'[Shop Name]),
                NOT ISBLANK('Repair Shop'[Shop Name])
            ),
            [Total Claim Amount]
        ),
    "AvgRepairDays", AVERAGE('Repair Shop'[Avg Repair Days]),
    "ClaimsNoShop",
        [Claim Count]
        - SUMX(
            FILTER(
                VALUES('Repair Shop'[Shop Name]),
                NOT ISBLANK('Repair Shop'[Shop Name])
            ),
            [Claim Count]
        )
)
`.trim();

    return { connection, query, columnMetadata };
}
