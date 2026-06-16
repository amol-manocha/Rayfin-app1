import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxInt } from "@/lib/dax";
import areaSpec from "@/queries/_shared/area-time.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[MonthStart]": { name: "MonthStart", displayName: "Month" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Claim Amount", format: "$#,0" },
    "[MonthLabel]": { name: "MonthLabel", displayName: "Month" },
};

export type TrendMetric = "volume" | "amount";

/** Monthly workload for a single adjuster, area chart by volume or amount. */
export function adjusterOverTime(adjusterId: number, metric: TrendMetric = "volume") {
    const query = `
EVALUATE
ADDCOLUMNS(
    GROUPBY(
        ADDCOLUMNS(
            FILTER('Claims', 'Claims'[Adjuster ID] = ${daxInt(adjusterId)}),
            "MonthStart", DATE(YEAR('Claims'[Claim Date]), MONTH('Claims'[Claim Date]), 1)
        ),
        [MonthStart],
        "ClaimCount", SUMX(CURRENTGROUP(), 1),
        "TotalAmount", SUMX(CURRENTGROUP(), 'Claims'[Claim Amount])
    ),
    "MonthLabel", FORMAT([MonthStart], "MMM YYYY")
)
ORDER BY [MonthStart]`.trim();

    const field = metric === "amount" ? "TotalAmount" : "ClaimCount";
    const cloned = structuredClone(areaSpec) as unknown as Record<string, unknown>;
    const encoding = cloned.encoding as Record<string, Record<string, unknown>>;
    (encoding.y as Record<string, unknown>).field = field;

    return {
        connection,
        query,
        columnMetadata,
        vegaLiteSpec: cloned as unknown as VisualizationSpec,
    };
}
