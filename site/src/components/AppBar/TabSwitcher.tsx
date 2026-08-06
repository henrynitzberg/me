import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GlassBox from "../GlassBox/GlassBox";

const TABS = ["making", "drawing", "climbing"] as const;
export type Tab = (typeof TABS)[number];

const BUBBLE_HEIGHT = 36;
const BUBBLE_PADDING_X = 12;
const MAX_DRAG_DISTANCE = 300;
const MAX_DRAG_DURATION_MS = 3000;

// How far the bubble can stretch past its horizontal bounds / away from its
// resting vertical position while dragging, and how quickly that stretch
// approaches its own limit. Both axes use the same rubber-band curve, just
// with a much smaller ceiling vertically - "let it move a little," not
// "let it drift."
const MAX_OVERSHOOT_X = 24;
const OVERSHOOT_FALLOFF_X = 28;
const MAX_OVERSHOOT_Y = 7;
const OVERSHOOT_FALLOFF_Y = 9;

// Exponential rubber-band resistance: past `min`/`max`, the bubble keeps
// easing toward wherever the pointer actually is, but the *rate* it
// follows at decays exponentially with distance past the boundary - so it
// never visually travels more than `maxOvershoot` beyond the edge no
// matter how far the pointer goes, without ever hard-stopping. Passing the
// same value for `min` and `max` (as the vertical axis does, both 0) turns
// this into a plain symmetric spring around that point.
function rubberBand(overshoot: number, maxOvershoot: number, falloff: number) {
  return maxOvershoot * (1 - Math.exp(-overshoot / falloff));
}

function withRubberBand(
  raw: number,
  min: number,
  max: number,
  maxOvershoot: number,
  falloff: number,
) {
  if (raw < min) return min - rubberBand(min - raw, maxOvershoot, falloff);
  if (raw > max) return max + rubberBand(raw - max, maxOvershoot, falloff);
  return raw;
}

interface TabSwitcherProps {
  selectedTab: Tab;
  onSelectTab: (tab: Tab) => void;
}

function TabSwitcher({ selectedTab, onSelectTab }: TabSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Partial<Record<Tab, HTMLSpanElement | null>>>({});
  const selectedTabRef = useRef(selectedTab);

  const [bubbleWidth, setBubbleWidth] = useState(0);
  const [centers, setCenters] = useState<Partial<Record<Tab, number>>>({});
  const [bubbleX, setBubbleX] = useState(0);
  const [bubbleY, setBubbleY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showGlass, setShowGlass] = useState(false);

  const dragState = useRef({ startClientX: 0, startClientY: 0, startBubbleX: 0 });
  const bubbleXRef = useRef(bubbleX);
  const dragTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    selectedTabRef.current = selectedTab;
  }, [selectedTab]);

  useEffect(() => {
    bubbleXRef.current = bubbleX;
  }, [bubbleX]);

  useEffect(() => {
    return () => {
      if (dragTimeoutRef.current !== null) {
        window.clearTimeout(dragTimeoutRef.current);
      }
    };
  }, []);

  const measure = () => {
    const container = containerRef.current;
    if (!container) return null;
    const containerRect = container.getBoundingClientRect();

    let maxWidth = 0;
    const nextCenters: Partial<Record<Tab, number>> = {};
    for (const tab of TABS) {
      const el = tabRefs.current[tab];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      maxWidth = Math.max(maxWidth, rect.width);
      nextCenters[tab] = rect.left - containerRect.left + rect.width / 2;
    }

    const width = maxWidth + BUBBLE_PADDING_X * 2;
    setBubbleWidth(width);
    setCenters(nextCenters);
    return { centers: nextCenters, width };
  };

  useLayoutEffect(() => {
    const snapWithoutAnimating = () => {
      const result = measure();
      const center = result?.centers[selectedTabRef.current];
      if (result && center !== undefined) {
        setBubbleX(center - result.width / 2);
      }
    };

    snapWithoutAnimating();

    window.addEventListener("resize", snapWithoutAnimating);
    return () => window.removeEventListener("resize", snapWithoutAnimating);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const snapTo = (tab: Tab) => {
    const center = centers[tab];
    if (center === undefined) return;
    const targetX = center - bubbleWidth / 2;
    // if the bubble is already at (or basically at) this spot - which can
    // happen not just for a plain click, but also when a fast drag gets
    // clamped to the container edge and that happens to be where the
    // nearest tab already snaps to - the transform won't change, so no
    // transition will ever fire to flip showGlass back off. Handle both
    // directions explicitly instead of only ever turning it on here.
    if (Math.abs(targetX - bubbleX) > 0.5 || bubbleY !== 0) {
      setShowGlass(true);
    } else {
      setShowGlass(false);
    }
    setBubbleX(targetX);
    setBubbleY(0);
    onSelectTab(tab);
  };

  const nearestTab = (x: number): Tab => {
    const bubbleCenter = x + bubbleWidth / 2;
    let closest: Tab = TABS[0];
    let closestDist = Infinity;
    for (const tab of TABS) {
      const center = centers[tab];
      if (center === undefined) continue;
      const dist = Math.abs(center - bubbleCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = tab;
      }
    }
    return closest;
  };

  const clearDragTimeout = () => {
    if (dragTimeoutRef.current !== null) {
      window.clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragState.current = {
      startClientX: e.clientX,
      startClientY: e.clientY,
      startBubbleX: bubbleX,
    };

    // backstop for the case where we never get a pointerup/pointercancel
    // at all (fast fling losing capture, OS eating the release event) -
    // force a snap from wherever it currently is after a hard time limit
    clearDragTimeout();
    dragTimeoutRef.current = window.setTimeout(() => {
      setIsDragging(false);
      snapTo(nearestTab(bubbleXRef.current));
    }, MAX_DRAG_DURATION_MS);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const containerWidth =
      containerRef.current.getBoundingClientRect().width + BUBBLE_PADDING_X * 2;
    const delta = e.clientX - dragState.current.startClientX;
    const deltaY = e.clientY - dragState.current.startClientY;
    const minX = -BUBBLE_PADDING_X;
    const maxX = containerWidth - bubbleWidth;

    // safety valve: if the pointer has wandered too far from where the
    // drag started (e.g. capture got flaky, or the user just yanked it),
    // stop dragging and snap immediately instead of letting it trail along.
    // Raw pointer travel, not the rubber-banded position - the whole point
    // of the rubber band is that the bubble itself never travels that far,
    // so this has to watch the input instead of the output to catch it.
    if (Math.hypot(delta, deltaY) > MAX_DRAG_DISTANCE) {
      const nextX = withRubberBand(
        dragState.current.startBubbleX + delta,
        minX,
        maxX,
        MAX_OVERSHOOT_X,
        OVERSHOOT_FALLOFF_X,
      );
      clearDragTimeout();
      setIsDragging(false);
      snapTo(nearestTab(nextX));
      return;
    }

    // this only runs on genuine pointer movement, so it's the right place
    // to flip on the glass look - unlike pointerdown, which fires on a
    // plain click too and would leave it stuck in glass mode forever since
    // no transform change would ever occur to flip it back off
    setShowGlass(true);

    const nextX = withRubberBand(
      dragState.current.startBubbleX + delta,
      minX,
      maxX,
      MAX_OVERSHOOT_X,
      OVERSHOOT_FALLOFF_X,
    );
    setBubbleX(nextX);
    setBubbleY(
      withRubberBand(deltaY, 0, 0, MAX_OVERSHOOT_Y, OVERSHOOT_FALLOFF_Y),
    );
  };

  const endDrag = () => {
    clearDragTimeout();
    setIsDragging((wasDragging) => {
      if (wasDragging) snapTo(nearestTab(bubbleX));
      return false;
    });
  };

  const handleTransitionEnd = (e: ReactTransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== "transform" || isDragging) return;
    setShowGlass(false);
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      {bubbleWidth > 0 && (
        <Box
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onTransitionEnd={handleTransitionEnd}
          data-cursor="pointer"
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            touchAction: "none",
            cursor: isDragging ? "grabbing" : "grab",
            transform: `translate(${bubbleX}px, calc(-50% + ${bubbleY}px))`,
            // even while dragging, a short transition rather than "none" -
            // the browser withholds the first pointermove until the cursor
            // clears a small drag threshold, so that event alone can carry
            // a multi-pixel delta; applied instantly it reads as a teleport,
            // so glide it in instead (short enough to still feel 1:1)
            transition: isDragging
              ? "transform 0.06s linear"
              : "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: bubbleWidth,
              height: BUBBLE_HEIGHT,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                // explicit stacking order: opacity < 1 and transform !== none
                // each independently promote a sibling into its own stacking
                // context, which can make plain DOM order an unreliable way
                // to guarantee which layer paints on top - pin it explicitly
                zIndex: 0,
                borderRadius: BUBBLE_HEIGHT / 2,
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                opacity: showGlass ? 0 : 1,
                transition: "opacity 0.2s ease, background-color 0.15s ease",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                opacity: showGlass ? 1 : 0,
                transition: "opacity 0.2s ease",
                // opacity doesn't remove this from hit-testing, so without
                // this it swallows hover/click even while invisible and
                // never lets them reach the flat pill layer beneath it
                pointerEvents: "none",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  // grows ~1.2x while active via real width/height rather
                  // than a transform: scale() - scale() anywhere in this
                  // element's chain (here or on an ancestor, even sitting
                  // still) breaks Chromium's backdrop-filter capture for
                  // it, letting the raw unfiltered content behind composite
                  // through underneath the correctly-filtered result. See
                  // the note on .glass-box in GlassBox.css. translate() is
                  // unaffected, so centering through that is still fine.
                  transform: "translate(-50%, -50%)",
                  transition: "width 0.2s ease, height 0.2s ease",
                  width: bubbleWidth * (showGlass ? 1.2 : 1),
                  height: BUBBLE_HEIGHT * (showGlass ? 1.2 : 1),
                }}
              >
                <GlassBox
                  width={bubbleWidth * (showGlass ? 1.2 : 1)}
                  height={BUBBLE_HEIGHT * (showGlass ? 1.2 : 1)}
                  borderRadius={(BUBBLE_HEIGHT * (showGlass ? 1.2 : 1)) / 2}
                  backgroundOpacity={0}
                  hoverBounceDeltaScale={0.05}
                  clickBounceDeltaScale={0.05}
                  // lip bends the gradient direction sharply within a couple
                  // of pixels of the true edge (rise then fall), so at this
                  // pill's small scale that rim sits right where the label
                  // text does - sampled at full sharpness it mirrors the
                  // text into a legible upside-down ghost just past the rim.
                  // magnify piles more gradient on top of that (it's an
                  // additive height contribution, see useDisplacementMap.ts).
                  blur={0}
                  strength={30}
                  // debug
                  bezel="lip"
                  lipWidth={1.2}
                  magnify={0.4}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {TABS.map((tab) => {
        const isSelected = selectedTab === tab;
        return (
          <Typography
            key={tab}
            ref={(el: HTMLSpanElement | null) => {
              tabRefs.current[tab] = el;
            }}
            component="span"
            variant="body1"
            onClick={() => snapTo(tab)}
            data-cursor="pointer"
            sx={{
              // no `position` here (stays static): keeps this element out of
              // the stacking context the pill's `position: absolute` joins,
              // so it always paints *before* the pill and becomes part of
              // what the pill's backdrop-filter warps when it slides over
              color: isSelected ? "text.primary" : "text.secondary",
              "&:hover": {
                color: "text.primary",
              },
              fontWeight: 500,
              cursor: "pointer",
              userSelect: "none",
              transition: "color 0.2s",
            }}
          >
            {tab}
          </Typography>
        );
      })}
    </Box>
  );
}

export default TabSwitcher;
