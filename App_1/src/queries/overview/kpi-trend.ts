import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./kpi-trend.dax?raw";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[MonthStart]": { name: "MonthStart", displayName: "Month" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Claim Amount", format: "$#,0" },
    "[OpenCount]": { name: "OpenCount", displayName: "Open Claims", format: "#,0" },
    "[Exposure]": { name: "Exposure", displayName: "Exposure", format: "$#,0" },
    "[MonthLabel]": { name: "MonthLabel", displayName: "Month" },
};

/**
 * Monthly series for every headline KPI. Powers the sparklines and the
 * period-over-period delta shown on each metric tile.
 */
export function overviewKpiTrend() {
    return { connection, query: baseQuery, columnMetadata };
}
