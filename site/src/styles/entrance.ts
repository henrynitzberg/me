import { keyframes } from "@emotion/react";

export const STAGGER_MS = 25; // gap between consecutive elements

// Entrance animation shared by the portfolio grid and the project pages.
//
// Never apply this to an element that already uses `transform` for something
// else (the portfolio thumbnails use `scale()` on hover) - transform is a
// single property, so one would silently clobber the other. Put it on a
// wrapper instead.
export const fadeUp = keyframes({
  from: { opacity: 0, transform: "translateY(14px)" },
  to: { opacity: 1, transform: "none" },
});

/**
 * Entrance styles for the nth element of a top-to-bottom cascade.
 * `both` fill mode is required: without it the element sits fully visible
 * through its delay, then snaps to opacity 0 when the animation starts.
 */
export const fadeUpSx = (index: number) => ({
  animation: `${fadeUp} 0.5s ease both`,
  animationDelay: `${index * STAGGER_MS}ms`,
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
  },
});
