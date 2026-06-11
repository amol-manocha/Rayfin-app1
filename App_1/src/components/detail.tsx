//-----------------------------------------------------------------------
// Small presentational primitives for the 360 detail pages — labeled
// fields, a page header with a status badge, and a back affordance.
//-----------------------------------------------------------------------

import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";

export function Field({
    label,
    children,
    className,
}: {
    label: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-col gap-xxs", className)}>
            <dt className="text-[length:var(--text-100)] font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </dt>
            <dd className="text-[length:var(--text-300)] font-medium text-foreground">
                {children ?? "—"}
            </dd>
        </div>
    );
}

export function FieldGrid({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <dl className={cn("grid grid-cols-2 gap-l", className)}>{children}</dl>
    );
}

export function BackButton() {
    const { crumbs, goToCrumb } = useRouter();
    if (crumbs.length < 2) return null;
    const prev = crumbs[crumbs.length - 2];
    return (
        <button
            type="button"
            onClick={() => goToCrumb(crumbs.length - 2)}
            className="inline-flex items-center gap-xs rounded-lg px-s py-xs text-[length:var(--text-200)] font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            <ArrowLeft className="icon-size-100" aria-hidden />
            Back to {prev.label}
        </button>
    );
}

export function PageHeader({
    eyebrow,
    title,
    badge,
    actions,
}: {
    eyebrow?: ReactNode;
    title: ReactNode;
    badge?: ReactNode;
    actions?: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-s">
            <BackButton />
            <div className="flex flex-wrap items-center justify-between gap-m">
                <div className="flex flex-col gap-xxs">
                    {eyebrow ? (
                        <span className="text-[length:var(--text-200)] font-semibold uppercase tracking-wide text-muted-foreground">
                            {eyebrow}
                        </span>
                    ) : null}
                    <div className="flex items-center gap-m">
                        <h1 className="text-[length:var(--text-hero-700)] font-semibold leading-hero-700 text-foreground">
                            {title}
                        </h1>
                        {badge}
                    </div>
                </div>
                {actions ? <div className="flex items-center gap-s">{actions}</div> : null}
            </div>
        </div>
    );
}
