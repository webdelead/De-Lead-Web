"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/**
 * The click-an-image / click-the-backdrop lightbox (`#lightbox` + `#lightbox-img`,
 * `.open`) in walk2lead / deleadint / makerchamps / corporate main.js. One
 * <LightboxProvider> near the page root; call `useLightbox().open(src, alt)`
 * from any gallery image, or drop in <LightboxImage>.
 */
interface LightboxCtx {
  open: (src: string, alt?: string) => void;
  close: () => void;
}
const Ctx = createContext<LightboxCtx | null>(null);

export function useLightbox(): LightboxCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLightbox must be used within <LightboxProvider>");
  return ctx;
}

export interface LightboxProviderProps {
  children: ReactNode;
  /** Backdrop colour. w2l rgba(20,10,16,.94) · corporate rgba(28,20,23,.94) · mc rgba(10,10,10,.94). */
  backdrop?: string;
  /** Max image height. Default "88vh" (all sites). */
  maxImageHeight?: string;
  className?: string;
}

export function LightboxProvider({
  children,
  backdrop = "rgba(20, 10, 16, 0.94)",
  maxImageHeight = "88vh",
  className,
}: LightboxProviderProps) {
  const [state, setState] = useState<{ src: string; alt: string } | null>(null);

  const open = useCallback((src: string, alt = "") => setState({ src, alt }), []);
  const close = useCallback(() => setState(null), []);

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state, close]);

  const overlay: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: backdrop,
    zIndex: 200,
    display: "grid",
    placeItems: "center",
    padding: 30,
    cursor: "zoom-out",
  };

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      {state ? (
        <div
          className={className}
          style={overlay}
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.src}
            alt={state.alt}
            style={{ maxHeight: maxImageHeight, maxWidth: "100%", borderRadius: 12 }}
          />
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

export interface LightboxImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  loading?: "lazy" | "eager";
}

/** A gallery <img> that opens itself in the lightbox on click. */
export function LightboxImage({
  src,
  alt = "",
  className,
  style,
  loading = "lazy",
}: LightboxImageProps) {
  const { open } = useLightbox();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ cursor: "zoom-in", ...style }}
      loading={loading}
      onClick={() => open(src, alt)}
    />
  );
}
