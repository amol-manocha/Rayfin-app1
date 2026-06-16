import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./repair-shop-trend.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[MonthStart]": { name: "MonthStart", displayName: "Month" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Claim Amount", format: "$#,0" },
    "[ShopCount]": { name: "ShopCount", displayName: "Repair Shops", format: "#,0" },
    "[AvgRepairDays]": { name: "AvgRepairDays", displayName: "Avg Repair Days", format: "#,0.0" },
    "[NoShopCount]": { name: "NoShopCount", displayName: "Claims W/O Repair Shop", format: "#,0" },
    "[MonthLabel]": { name: "MonthLabel", displayName: "Month" },
};

/**
 * Monthly series for the repair-shop KPIs. Powers the sparklines and the
 * period-over-period delta shown on each metric tile.
 */
export function repairShopKpiTrend() {
    return { connection, query: baseQuery, columnMetadata };
}
