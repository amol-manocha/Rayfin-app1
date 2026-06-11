//-----------------------------------------------------------------------
// Breadcrumb trail — lets investigators retrace their path
// (Book Overview › Customer 360 › Claim 6915).
//-----------------------------------------------------------------------

import { ChevronRight } from "lucide-react";
import { useRouter } from "@/lib/router";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
    const { crumbs, goToCrumb } = useRouter();

    return (
        <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex items-center gap-xxs overflow-hidden">
                {crumbs.map((crumb, i) => {
                    const isLast = i === crumbs.length - 1;
                    return (
                        <li key={i} className="flex min-w-0 items-center gap-xxs">
                            {i > 0 ? (
                                <ChevronRight
                                    className="icon-size-100 shrink-0 text-muted-foreground/60"
                                    aria-hidden
                                />
                            ) : null}
                            {isLast ? (
                                <span
                                    aria-current="page"
                                    className="truncate text-[length:var(--text-200)] font-semibold text-foreground"
                                >
                                    {crumb.label}
                                </span>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => goToCrumb(i)}
                                    className={cn(
                                        "truncate rounded-sm text-[length:var(--text-200)] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    )}
                                >
                                    {crumb.label}
                                </button>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
