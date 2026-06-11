//-----------------------------------------------------------------------
// ChartCard — wraps a query factory result in a Card with the full height
// chain, loading/empty/error handling, and a themed VegaVisual.
//-----------------------------------------------------------------------

import type { ReactNode } from "react";
import {
    VegaVisual,
    useCssTheme,
    type VisualizationSpec,
    type VegaLiteConfig,
} from "@microsoft/fabric-visuals";
import type {
    ColumnMetadataMap,
} from "@/lib/to-data-table";
import type { InteractionEvent } from "@microsoft/fabric-visuals-core";
import { Card, CardHeader, CardContent } from "./card";
import { QueryState } from "./states";
import { useVisualQuery } from "@/hooks/use-visual-query";
import { cn } from "@/lib/utils";

export interface ChartSpec {
    connection: string;
    query: string;
    columnMetadata: ColumnMetadataMap;
    vegaLiteSpec: VisualizationSpec;
}

export function ChartCard({
    title,
    subtitle,
    action,
    chart,
    configVegaLite,
    onInteraction,
    emptyMessage,
    className,
    bodyClassName,
}: {
    title: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
    chart: ChartSpec;
    configVegaLite?: VegaLiteConfig;
    onInteraction?: (events: InteractionEvent[]) => void;
    emptyMessage?: string;
    className?: string;
    bodyClassName?: string;
}) {
    const theme = useCssTheme();
    const { dataTable, isLoading, isEmpty, error, refetch } = useVisualQuery(chart);

    return (
        <Card className={cn("h-full overflow-visible", className)}>
            <CardHeader title={title} subtitle={subtitle} action={action} />
            <CardContent className="overflow-visible">
                <div
                    className={cn(
                        "flex min-h-0 flex-1 flex-col overflow-visible",
                        bodyClassName,
                    )}
                >
                    <QueryState
                        isLoading={isLoading}
                        isEmpty={isEmpty}
                        error={error}
                        onRetry={refetch}
                        emptyMessage={emptyMessage}
                    >
                        {dataTable ? (
                            <VegaVisual
                                spec={chart.vegaLiteSpec}
                                data={dataTable}
                                theme={theme}
                                configVegaLite={configVegaLite}
                                onInteraction={onInteraction}
                                style={{ width: "100%", height: "100%" }}
                            />
                        ) : null}
                    </QueryState>
                </div>
            </CardContent>
        </Card>
    );
}
