import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

const LAYERS = 12;
const MAX_BLUR = 4;
const FADE_HEIGHT = 32;

type Direction = "top" | "bottom";

// Ported from ai_policy_db's BlurBox, adapted from `position: absolute`
// bands inside an `overflow: auto` content container to `position: fixed`
// bands anchored to the viewport - this site scrolls the whole window
// rather than an inner scroll container, so there's no single element for
// an absolute band to be positioned within.
//
// Each layer blurs a progressively larger amount and is masked to a
// progressively shorter band right at the edge, so the blur intensifies
// the closer content gets to the edge rather than applying uniformly - a
// single backdrop-filter: blur() over the whole fade region would just
// look like one flat smudge, not a graduated one. The solid color fade on
// top (to the theme's own background, not transparent) hides the seam
// where the blur layers stop, the same way the original does.
function progressiveBlurLayers(direction: Direction, offset: number) {
  return Array.from({ length: LAYERS }, (_, i) => {
    const blur = MAX_BLUR * (i / (LAYERS - 1));
    const height = FADE_HEIGHT * ((LAYERS - i) / LAYERS);
    const gradient =
      direction === "top"
        ? "linear-gradient(to bottom, black 30%, transparent 100%)"
        : "linear-gradient(to top, black 30%, transparent 100%)";

    return (
      <Box
        key={i}
        sx={{
          position: "fixed",
          [direction]: direction === "top" ? offset : 0,
          left: 0,
          right: 0,
          height,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: gradient,
          WebkitMaskImage: gradient,
          pointerEvents: "none",
          zIndex: (theme: Theme) => theme.zIndex.appBar - 1,
        }}
      />
    );
  });
}

function opacityFadeSx(direction: Direction, offset: number) {
  return {
    position: "fixed" as const,
    [direction]: direction === "top" ? offset : 0,
    left: 0,
    right: 0,
    height: FADE_HEIGHT,
    background: (theme: Theme) =>
      `linear-gradient(to ${direction === "top" ? "bottom" : "top"}, ${alpha(
        theme.palette.background.default,
        0.85,
      )}, ${alpha(theme.palette.background.default, 0)})`,
    pointerEvents: "none" as const,
    zIndex: (theme: Theme) => theme.zIndex.appBar - 1,
  };
}

interface EdgeFadeProps {
  // How far down from the viewport's top edge the top fade starts - lets
  // it begin right where the AppBar ends rather than overlapping it.
  topOffset?: number;
}

// Mounted once, globally, in App.tsx - fixed bands over the top and
// bottom of the viewport, blurring/fading whatever page content scrolls
// underneath them.
function EdgeFade({ topOffset = 0 }: EdgeFadeProps) {
  return (
    <>
      {progressiveBlurLayers("top", topOffset)}
      <Box sx={opacityFadeSx("top", topOffset)} />
      {progressiveBlurLayers("bottom", 0)}
      <Box sx={opacityFadeSx("bottom", 0)} />
    </>
  );
}

export default EdgeFade;
