import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import barSpec from "@/queries/repair-shops/repair-shop-specialty-bar.json";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "Repair Shop[Specialty]": { name: "Specialty", displayName: "Specialty" },
    "[ClaimCount]": { name: "ClaimCount", displayName: "Claims", format: "#,0" },
    "[TotalAmount]": { name: "TotalAmount", displayName: "Claim Amount", format: "$#,0" },
};

/** Claim volume by repair-shop specialty (excludes unassigned claims). */
export function repairShopSpecialtyMix() {
    const query = `
EVALUATE
FILTER(
    SUMMARIZECOLUMNS(
        'Repair Shop'[Specialty],
        "ClaimCount", [Claim Count],
        "TotalAmount", [Total Claim Amount]
    ),
    NOT ISBLANK('Repair Shop'[Specialty])
)
ORDER BY [ClaimCount] DESC
`.trim();

    return {
        connection,
        query,
        columnMetadata,
        vegaLiteSpec: barSpec as unknown as VisualizationSpec,
    };
}
