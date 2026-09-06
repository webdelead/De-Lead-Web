// @delead/ui — shared client components / hooks for the marketing sites.
// Prefer the per-file subpath import (`@delead/ui/reveal`) so a site only
// pulls what it uses; this barrel is for convenience.

export { ScrollStack } from "./scroll-stack";
export type { ScrollStackProps } from "./scroll-stack";

export { Reveal, useReveal } from "./reveal";
export type { RevealProps, UseRevealOptions } from "./reveal";

export { Counter, useCountUp } from "./counter";
export type { CounterProps, UseCountUpOptions } from "./counter";

export { useScrollNav } from "./use-scroll-nav";
export type { UseScrollNavOptions, ScrollNavState } from "./use-scroll-nav";

export { useDisclosure } from "./use-disclosure";
export type { UseDisclosureOptions } from "./use-disclosure";

export { Marquee } from "./marquee";
export type { MarqueeProps } from "./marquee";

export { LightboxProvider, LightboxImage, useLightbox } from "./lightbox";
export type { LightboxProviderProps, LightboxImageProps } from "./lightbox";

// ── Deferred to the owning site's migration branch, promoted here if a 2nd
//    site needs them (per docs/MIGRATION-CSS-TO-TAILWIND.md "as sites need them"):
//    · infinite auto-carousel      walk2lead  initInfiniteSlider (quotes, projects)
//    · drag-to-scrub strip         walk2lead  .press-track  /  deleadint .blog-row
//    · scroll-linked marquee row   makerchamps .marquee-row (eased)
//    · photo stack is-front/back   deleadint .vc-media  /  makerchamps hero
//    · scatter draggable photos    walk2lead .scatter-photo
//    · hover ripple                makerchamps hero photos
//    · hero slideshow              deleadint .b-photo-group
//    · gallery "Load more"         deleadint / walk2lead / corporate (per-site slot rhythm)
