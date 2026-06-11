//-----------------------------------------------------------------------
// Sparkline — a compact smooth area+line with a soft gradient fill,
// used inside KPI tiles to make headline numbers feel alive.
//-----------------------------------------------------------------------

import { useId } from "react";
import { cn } from "@/lib/utils";

export function Sparkline({
    values,
    width = 120,
    height = 36,
    className,
}: {
    values: number[];
    width?: number;
    height?: number;
    className?: string;
}) {
    const gradientId = useId();
    if (!values || values.length < 2) {
        return <div className={cn("h-(--leading-hero-700)", className)} />;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const pad = 2;
    const innerH = height - pad * 2;

    const points = values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = pad + innerH - ((v - min) / span) * innerH;
        return [x, y] as const;
    });

    const line = points
        .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
        .join(" ");
    const area = `${line} L${width},${height} L0,${height} Z`;

    return (
        <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className={cn("h-(--leading-hero-700) w-full text-brand-foreground", className)}
            aria-hidden
        >
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={area} fill={`url(#${gradientId})`} stroke="none" />
            <path
                d={line}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
