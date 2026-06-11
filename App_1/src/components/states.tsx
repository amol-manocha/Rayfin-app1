//-----------------------------------------------------------------------
// Loading / empty / error states. Skeletons shimmer; empty states are
// plain-language; errors are calm with a retry affordance.
//-----------------------------------------------------------------------

import type { ReactNode } from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-lg bg-muted/80",
                className,
            )}
        />
    );
}

export function ChartSkeleton({ className }: { className?: string }) {
    const heights = ["h-2/5", "h-4/6", "h-3/6", "h-5/6", "h-3/5", "h-4/5", "h-2/5"];
    return (
        <div className={cn("flex h-full w-full flex-col gap-s p-xs", className)}>
            <Skeleton className="h-3 w-1/3" />
            <div className="flex flex-1 items-end gap-s pt-s">
                {heights.map((h, i) => (
                    <Skeleton key={i} className={cn("w-full self-end", h)} />
                ))}
            </div>
        </div>
    );
}

export function EmptyState({
    message = "No data available",
    icon,
    className,
}: {
    message?: string;
    icon?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex h-full min-h-(--leading-hero-1000) flex-col items-center justify-center gap-s p-l text-center",
                className,
            )}
        >
            <div className="text-muted-foreground/70">
                {icon ?? <Inbox className="icon-size-500" aria-hidden />}
            </div>
            <p className="text-[length:var(--text-300)] text-muted-foreground">
                {message}
            </p>
        </div>
    );
}

export function ErrorBanner({
    message,
    onRetry,
    className,
}: {
    message: string;
    onRetry?: () => void;
    className?: string;
}) {
    return (
        <div
            role="alert"
            className={cn(
                "flex items-start gap-s rounded-xl border border-destructive/30 bg-destructive/10 p-m text-[length:var(--text-200)] text-destructive",
                className,
            )}
        >
            <AlertTriangle className="icon-size-200 mt-xxs shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
                <p className="font-medium">Couldn't reach the claims model</p>
                <p className="mt-xxs break-words text-destructive/80">{message}</p>
            </div>
            {onRetry ? (
                <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex shrink-0 items-center gap-xs rounded-lg border border-destructive/40 px-s py-xxs font-medium text-destructive transition-colors hover:bg-destructive/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                >
                    <RefreshCw className="icon-size-100" aria-hidden />
                    Retry
                </button>
            ) : null}
        </div>
    );
}

/** Renders the right state for an async visual; children get the loaded body. */
export function QueryState({
    isLoading,
    isEmpty,
    error,
    onRetry,
    emptyMessage,
    skeleton,
    children,
}: {
    isLoading: boolean;
    isEmpty: boolean;
    error?: string;
    onRetry?: () => void;
    emptyMessage?: string;
    skeleton?: ReactNode;
    children: ReactNode;
}) {
    if (error) return <ErrorBanner message={error} onRetry={onRetry} />;
    if (isLoading) return <>{skeleton ?? <ChartSkeleton />}</>;
    if (isEmpty) return <EmptyState message={emptyMessage} />;
    return <>{children}</>;
}
