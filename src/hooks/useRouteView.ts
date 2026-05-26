import { useCallback, useEffect, useMemo, useState } from "react";
import type { ViewId } from "../types";

export const viewRoutes: Record<ViewId, string> = {
  dashboard: "/dashboard",
  transactions: "/transactions",
  analytics: "/analytics",
  budgets: "/budgets",
  categories: "/categories",
  settings: "/settings"
};

const routeViews = Object.fromEntries(Object.entries(viewRoutes).map(([view, path]) => [path, view])) as Record<string, ViewId>;

export const getViewFromPath = (path: string): ViewId => routeViews[path] ?? "dashboard";

export function useRouteView() {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  const navigate = useCallback((view: ViewId) => {
    const nextPath = viewRoutes[view];

    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }

    setPath(nextPath);
  }, []);

  const replace = useCallback((nextPath: string) => {
    window.history.replaceState({}, "", nextPath);
    setPath(nextPath);
  }, []);

  return useMemo(
    () => ({
      activeView: getViewFromPath(path),
      path,
      navigate,
      replace
    }),
    [navigate, path, replace]
  );
}
