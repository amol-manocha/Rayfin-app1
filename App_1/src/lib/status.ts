//-----------------------------------------------------------------------
// Claim status semantics — colors, ordering, and helpers shared by
// badges, filter chips, donut charts, and stacked bars.
//-----------------------------------------------------------------------

export type ClaimStatus = "Open" | "Under Review" | "Closed";

export const CLAIM_STATUSES: ClaimStatus[] = ["Open", "Under Review", "Closed"];

/** Canonical hex used inside Vega-Lite scale ranges (specs can't read CSS vars). */
export const STATUS_HEX: Record<ClaimStatus, string> = {
    Open: "#b7791f",
    "Under Review": "#2563eb",
    Closed: "#15803d",
};

/** Tailwind token classes for badge fills (resolve to theme tokens in global.css). */
export const STATUS_BADGE_CLASS: Record<ClaimStatus, string> = {
    Open: "bg-status-open text-status-open-foreground",
    "Under Review": "bg-status-review text-status-review-foreground",
    Closed: "bg-status-closed text-status-closed-foreground",
};

/** Soft tinted background + colored text, used for chips and inline accents. */
export const STATUS_SOFT_CLASS: Record<ClaimStatus, string> = {
    Open: "bg-status-open-soft text-status-open",
    "Under Review": "bg-status-review-soft text-status-review",
    Closed: "bg-status-closed-soft text-status-closed",
};

/** Strong status color applied as a background (for dots / accents). */
export const STATUS_DOT_CLASS: Record<ClaimStatus, string> = {
    Open: "bg-status-open",
    "Under Review": "bg-status-review",
    Closed: "bg-status-closed",
};

export function isClaimStatus(value: unknown): value is ClaimStatus {
    return value === "Open" || value === "Under Review" || value === "Closed";
}

export function statusHex(value: unknown): string {
    return isClaimStatus(value) ? STATUS_HEX[value] : "#5b6472";
}
