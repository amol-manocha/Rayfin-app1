import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { daxString } from "@/lib/dax";

const connection = "autoclaims";

const columnMetadata: ColumnMetadataMap = {
    "[OverallAvg]": { name: "OverallAvg", displayName: "Book average", format: "$#,0" },
    "[TypeAvg]": { name: "TypeAvg", displayName: "Type average", format: "$#,0" },
    "[TypeMax]": { name: "TypeMax", displayName: "Type maximum", format: "$#,0" },
};

/** Benchmarks a single claim against averages for its claim type and the book. */
export function claimContext(claimType: string) {
    const query = `
EVALUATE
ROW(
    "OverallAvg", [Average Claim Amount],
    "TypeAvg", CALCULATE([Average Claim Amount], 'Claim Type'[Claim Type Name] = ${daxString(claimType)}),
    "TypeMax", CALCULATE(MAX('Claims'[Claim Amount]), 'Claim Type'[Claim Type Name] = ${daxString(claimType)})
)`.trim();

    return { connection, query, columnMetadata };
}
