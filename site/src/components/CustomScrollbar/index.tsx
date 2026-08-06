import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import GlassBox from "../GlassBox/GlassBox";

const THIN_WIDTH = 2;
const GLASS_WIDTH = 12;
// wider than the visual thumb, so hovering doesn't require pixel-perfect
// aim at a 2px line
const HIT_WIDTH = 24;
const MIN_THUMB_HEIGHT = 40;

// Mounted once, globally, in App.tsx. The page scrolls natively (window
// scroll, not a contained div) - this only replaces the browser's *visual*
// scrollbar (hidden globally via theme.tsx's CssBaseline overrides) with
// its own thumb, and reimplements drag-to-scroll on top of that, entirely
// independent of - and without altering - how scrolling actually works.
function CustomScrollbar() {
  const [viewportHeight, setViewportHeight] = useState(0);
  const [docHeight, setDocHeight] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragStateRef = useRef({ startY: 0, startScrollY: 0 });

  useEffect(() => {
    const measure = () => {
      setViewportHeight(window.innerHeight);
      setDocHeight(document.documentElement.scrollHeight);
      setScrollY(window.scrollY);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);

    // Tab switches (and anything else that changes page content) change
    // scrollHeight without necessarily firing scroll or resize - html and
    // body both have an explicit height: 100% (see theme.tsx), so a
    // ResizeObserver on either would never fire just from content
    // overflowing them. Watching the DOM directly catches a height change
    // regardless of what caused it.
    let raf: number | null = null;
    const observer = new MutationObserver(() => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        measure();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      observer.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  const maxScroll = Math.max(docHeight - viewportHeight, 0);
  const canScroll = maxScroll > 1;

  const thumbHeight = canScroll
    ? Math.max((viewportHeight / docHeight) * viewportHeight, MIN_THUMB_HEIGHT)
    : viewportHeight;
  const availableTrack = viewportHeight - thumbHeight;
  const thumbTop =
    canScroll && availableTrack > 0
      ? (scrollY / maxScroll) * availableTrack
      : 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStateRef.current = { startY: e.clientY, startScrollY: window.scrollY };
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStateRef.current.startY;
      const scrollDelta =
        availableTrack > 0 ? (deltaY / availableTrack) * maxScroll : 0;
      window.scrollTo({ top: dragStateRef.current.startScrollY + scrollDelta });
    };
    const handleUp = () => setDragging(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragging, availableTrack, maxScroll]);

  if (!canScroll) return null;

  const isActive = hovering || dragging;
  const thumbWidth = isActive ? GLASS_WIDTH : THIN_WIDTH;

  return (
    <Box
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseDown={handleMouseDown}
      data-cursor="pointer"
      sx={{
        position: "fixed",
        top: `${thumbTop}px`,
        right: 0,
        width: `${HIT_WIDTH}px`,
        height: `${thumbHeight}px`,
        zIndex: (theme) => theme.zIndex.tooltip,
        display: "flex",
        justifyContent: "flex-end",
        // real cursor is hidden globally (Cursor component) regardless,
        // but this still communicates intent to anyone inspecting/on a
        // platform where that override doesn't apply
        cursor: isActive ? "grab" : "default",
        userSelect: dragging ? "none" : "auto",
      }}
    >
      {/* one persistent GlassBox, not a swap between a plain line and a
          separate glass element - a swap can't transition (mounting a
          different element has nothing to animate from), so width/height
          and opacity all just change on the same box instead. At rest,
          opaque white (opacity 1) reads as a plain solid line with no
          visible refraction, since full opacity leaves nothing for the
          backdrop-filter to show through; dropping opacity while widening
          on hover is what actually reveals the glass */}
      <GlassBox
        width={thumbWidth}
        height={thumbHeight}
        borderRadius={thumbWidth / 2}
        tintColor="255, 255, 255"
        backgroundOpacity={isActive ? 0.3 : 1}
        style={{
          transition: "width 0.2s ease, height 0.2s ease, border-radius 0.2s ease",
        }}
      />
    </Box>
  );
}

export default CustomScrollbar;
