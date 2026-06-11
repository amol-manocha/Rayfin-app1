//-----------------------------------------------------------------------
// Animates a number from 0 to its target with an ease-out curve.
// Respects prefers-reduced-motion.
//-----------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, durationMs = 900): number {
    const [value, setValue] = useState(0);
    const frame = useRef<number>(0);
    const startTs = useRef<number>(0);
    const from = useRef<number>(0);

    useEffect(() => {
        const reduce =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce || !Number.isFinite(target)) {
            setValue(target);
            return;
        }

        from.current = 0;
        startTs.current = 0;

        const tick = (ts: number) => {
            if (!startTs.current) startTs.current = ts;
            const elapsed = ts - startTs.current;
            const t = Math.min(elapsed / durationMs, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setValue(from.current + (target - from.current) * eased);
            if (t < 1) frame.current = requestAnimationFrame(tick);
        };

        frame.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame.current);
    }, [target, durationMs]);

    return value;
}
