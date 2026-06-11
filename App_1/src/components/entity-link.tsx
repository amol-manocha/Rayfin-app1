//-----------------------------------------------------------------------
// Click-through links to the 360 pages. Used everywhere a claim,
// customer, or adjuster identifier appears.
//-----------------------------------------------------------------------

import type { ReactNode } from "react";
import { useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";

const linkClass =
    "inline-flex max-w-full items-center gap-xs truncate rounded-sm text-left font-medium text-brand-foreground underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function ClaimLink({
    id,
    children,
    className,
}: {
    id: number;
    children?: ReactNode;
    className?: string;
}) {
    const { navigate } = useRouter();
    return (
        <button
            type="button"
            className={cn(linkClass, className)}
            onClick={(e) => {
                e.stopPropagation();
                navigate({ name: "claim", id, label: `Claim ${id}` });
            }}
        >
            {children ?? `Claim ${id}`}
        </button>
    );
}

export function CustomerLink({
    id,
    name,
    className,
}: {
    id: string;
    name: string;
    className?: string;
}) {
    const { navigate } = useRouter();
    return (
        <button
            type="button"
            className={cn(linkClass, className)}
            onClick={(e) => {
                e.stopPropagation();
                navigate({ name: "customer", id, label: name });
            }}
            title={name}
        >
            <span className="truncate">{name}</span>
        </button>
    );
}

export function AdjusterLink({
    id,
    name,
    className,
}: {
    id: number;
    name: string;
    className?: string;
}) {
    const { navigate } = useRouter();
    return (
        <button
            type="button"
            className={cn(linkClass, className)}
            onClick={(e) => {
                e.stopPropagation();
                navigate({ name: "adjuster", id, label: name });
            }}
            title={name}
        >
            <span className="truncate">{name}</span>
        </button>
    );
}
