//-----------------------------------------------------------------------
// App shell — a fixed left navigation rail and a top bar holding the
// breadcrumb trail, global search, and the light/dark toggle. The page
// content scrolls within the main region.
//-----------------------------------------------------------------------

import type { ReactNode } from "react";
import { useState } from "react";
import {
    LayoutDashboard,
    Moon,
    PanelLeftClose,
    PanelLeftOpen,
    ShieldCheck,
    Sun,
    Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlobalSearch } from "@/components/global-search";
import { useRouter, type Route } from "@/lib/router";
import { useThemeContext } from "@/hooks/theme.context";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    icon: typeof LayoutDashboard;
    route: Route;
    matches: (route: Route) => boolean;
}

const NAV_ITEMS: NavItem[] = [
    {
        label: "Book Overview",
        icon: LayoutDashboard,
        route: { name: "overview" },
        matches: (r) => r.name === "overview" || r.name === "claim" || r.name === "customer",
    },
    {
        label: "Adjuster Directory",
        icon: Users,
        route: { name: "adjuster" },
        matches: (r) => r.name === "adjuster",
    },
];

export function AppShell({ children }: { children: ReactNode }) {
    const { route, navigate } = useRouter();
    const { isDark, toggleTheme } = useThemeContext();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex h-full w-full overflow-hidden bg-background text-foreground">
            <aside
                className={cn(
                    "flex shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200",
                    collapsed ? "w-[68px]" : "w-[240px]",
                )}
            >
                <div className="flex items-center gap-s px-m py-l">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <ShieldCheck className="icon-size-300" aria-hidden />
                    </div>
                    {!collapsed ? (
                        <div className="min-w-0">
                            <p className="truncate text-[length:var(--text-300)] font-semibold leading-300 text-foreground">
                                Claims Insight
                            </p>
                            <p className="truncate text-[length:var(--text-100)] text-muted-foreground">
                                Investigation workbench
                            </p>
                        </div>
                    ) : null}
                </div>

                <nav className="flex flex-1 flex-col gap-xxs px-s py-s">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = item.matches(route);
                        return (
                            <button
                                key={item.label}
                                type="button"
                                title={item.label}
                                onClick={() => navigate(item.route)}
                                className={cn(
                                    "flex items-center gap-s rounded-xl px-m py-s text-left text-[length:var(--text-300)] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    active
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-hover hover:text-foreground",
                                    collapsed && "justify-center px-0",
                                )}
                            >
                                <Icon className="icon-size-200 shrink-0" aria-hidden />
                                {!collapsed ? <span className="truncate">{item.label}</span> : null}
                            </button>
                        );
                    })}
                </nav>

                <button
                    type="button"
                    onClick={() => setCollapsed((c) => !c)}
                    aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
                    className={cn(
                        "m-s flex items-center gap-s rounded-xl px-m py-s text-[length:var(--text-200)] text-muted-foreground transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        collapsed && "justify-center px-0",
                    )}
                >
                    {collapsed ? (
                        <PanelLeftOpen className="icon-size-200" aria-hidden />
                    ) : (
                        <>
                            <PanelLeftClose className="icon-size-200" aria-hidden />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex items-center gap-l border-b border-border bg-card/80 px-l py-m backdrop-blur">
                    <div className="min-w-0 flex-1">
                        <Breadcrumbs />
                    </div>
                    <GlobalSearch />
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {isDark ? (
                            <Sun className="icon-size-200" aria-hidden />
                        ) : (
                            <Moon className="icon-size-200" aria-hidden />
                        )}
                    </button>
                </header>

                <main className="min-h-0 flex-1 overflow-auto p-l">{children}</main>
            </div>
        </div>
    );
}
