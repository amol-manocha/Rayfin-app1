//-----------------------------------------------------------------------
// Lightweight in-app router. The app runs as a deeply-nested iframe inside
// the Fabric portal, so we avoid URL-based routing and keep navigation state
// in memory with a breadcrumb stack the user can retrace.
//-----------------------------------------------------------------------

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Route =
    | { name: "overview" }
    | { name: "repair-shops" }
    | { name: "claim"; id: number; label?: string }
    | { name: "customer"; id: string; label?: string }
    | { name: "adjuster"; id?: number; label?: string };

export interface Crumb {
    route: Route;
    label: string;
}

interface RouterContextValue {
    route: Route;
    crumbs: Crumb[];
    navigate: (route: Route) => void;
    goToCrumb: (index: number) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

const HOME: Crumb = { route: { name: "overview" }, label: "Book Overview" };

function defaultLabel(route: Route): string {
    switch (route.name) {
        case "overview":
            return "Book Overview";
        case "repair-shops":
            return "Repair Shops";
        case "claim":
            return route.label ?? `Claim ${route.id}`;
        case "customer":
            return route.label ?? "Customer";
        case "adjuster":
            return route.label ?? (route.id != null ? "Adjuster" : "Adjuster Directory");
    }
}

function sameRoute(a: Route, b: Route): boolean {
    if (a.name !== b.name) return false;
    if (a.name === "overview" || a.name === "repair-shops") return a.name === b.name;
    return String((a as { id?: unknown }).id) === String((b as { id?: unknown }).id);
}

export function RouterProvider({ children }: { children: ReactNode }) {
    const [crumbs, setCrumbs] = useState<Crumb[]>([HOME]);

    const navigate = useCallback((route: Route) => {
        if (route.name === "overview") {
            setCrumbs([HOME]);
            return;
        }
        setCrumbs((prev) => {
            const existing = prev.findIndex((c) => sameRoute(c.route, route));
            const crumb: Crumb = { route, label: defaultLabel(route) };
            if (existing >= 0) {
                const next = prev.slice(0, existing + 1);
                next[existing] = crumb;
                return next;
            }
            return [...prev, crumb];
        });
    }, []);

    const goToCrumb = useCallback((index: number) => {
        setCrumbs((prev) => (index <= 0 ? [HOME] : prev.slice(0, index + 1)));
    }, []);

    const route = crumbs[crumbs.length - 1].route;

    const value = useMemo(
        () => ({ route, crumbs, navigate, goToCrumb }),
        [route, crumbs, navigate, goToCrumb],
    );

    return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextValue {
    const ctx = useContext(RouterContext);
    if (!ctx) throw new Error("useRouter must be used within a RouterProvider");
    return ctx;
}
