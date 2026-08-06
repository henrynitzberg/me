import React, { useId, useRef } from "react";
import { useDisplacementMap, type Bezel } from "./useDisplacementMap";
import { SUPPORTS_SVG_BACKDROP_FILTER } from "../../utils/browserSupport";
import "./GlassBox.css";

// Used only as the fallback amount when the caller's own `blur` is smaller
// than this - several callers set blur={0} because they rely entirely on
// the SVG distortion for their look (with real blur just adding mush), but
// that same 0 would mean *no visible effect whatsoever* as a fallback.
const FALLBACK_MIN_BLUR = 8;

interface GlassBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  borderRadius: number;
  backgroundOpacity: number;
  blur?: number;
  hoverBounceDeltaScale?: number;
  clickBounceDeltaScale?: number;
  ior?: number;
  strength?: number;
  scale?: number;
  bezel?: Bezel;
  magnify?: number;
  lipWidth?: number;
  // RGB triplet ("255, 255, 255") the glass is tinted with - default black
  // is right for a translucent card sitting on a light-ish background, but
  // e.g. a small white-tinted circle reads far more visibly against this
  // site's mostly-dark backgrounds.
  tintColor?: string;
  debug?: boolean;
}

const GlassBox = ({
  width,
  height,
  borderRadius,
  backgroundOpacity,
  blur = 4,
  hoverBounceDeltaScale = 0,
  clickBounceDeltaScale = 0,
  ior = 1.5,
  strength = 45,
  scale = 40,
  bezel = "dome",
  magnify = 0,
  lipWidth = 1,
  tintColor = "0, 0, 0",
  debug = false,
  children,
  className,
  ...rest
}: GlassBoxProps) => {
  const divRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<Animation | null>(null);
  const filterId = `liquid-glass-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const displacementMap = useDisplacementMap(
    width,
    height,
    borderRadius,
    ior,
    strength,
    bezel,
    magnify,
    lipWidth,
  );

  const clickDelta = clickBounceDeltaScale;
  const hoverDelta = hoverBounceDeltaScale;

  // star glow
  const conicHighlight = "rgba(255, 255, 255, 0.5)";
  const conicTransparent = "rgba(255, 255, 255, 0)";

  const backgroundColor = `rgba(${tintColor}, ${backgroundOpacity})`;

  const backdropFilterValue = SUPPORTS_SVG_BACKDROP_FILTER
    ? `url(#${filterId}) blur(${blur}px)`
    : `blur(${Math.max(blur, FALLBACK_MIN_BLUR)}px)`;

  return (
    <>
      <div
        ref={divRef}
        className={`glass-box${className ? ` ${className}` : ""}`}
        {...rest}
        style={
          {
            position: "relative",
            // backdrop-filter (esp. referencing an SVG feDisplacementMap
            // filter) on an element that also has its own `transform`,
            // nested inside another transforming ancestor (the glass layer
            // scales during drag), can bleed filtered content outside the
            // element's rounded/clipped bounds in Chromium - forcing a
            // real clip boundary here keeps the effect (and this debug
            // overlay) contained to the box's own shape
            overflow: "hidden",
            "--width": `${width}px`,
            "--height": `${height}px`,
            "--border-radius": `${borderRadius}px`,
            "--hover-scale": 1 + hoverDelta,
            "--background-opacity": backgroundOpacity,
            "--background-color": backgroundColor,
            "--conic-highlight": conicHighlight,
            "--conic-transparent": conicTransparent,
            backdropFilter: backdropFilterValue,
            WebkitBackdropFilter: backdropFilterValue,
            ...rest.style,
          } as React.CSSProperties
        }
        onMouseDown={(e) => {
          rest.onMouseDown?.(e);
          if (clickDelta > 0 && divRef.current) {
            animRef.current?.cancel();
            animRef.current = divRef.current.animate(
              [
                { transform: `translateZ(0) scale(${1 + hoverDelta})` },
                { transform: `translateZ(0) scale(${1 - clickDelta})` },
              ],
              { duration: 200, easing: "ease", fill: "forwards" },
            );

            const handleRelease = () => {
              if (!divRef.current) return;
              const currentScale = new DOMMatrix(
                getComputedStyle(divRef.current).transform,
              ).a;
              animRef.current?.cancel();
              animRef.current = divRef.current.animate(
                [
                  { transform: `translateZ(0) scale(${currentScale})` },
                  { transform: `translateZ(0) scale(${1 + hoverDelta})` },
                ],
                { duration: 200, easing: "ease", fill: "none" },
              );
              window.removeEventListener("mouseup", handleRelease);
            };

            window.addEventListener("mouseup", handleRelease);
          }
        }}
      >
        {children}
        {debug && displacementMap && (
          <img
            src={displacementMap}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              borderRadius: "inherit",
              opacity: 0.5,
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
      </div>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
            // feDisplacementMap samples SourceGraphic at (x+dx, y+dy), but
            // SourceGraphic only exists *within the filter region* - a
            // region pinned exactly to the box (no margin) means any sample
            // displacement reaches would read past that boundary, and comes
            // back transparent rather than a real backdrop pixel. Through
            // that transparency, whatever's actually behind the element in
            // the page's real stacking shows through completely unfiltered,
            // right alongside the properly warped pixels next to it. Margin
            // by the maximum possible displacement (±scale/2 px) so every
            // sample always lands on real backdrop; the div's own
            // `overflow: hidden` + border-radius still crops the visible
            // result back down to the box's rounded shape.
            x={-scale / 2}
            y={-scale / 2}
            width={width + scale}
            height={height + scale}
          >
            {displacementMap && (
              <feImage
                href={displacementMap}
                x="0"
                y="0"
                width={width}
                height={height}
                result="refract_map"
              />
            )}
            <feDisplacementMap
              in="SourceGraphic"
              in2="refract_map"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="refracted"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default GlassBox;
