//-----------------------------------------------------------------------
// Helpers for working with the positional rows returned by the Fabric SDK.
// Visuals consume the DataTable directly, but custom HTML (lists, headers,
// gauges) is easier to author against keyed row objects.
//-----------------------------------------------------------------------

import type { DataTable } from "@microsoft/fabric-visuals-core";

export type RowObject = Record<string, unknown>;

/** Convert a DataTable's positional rows into objects keyed by column name. */
export function tableToObjects(table: DataTable | undefined): RowObject[] {
    if (!table) return [];
    const names = table.columns.map((c) => c.name);
    return table.rows.map((row) => {
        const obj: RowObject = {};
        names.forEach((name, i) => {
            obj[name] = (row as ReadonlyArray<unknown>)[i];
        });
        return obj;
    });
}

/** First row of a DataTable as a keyed object (for single-row KPI queries). */
export function firstRowObject(table: DataTable | undefined): RowObject | undefined {
    const rows = tableToObjects(table);
    return rows[0];
}

export function num(value: unknown): number {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
}

export function str(value: unknown): string {
    return value == null ? "" : String(value);
}
