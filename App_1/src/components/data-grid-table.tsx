//-----------------------------------------------------------------------
// A calm, themeable data grid built on a plain HTML table. Gives us full
// control over status badges, entity links, currency alignment, and row
// click-through without depending on a heavier grid component.
//-----------------------------------------------------------------------

import { useMemo, useState, type ReactNode } from "react";
import { ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { RowObject } from "@/lib/rows";
import { cn } from "@/lib/utils";

export interface GridColumn {
    key: string;
    header: ReactNode;
    align?: "left" | "right" | "center";
    render?: (row: RowObject) => ReactNode;
    headerClassName?: string;
    cellClassName?: string;
    tabular?: boolean;
    /** When true, the header becomes clickable to sort by this column. */
    sortable?: boolean;
    /**
     * Value used when sorting this column. Defaults to the raw `row[key]`.
     * Provide this for numeric columns so they sort by magnitude, e.g.
     * `sortAccessor: (r) => num(r.OpenAmount)`.
     */
    sortAccessor?: (row: RowObject) => string | number | null | undefined;
}

type SortDir = "asc" | "desc";
interface SortState {
    key: string;
    dir: SortDir;
}

const alignClass: Record<NonNullable<GridColumn["align"]>, string> = {
    left: "text-left",
    right: "text-right",
    center: "text-center",
};

/** Compare two sort values: numbers numerically, everything else as text. Nulls sort last. */
function compareValues(a: unknown, b: unknown): number {
    const aNull = a == null || a === "";
    const bNull = b == null || b === "";
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return String(a).localeCompare(String(b), undefined, {
        numeric: true,
        sensitivity: "base",
    });
}

export function DataGridTable({
    rows,
    columns,
    onRowClick,
    getRowKey,
    className,
    emptyMessage = "No rows",
}: {
    rows: RowObject[];
    columns: GridColumn[];
    onRowClick?: (row: RowObject) => void;
    getRowKey?: (row: RowObject, index: number) => string;
    className?: string;
    emptyMessage?: string;
}) {
    const clickable = Boolean(onRowClick);
    const [sort, setSort] = useState<SortState | null>(null);

    function toggleSort(col: GridColumn) {
        if (!col.sortable) return;
        setSort((prev) =>
            prev && prev.key === col.key
                ? { key: col.key, dir: prev.dir === "asc" ? "desc" : "asc" }
                : { key: col.key, dir: "asc" },
        );
    }

    const sortedRows = useMemo(() => {
        if (!sort) return rows;
        const col = columns.find((c) => c.key === sort.key);
        if (!col) return rows;
        const accessor =
            col.sortAccessor ?? ((r: RowObject) => r[col.key] as unknown);
        const factor = sort.dir === "asc" ? 1 : -1;
        return [...rows].sort(
            (a, b) => compareValues(accessor(a), accessor(b)) * factor,
        );
    }, [rows, columns, sort]);

    return (
        <div className={cn("min-h-0 flex-1 overflow-auto", className)}>
            <table className="w-full border-collapse text-[length:var(--text-200)]">
                <thead className="sticky top-0 z-10 bg-card">
                    <tr className="border-b border-border">
                        {columns.map((col) => {
                            const isSorted = sort?.key === col.key;
                            const baseHeaderClass = cn(
                                "whitespace-nowrap font-semibold uppercase tracking-wide text-[length:var(--text-100)] text-muted-foreground",
                                alignClass[col.align ?? "left"],
                                col.headerClassName,
                            );

                            if (!col.sortable) {
                                return (
                                    <th
                                        key={col.key}
                                        scope="col"
                                        className={cn("px-m py-s", baseHeaderClass)}
                                    >
                                        {col.header}
                                    </th>
                                );
                            }

                            return (
                                <th
                                    key={col.key}
                                    scope="col"
                                    aria-sort={
                                        isSorted
                                            ? sort?.dir === "asc"
                                                ? "ascending"
                                                : "descending"
                                            : "none"
                                    }
                                    className={cn("group p-0", baseHeaderClass)}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleSort(col)}
                                        className={cn(
                                            "flex w-full items-center gap-xs px-m py-s font-semibold uppercase tracking-wide text-inherit transition-colors hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                                            col.align === "right" && "justify-end",
                                            col.align === "center" && "justify-center",
                                        )}
                                    >
                                        <span>{col.header}</span>
                                        {isSorted ? (
                                            sort?.dir === "asc" ? (
                                                <ChevronUp className="icon-size-100 text-brand-foreground" aria-hidden />
                                            ) : (
                                                <ChevronDown className="icon-size-100 text-brand-foreground" aria-hidden />
                                            )
                                        ) : (
                                            <ChevronsUpDown
                                                className="icon-size-100 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
                                                aria-hidden
                                            />
                                        )}
                                    </button>
                                </th>
                            );
                        })}
                        {clickable ? <th className="w-(--spacing-xl)" aria-hidden /> : null}
                    </tr>
                </thead>
                <tbody>
                    {sortedRows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + (clickable ? 1 : 0)}
                                className="px-m py-l text-center text-muted-foreground"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        sortedRows.map((row, i) => (
                            <tr
                                key={getRowKey ? getRowKey(row, i) : i}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                className={cn(
                                    "border-b border-border/60 transition-colors last:border-0",
                                    clickable && "cursor-pointer hover:bg-hover",
                                )}
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={cn(
                                            "px-m py-s align-middle text-foreground",
                                            alignClass[col.align ?? "left"],
                                            col.tabular && "tabular",
                                            col.cellClassName,
                                        )}
                                    >
                                        {col.render
                                            ? col.render(row)
                                            : asText(row[col.key])}
                                    </td>
                                ))}
                                {clickable ? (
                                    <td className="px-s text-muted-foreground/50">
                                        <ChevronRight className="icon-size-100" aria-hidden />
                                    </td>
                                ) : null}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function asText(value: unknown): ReactNode {
    if (value == null) return "—";
    return String(value);
}
