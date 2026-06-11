//-----------------------------------------------------------------------
// Convenience wrapper around useSemanticModelQuery that accepts a query
// factory result ({ connection, query, columnMetadata, ... }) and returns
// a ready-to-render DataTable plus normalized loading/error/empty state.
//-----------------------------------------------------------------------

import { useMemo } from "react";
import type { DataTable } from "@microsoft/fabric-visuals-core";
import { useSemanticModelQuery } from "./use-semantic-model-query";
import { toDataTable, type ColumnMetadataMap } from "@/lib/to-data-table";

interface VisualQueryInput {
    connection: string;
    query: string;
    columnMetadata: ColumnMetadataMap;
}

export interface VisualQueryResult {
    dataTable: DataTable | undefined;
    rows: ReadonlyArray<ReadonlyArray<unknown>>;
    isLoading: boolean;
    isEmpty: boolean;
    error: string | undefined;
    refetch: () => Promise<void>;
}

export function useVisualQuery(input: VisualQueryInput): VisualQueryResult {
    const { connection, query, columnMetadata } = input;
    const { data, isLoading, error, refetch } = useSemanticModelQuery({
        connection,
        query,
    });

    return useMemo(() => {
        const queryError =
            data?.status === "error" ? data.error.message : error?.message;
        const table =
            data?.status === "success" ? data.table : undefined;
        const dataTable = table
            ? toDataTable(table, columnMetadata)
            : undefined;
        const rows = table?.rows ?? [];
        return {
            dataTable,
            rows,
            isLoading,
            isEmpty: !isLoading && !queryError && rows.length === 0,
            error: queryError,
            refetch,
        };
    }, [data, isLoading, error, columnMetadata, refetch]);
}
