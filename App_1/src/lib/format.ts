//-----------------------------------------------------------------------
// Shared display formatters — keep formatting consistent across the app.
//-----------------------------------------------------------------------

const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Currency with thousands separators, no decimals: $1,234,567 */
export function formatCurrency(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) return "—";
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
}

/** Compact currency for tight tiles: $1.2M, $850K */
export function formatCurrencyCompact(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) return "—";
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
}

/** Whole number with thousands separators: 1,234 */
export function formatNumber(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) return "—";
    return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/** Percentage to one decimal: 23.4% (expects a 0..1 ratio). */
export function formatPercent(value: number | null | undefined): string {
    if (value == null || Number.isNaN(value)) return "—";
    return `${(value * 100).toFixed(1)}%`;
}

/** Parse a value that may be a JS Date, ISO string, or m/d/yyyy string. */
export function parseDate(value: unknown): Date | null {
    if (value == null) return null;
    if (value instanceof Date) return value;
    const s = String(value).trim();
    if (!s) return null;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
}

/** Date as MMM D, YYYY: Jan 3, 2025 */
export function formatDate(value: unknown): string {
    const d = parseDate(value);
    if (!d) return "—";
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Month label MMM YYYY from a YYYY-MM key or date. */
export function formatMonthKey(key: string): string {
    const m = /^(\d{4})-(\d{2})/.exec(key);
    if (m) return `${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
    return key;
}
