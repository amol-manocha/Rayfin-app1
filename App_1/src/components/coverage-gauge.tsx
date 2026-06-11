//-----------------------------------------------------------------------
// Coverage utilization gauge — a radial progress arc showing claim amount
// as a share of the policy coverage limit. Turns red when over limit.
//-----------------------------------------------------------------------

import { AlertTriangle } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CoverageGauge({
    used,
    limit,
    size = 168,
    stroke = 14,
    className,
}: {
    used: number;
    limit: number;
    size?: number;
    stroke?: number;
    className?: string;
}) {
    const ratio = limit > 0 ? used / limit : 0;
    const over = ratio > 1;
    const frac = Math.max(0, Math.min(ratio, 1));

    const r = (size - stroke) / 2;
    const c = size / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - frac);

    const progressColor = over
        ? "var(--color-alert)"
        : "var(--color-positive)";

    return (
        <div className={cn("flex flex-col items-center gap-s", className)}>
            <div
                className="relative"
                style={{ width: size, height: size }}
                role="img"
                aria-label={`Coverage utilization ${formatPercent(ratio)}${over ? ", over limit" : ""}`}
            >
                <svg width={size} height={size} className="-rotate-90">
                    <circle
                        cx={c}
                        cy={c}
                        r={r}
                        fill="none"
                        stroke="var(--color-muted)"
                        strokeWidth={stroke}
                    />
                    <circle
                        cx={c}
                        cy={c}
                        r={r}
                        fill="none"
                        stroke={progressColor}
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-[stroke-dashoffset] duration-700 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className={cn(
                            "tabular text-[length:var(--text-600)] font-semibold leading-600",
                            over ? "text-alert" : "text-foreground",
                        )}
                    >
                        {formatPercent(ratio)}
                    </span>
                    <span className="text-[length:var(--text-100)] uppercase tracking-wide text-muted-foreground">
                        of limit
                    </span>
                </div>
            </div>

            <div className="text-center">
                <p className="tabular text-[length:var(--text-300)] font-semibold text-foreground">
                    {formatCurrency(used)}{" "}
                    <span className="font-normal text-muted-foreground">
                        / {formatCurrency(limit)}
                    </span>
                </p>
                {over ? (
                    <p className="mt-xxs inline-flex items-center gap-xs text-[length:var(--text-200)] font-semibold text-alert">
                        <AlertTriangle className="icon-size-100" aria-hidden />
                        Exceeds coverage limit
                    </p>
                ) : (
                    <p className="mt-xxs text-[length:var(--text-200)] text-positive">
                        Within coverage limit
                    </p>
                )}
            </div>
        </div>
    );
}
