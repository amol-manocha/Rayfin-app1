//-----------------------------------------------------------------------
// Card primitives — the app's surface for every panel. Subtle 1px border,
// soft shadow, generous padding. Light and clean per the design brief.
//-----------------------------------------------------------------------

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                "flex flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
                className,
            )}
        >
            {children}
        </div>
    );
}

export function CardHeader({
    title,
    subtitle,
    action,
    className,
}: {
    title: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "flex items-start justify-between gap-m px-l pt-l pb-s",
                className,
            )}
        >
            <div className="min-w-0">
                <h3 className="truncate text-[length:var(--text-400)] font-semibold leading-500 text-foreground">
                    {title}
                </h3>
                {subtitle ? (
                    <p className="mt-xxs text-[length:var(--text-200)] text-muted-foreground">
                        {subtitle}
                    </p>
                ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}

export function CardContent({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn("flex min-h-0 flex-1 flex-col px-l pb-l", className)}>
            {children}
        </div>
    );
}
