//-----------------------------------------------------------------------
// Helpers for safely composing parameterized DAX queries.
//-----------------------------------------------------------------------

/** Escape a string for use as a DAX string literal (wraps in double quotes). */
export function daxString(value: string): string {
    return `"${value.replace(/"/g, '""')}"`;
}

/** Coerce a value to a DAX integer literal, guarding against injection. */
export function daxInt(value: number): string {
    return String(Math.trunc(value));
}
