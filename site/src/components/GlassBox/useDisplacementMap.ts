import { useEffect, useState } from "react";

// ─── Height profile ──────────────────────────────────────────────────────────

// This describes the cross-section shape of the glass dome at the rim.
// Imagine slicing the glass card edge-on: this curve is what you'd see.
//
// Input t: 0 at the very edge of the glass, 1 deep in the interior
// Output: height of the glass surface at that point (0 = flat, 1 = peak)
//
// The formula (1 - (1-t)^4)^0.25 is called a "squircle" curve —
// it rises steeply from 0 then flattens out quickly, like a rounded cliff.
function squircleHeight(t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  return Math.pow(1 - Math.pow(1 - clamped, 4), 0.25);
}

function smootherstep(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return c ** 3 * (c * (c * 6 - 15) + 10);
}

// A "lip" profile: a thin raised rim right at the edge that dips back down
// to a flat trough for the rest of the interior - like the bezel around a
// watch face or a switch track, as opposed to squircleHeight's dome (which
// rises once from the edge and stays up).
// See https://kube.io/blog/liquid-glass-css-svg/#switch
//
// The blend weight rides on `convex` (not on `t` directly) because convex
// already saturates to ~1 within a fraction of the [0,1] domain. Blending
// on raw t would spread the convex->concave transition across the *entire*
// radius, leaving no truly flat interior; blending on convex collapses that
// transition into the same short band where convex itself is still moving,
// so the interior actually goes flat instead of merely approaching it.
//
// `lipWidth` rescales t before any of that: dividing by it stretches (>1)
// or compresses (<1) how much of the [0,1] domain it takes convex to reach
// its own saturation, which is what actually controls how wide the ring
// reads as - convex saturating within a smaller slice of t is a tighter,
// thinner ring; saturating later (or never, if lipWidth is large enough
// that t/lipWidth can't reach 1) spreads the rise-then-fall over more of
// the card, reading as a thicker ring. 1 reproduces the original fixed
// width (no rescaling).
function lipHeight(t: number, lipWidth: number): number {
  const scaledT = Math.min(1, t / lipWidth);
  const convex = squircleHeight(scaledT);
  const concave = 1 - convex;
  const w = smootherstep(convex);
  return convex * (1 - w) + concave * w;
}

export type Bezel = "dome" | "lip";

function heightProfile(bezel: Bezel, lipWidth: number): (t: number) => number {
  return bezel === "lip" ? (t) => lipHeight(t, lipWidth) : squircleHeight;
}

// A hemisphere over the *whole* card, peaking at dead center, for a
// magnifying-glass / water-droplet look - as opposed to the bezel profiles
// above, whose curvature lives entirely in a thin band near the edge.
//
// Input r: 0 at the card's center, 1 at its outer boundary.
//
// Unlike squircleHeight, this doesn't saturate early: its slope is exactly
// 0 at r=0 (the apex - dead center is undistorted) and grows continuously
// out to r=1, rather than flattening out a short way in. That gradual
// build-up is what pulls content in from progressively farther out as you
// move toward the edge, which is what reads as the center being "zoomed" -
// a profile that saturated early (like squircleHeight) would leave most of
// the interior flat/undistorted and concentrate the whole effect in a thin
// ring near the boundary, same as the edge bezels above.
function magnifyHeight(r: number): number {
  const clamped = Math.max(0, Math.min(1, r));
  return Math.sqrt(1 - clamped * clamped);
}

// Radial distance from the card's center, 0 at the exact center point and 1
// at the outer boundary in every direction - built by casting a ray from
// the center through this pixel and finding where it crosses the true
// rounded-rect boundary, then normalizing this pixel's own distance by that.
//
// An ellipse inscribed in the bounding box is only exact at the four edge
// midpoints; anywhere else on the true boundary (e.g. partway around a
// rounded corner) it reports a value past 1, so the lens's reach falls
// short around most of the perimeter. Using the rounded-rect SDF directly
// fixes that (it's exactly 0 on the true boundary everywhere) but is
// degenerate through the shape's "inner box", where the SDF is constant -
// for a fully-rounded stadium like this codebase's pills, that inner box
// collapses to a whole flat band rather than a single point, so a lens
// built on it never bulges continuously from a true center, it just turns
// on past that band. Casting the ray keeps the ellipse's genuine
// single-point center (and the smooth, continuous falloff that comes with
// it) while still hitting exactly 1 at the true boundary in every direction.
function centerDistance(
  px: number,
  py: number,
  width: number,
  height: number,
  radius: number,
): number {
  const cx = px - width / 2;
  const cy = py - height / 2;
  const dist = Math.hypot(cx, cy);
  if (dist < 1e-6) return 0;

  // Fold to the first quadrant - the shape is symmetric, so only the
  // magnitudes of the direction components matter.
  const ux = Math.abs(cx) / dist;
  const uy = Math.abs(cy) / dist;
  const halfW = width / 2;
  const halfH = height / 2;
  const innerHalfW = Math.max(0, halfW - radius);
  const innerHalfH = Math.max(0, halfH - radius);

  // Where does this ray cross the boundary? Try the flat top/bottom edge
  // (y = halfH, valid for |x| <= innerHalfW) and the flat left/right edge
  // (x = halfW, valid for |y| <= innerHalfH) - whichever the ray actually
  // reaches within its valid span. If neither, the ray passes through the
  // rounded corner instead, so solve for its crossing of that corner's
  // arc (a circle of `radius` centered at (innerHalfW, innerHalfH)).
  let t = Infinity;
  if (uy > 1e-9) {
    const tFlatTop = halfH / uy;
    if (ux * tFlatTop <= innerHalfW) t = Math.min(t, tFlatTop);
  }
  if (ux > 1e-9) {
    const tFlatSide = halfW / ux;
    if (uy * tFlatSide <= innerHalfH) t = Math.min(t, tFlatSide);
  }
  if (!Number.isFinite(t)) {
    const b = ux * innerHalfW + uy * innerHalfH;
    const c = innerHalfW * innerHalfW + innerHalfH * innerHalfH - radius * radius;
    t = b + Math.sqrt(Math.max(0, b * b - c));
  }

  return Math.max(0, Math.min(1, dist / t));
}

// ─── Rounded rectangle SDF ───────────────────────────────────────────────────

// SDF = Signed Distance Field.
// For every pixel, this tells us how far it is from the glass edge,
// measured in pixels. The sign tells us which side of the edge we're on:
//
//   sdf < 0  →  inside the glass card
//   sdf = 0  →  exactly on the edge
//   sdf > 0  →  outside the card
//
// We work entirely in pixel space here (not normalized 0–1 coordinates),
// which means borderRadius, width, and height are all in real pixels.
// This is what lets us handle any aspect ratio and any border-radius correctly.
function roundedRectSDF(
  px: number, // pixel x position (0 to width)
  py: number, // pixel y position (0 to height)
  width: number,
  height: number,
  radius: number, // border-radius in pixels
): number {
  // Shift to center-relative coordinates: (0,0) at center of card
  const cx = px - width / 2;
  const cy = py - height / 2;

  // The "inner box" is the card rectangle shrunk by `radius` on all sides.
  // Pixels inside the inner box are definitely inside the card.
  // Pixels in the corners need the circle-arc distance check.
  const innerHalfW = width / 2 - radius;
  const innerHalfH = height / 2 - radius;

  // qx/qy are the distances past the inner box boundary.
  // If the pixel is within the inner box, qx and qy are both 0.
  // If it's in a corner region, they measure how far into the corner we are.
  const qx = Math.max(Math.abs(cx) - innerHalfW, 0);
  const qy = Math.max(Math.abs(cy) - innerHalfH, 0);

  // For pixels on straight edges: only one of qx/qy is nonzero.
  // dist = that one value, then subtract radius.
  // For corner pixels: both are nonzero, so we get the Euclidean distance
  // to the inner box corner, then subtract radius to get distance to the arc.
  return Math.sqrt(qx * qx + qy * qy) - radius;
}

// ─── Main generation function ─────────────────────────────────────────────────

// Generates a displacement map image for a glass card of the given dimensions.
// Returns a data: URL (a self-contained PNG string) that can be passed
// directly to an SVG <feImage href="..."> element.
function generateDisplacementMap(
  rawWidth: number,
  rawHeight: number,
  borderRadius: number,
  ior: number,
  strength: number,
  bezel: Bezel,
  magnify: number,
  lipWidth: number,
): string {
  const profile = heightProfile(bezel, lipWidth);
  // width/height often come from a measured getBoundingClientRect(), which
  // is sub-pixel (e.g. 86.99). The height map below is stored in a
  // Float32Array indexed by `py * width + px` - a non-integer width makes
  // that index non-integer for every row past the first, which silently
  // misses the typed array's real backing storage instead of throwing, so
  // the whole map beyond row 0 would otherwise resolve to nothing.
  const width = Math.round(rawWidth);
  const height = Math.round(rawHeight);
  const n = width * height;

  // ── Step 1: Build the height map ─────────────────────────────────────────
  //
  // For each pixel, compute a value from 0 to 1 describing the height of
  // the glass dome at that point:
  //   0 = at the edge (glass curves down to zero here)
  //   1 = flat interior (glass is at full thickness, no curvature)
  //
  // The rim zone (where height goes from 0 → 1) is exactly `borderRadius`
  // pixels wide, matching the visual CSS border-radius.
  const h = new Float32Array(n);

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      // Sample at pixel centers (+0.5) for accuracy
      const sdf = roundedRectSDF(
        px + 0.5,
        py + 0.5,
        width,
        height,
        borderRadius,
      );

      // Convert SDF to a 0–1 "how deep inside the glass" value.
      // At the edge (sdf=0):              t = 0 → height = 0
      // At borderRadius pixels in (sdf=-borderRadius): t = 1 → height = 1
      // Outside the card (sdf > 0):       t = 0 → height = 0
      const t = Math.max(0, Math.min(1, -sdf / borderRadius));
      let hv = profile(t);

      // The two profiles are independent additive contributions to the
      // same height field, not alternate modes - central differences are
      // linear, so their gradients (and thus displacements) simply add,
      // letting an edge bezel and a center lens coexist on one surface.
      if (magnify > 0) {
        const r = centerDistance(
          px + 0.5,
          py + 0.5,
          width,
          height,
          borderRadius,
        );
        hv += magnify * magnifyHeight(r);
      }

      h[py * width + px] = hv;
    }
  }

  // ── Step 2: Compute surface gradients ────────────────────────────────────
  //
  // The gradient of the height map tells us the slope of the glass surface
  // at each pixel — i.e., which direction the surface is tilting.
  //
  // We use "central differences": the slope at pixel x is approximated by
  // looking one pixel to the left and one to the right:
  //   gx ≈ (h[x+1] - h[x-1]) / 2
  //
  // This is the discrete equivalent of a derivative.
  const gx = new Float32Array(n);
  const gy = new Float32Array(n);

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const i = py * width + px;

      // Use central differences where possible. Outside the canvas the glass
      // height is 0 (sdf > 0 = outside the card), so virtual out-of-bounds
      // neighbors are 0, not a repeat of the edge pixel.
      const left = px > 0 ? h[i - 1] : 0;
      const right = px < width - 1 ? h[i + 1] : 0;
      const up = py > 0 ? h[i - width] : 0;
      const down = py < height - 1 ? h[i + width] : 0;

      gx[i] = (right - left) / 2;
      gy[i] = (down - up) / 2;
    }
  }

  // ── Step 3 + 4: Apply Snell's Law and encode to image ────────────────────
  //
  // Snell's Law describes how light bends when it crosses between materials:
  //   n1 * sin(θ1) = n2 * sin(θ2)
  //
  // Here:
  //   n1 = 1.0 (air)
  //   n2 = IOR (glass, ~1.5)
  //   sin(θ1) ≈ gradient magnitude (the surface tilt angle)
  //   sin(θ2) = sin(θ1) / IOR (the refracted ray angle)
  //
  // The ratio sin(θ2) / sin(θ1) gives us how much to scale down the gradient
  // to get the actual light displacement. Since IOR > 1, this is always < 1.
  //
  // We then encode the displacement into R and G channels:
  //   128 = no displacement (halfway between 0 and 255)
  //   0   = maximum displacement in the negative direction
  //   255 = maximum displacement in the positive direction
  //
  // The SVG feDisplacementMap node reads these channels and shifts pixels
  // by (channel/255 - 0.5) * scale pixels in that direction.
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);

  for (let i = 0; i < n; i++) {
    const gradX = gx[i];
    const gradY = gy[i];

    // How steep is the surface here? (magnitude of the gradient vector)
    const sinT1 = Math.sqrt(Math.min(gradX * gradX + gradY * gradY, 1.0));

    // Snell's law: how much does the light actually bend?
    const sinT2 = sinT1 / ior;

    // Scale factor: 0 on flat areas (no bending), approaches 1/IOR on steep slopes
    const magnitude = sinT1 > 1e-8 ? sinT2 / sinT1 : 0;

    // Encode into 0–255 range, centered at 128
    const r = Math.round(
      Math.max(0, Math.min(255, 128 + gradX * magnitude * 127 * strength)),
    );
    const g = Math.round(
      Math.max(0, Math.min(255, 128 + gradY * magnitude * 127 * strength)),
    );

    const pixel = i * 4;
    imageData.data[pixel + 0] = r;
    imageData.data[pixel + 1] = g;
    imageData.data[pixel + 2] = 128; // blue unused, set to neutral
    imageData.data[pixel + 3] = 255; // fully opaque
  }

  ctx.putImageData(imageData, 0, 0);

  // Return as a self-contained data URL — no file needed
  return canvas.toDataURL("image/png");
}

// ─── React hook ──────────────────────────────────────────────────────────────

// Wraps generateDisplacementMap in a hook that:
//   - Runs the generation once when the component mounts
//   - Re-runs automatically if width, height, or borderRadius ever change
//   - Returns null while generating (so callers can skip rendering the filter)
export function useDisplacementMap(
  width: number,
  height: number,
  borderRadius: number,
  // Index of refraction for glass (1.0 = air, 1.5 = glass, 2.4 = diamond)
  // Higher values = more bending of light at the rim
  ior: number,
  // How strongly the gradient gets encoded into displacement.
  // Think of this as the "loudness" of the effect — higher = more distortion.
  strength: number,
  // "dome": flattens to a plateau in the interior (no gradient past the rim).
  // "lip": never flattens - rises into a rim just inside the edge, then
  // dips back down toward the center, like a raised bezel.
  bezel: Bezel = "dome",
  // Water-droplet magnification intensity, layered on top of the bezel:
  // 0 disables it, 1 gives the lens its full natural strength. Independent
  // of `bezel` - combine them for a lensed card with a distinct edge, or
  // use magnify alone with the default "dome" bezel (whose own effect is
  // already negligible away from the rim) for a plain magnifying glass.
  magnify: number = 0,
  // Only affects bezel="lip": how much of the card's radius the ring's
  // rise-then-fall spans. 1 is the original fixed width; >1 thickens it
  // (spreads toward the center), <1 thins it (tightens toward the edge).
  lipWidth: number = 1,
): string | null {
  const [mapUrl, setMapUrl] = useState<string | null>(null);

  useEffect(() => {
    // Run off the critical path — generation is fast (<10ms for typical card
    // sizes) but we don't want to block the first render
    const url = generateDisplacementMap(
      width,
      height,
      borderRadius,
      ior,
      strength,
      bezel,
      magnify,
      lipWidth,
    );
    setMapUrl(url);
  }, [width, height, borderRadius, bezel, magnify, lipWidth]);

  return mapUrl;
}
