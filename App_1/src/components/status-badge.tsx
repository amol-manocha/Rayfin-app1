//-----------------------------------------------------------------------
// Status badge — also doubles as a toggleable filter chip on list screens.
//-----------------------------------------------------------------------

import { cn } from "@/lib/utils";
import {
    STATUS_BADGE_CLASS,
    STATUS_SOFT_CLASS,
    STATUS_DOT_CLASS,
    isClaimStatus,
    type ClaimStatus,
} from "@/lib/status";

export function StatusBadge({
    status,
    soft = false,
    className,
}: {
    status: string;
    soft?: boolean;
    className?: string;
}) {
    const known = isClaimStatus(status);
    const tone = known
        ? (soft ? STATUS_SOFT_CLASS : STATUS_BADGE_CLASS)[status as ClaimStatus]
        : "bg-muted text-muted-foreground";
    return (
        <span
            className={cn(
                "inline-flex items-center gap-xs rounded-full px-s py-xxs text-[length:var(--text-200)] font-semibold leading-none",
                tone,
                className,
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "size-(--spacing-s) rounded-full",
                    soft && known ? "bg-current opacity-80" : "bg-current opacity-90",
                )}
            />
            {status}
        </span>
    );
}

/** Toggleable status chip used as a filter control. */
export function StatusChip({
    status,
    active,
    onToggle,
}: {
    status: ClaimStatus;
    active: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onToggle}
            className={cn(
                "inline-flex items-center gap-xs rounded-full border px-m py-xs text-[length:var(--text-200)] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                    ? STATUS_BADGE_CLASS[status] + " border-transparent"
                    : "border-border bg-card text-muted-foreground hover:bg-hover",
            )}
        >
            <span
                aria-hidden
                className={cn(
                    "size-(--spacing-s) rounded-full",
                    active ? "bg-current opacity-90" : STATUS_DOT_CLASS[status],
                )}
            />
            {status}
        </button>
    );
}
