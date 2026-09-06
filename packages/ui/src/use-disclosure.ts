"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

/**
 * Open/close state for the mobile nav drawer (deleadint, makerchamps,
 * corporate, dli-education) and the deleadint ecosystem dropdown — the
 * `.open` / `.is-open` toggles + outside-click + Esc + body-scroll-lock +
 * (dropdown only) hover-to-open above a breakpoint.
 */
export interface UseDisclosureOptions {
  initial?: boolean;
  /** Close when a click lands outside `rootRef`. Default true. */
  closeOnOutsideClick?: boolean;
  /** Close on Escape. Default true. */
  closeOnEsc?: boolean;
  /** Set body overflow:hidden while open (mobile drawers). Default false. */
  lockScroll?: boolean;
  /** Above this viewport width, pointer enter/leave on the root open/close it
   *  (deleadint ecosystem dropdown uses 860). 0 = never. Default 0. */
  hoverOpenAbove?: number;
  onOpenChange?: (open: boolean) => void;
}

export function useDisclosure(options: UseDisclosureOptions = {}) {
  const {
    initial = false,
    closeOnOutsideClick = true,
    closeOnEsc = true,
    lockScroll = false,
    hoverOpenAbove = 0,
    onOpenChange,
  } = options;

  const [open, setOpenState] = useState(initial);
  const rootRef = useRef<HTMLElement | null>(null);
  const cbRef = useRef(onOpenChange);
  cbRef.current = onOpenChange;

  const setOpen = useCallback((next: boolean) => {
    setOpenState((prev) => {
      if (prev === next) return prev;
      cbRef.current?.(next);
      return next;
    });
  }, []);
  const toggle = useCallback(() => setOpen(!open), [open, setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!open) return;

    const onDocClick = (e: MouseEvent) => {
      if (!closeOnOutsideClick) return;
      const root = rootRef.current;
      if (root && !root.contains(e.target as Node)) close();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (closeOnEsc && e.key === "Escape") close();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, closeOnOutsideClick, closeOnEsc, close]);

  useEffect(() => {
    if (!lockScroll) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, lockScroll]);

  const hoverProps =
    hoverOpenAbove > 0
      ? {
          onMouseEnter: () => {
            if (window.innerWidth > hoverOpenAbove) setOpen(true);
          },
          onMouseLeave: () => {
            if (window.innerWidth > hoverOpenAbove) setOpen(false);
          },
        }
      : {};

  return {
    open,
    setOpen,
    toggle,
    close,
    /** Spread onto the wrapper that both trigger and content live inside. */
    rootProps: { ref: rootRef as React.Ref<HTMLElement>, ...hoverProps },
    /** Spread onto the trigger button. */
    triggerProps: {
      "aria-expanded": open,
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        toggle();
      },
      onKeyDown: (e: ReactKeyboardEvent) => {
        if (closeOnEsc && e.key === "Escape") close();
      },
    },
  };
}
