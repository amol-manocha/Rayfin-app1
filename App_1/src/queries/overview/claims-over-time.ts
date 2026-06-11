import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import baseQuery from "./claims-over-time.dax?raw";
import spec from "./claims-over-time.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[MonthStart]": { name: "MonthStart", displayName: "Month" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Claim Amount", format: "$#,0" },
    "[MonthLabel]": { name: "MonthLabel", displayName: "Month" },
};

export type TrendMetric = "volume" | "amount";

interface ClaimsOverTimeParams {
    metric?: TrendMetric;
}

/** Smooth area chart of claim volume or amount over time, toggled by metric. */
export function claimsOverTime(params?: ClaimsOverTimeParams) {
    const metric = params?.metric ?? "volume";
    const field = metric === "amount" ? "TotalAmount" : "ClaimCount";
    const title = metric === "amount" ? "Claim Amount" : "Claims";

    const cloned = structuredClone(spec) as unknown as Record<string, unknown>;
    const encoding = cloned.encoding as Record<string, Record<string, unknown>>;
    (encoding.y as Record<string, unknown>).field = field;
    encoding.tooltip = [
        { field: "MonthLabel", type: "nominal", title: "Month" },
        { field, type: "quantitative", title },
    ] as unknown as Record<string, unknown>;

    return {
        connection,
        query: baseQuery,
        columnMetadata,
        vegaLiteSpec: cloned as unknown as VisualizationSpec,
    };
}
