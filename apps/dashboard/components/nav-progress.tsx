"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin top-of-viewport progress bar shown during client-side route
 * transitions, so clicking a nav link / anything that calls router.push
 * gives instant feedback even when the next page's server components are
 * slow to stream. No dependency — intercepts internal <a> (incl. next/link)
 * clicks + back/forward to know a navigation *started*, and watches the
 * pathname / search params to know when it *landed*. Code-driven
 * router.push() calls (pagination, filters) carry their own button
 * spinners, so they don't need this.
 */
export function NavProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [active, setActive] = useState(false);
  const hangTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // navigation landed → stop
  useEffect(() => {
    setActive(false);
    if (hangTimer.current) clearTimeout(hangTimer.current);
  }, [pathname, search]);

  useEffect(() => {
    const start = () => {
      setActive(true);
      if (hangTimer.current) clearTimeout(hangTimer.current);
      hangTimer.current = setTimeout(() => setActive(false), 10_000); // safety
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        a.target === "_blank" ||
        a.hasAttribute("download") ||
        a.getAttribute("rel")?.includes("external")
      )
        return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname.startsWith("/api/")) return; // downloads / endpoints, not routes
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };

    document.addEventListener("click", onClick, { capture: true });
    window.addEventListener("popstate", start);
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      window.removeEventListener("popstate", start);
      if (hangTimer.current) clearTimeout(hangTimer.current);
    };
  }, []);

  return (
    <div
      className={
        "pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden transition-opacity duration-300 " +
        (active ? "opacity-100" : "opacity-0")
      }
      role="progressbar"
      aria-label="Loading page"
      aria-hidden={!active}
    >
      <div className="nav-progress-track h-full w-2/5 bg-primary" />
    </div>
  );
}
