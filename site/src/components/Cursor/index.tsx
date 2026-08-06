import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import GlobalStyles from "@mui/material/GlobalStyles";
import { ChevronUp } from "lucide-react";
import GlassBox from "../GlassBox/GlassBox";

const CURSOR_SIZE = 32;
const CLICK_SIZE = CURSOR_SIZE * 0.8;
const HOVER_SIZE = CURSOR_SIZE * 1.2;
const DOT_SIZE = 7;

// A custom cursor only makes sense with a real pointer to replace - touch
// devices report no hover and an imprecise pointer, so this (and the
// `cursor: none` below) both stay off there entirely.
const SUPPORTS_CURSOR_QUERY = "(hover: hover) and (pointer: fine)";

// What counts as "this would show a pointer/hand cursor natively". Can't
// just read getComputedStyle(el).cursor for this - the blanket `cursor:
// none` override below (needed to hide the real cursor everywhere) wins
// the cascade on every element, so the property no longer reflects what
// the *author* actually specified. `data-cursor="pointer"` is this
// project's own marker for exactly that, added wherever a plain div (not
// a real <a>/<button>) is the clickable thing - see ProjectCard,
// GlassIconButton, TabSwitcher, and the drawing/climbing image grids.
const POINTER_TARGET_SELECTOR = 'a, button, [data-cursor="pointer"]';

// Mounted once, globally, in App.tsx - not per-tab. Tracks the real
// pointer directly (no lag or spring smoothing, a plain 1:1 follow), and
// only changes size: bigger over anything clickable, smaller while a
// button is actually held down.
function Cursor() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef(CURSOR_SIZE);

  const [clicked, setClicked] = useState(false);
  const [hoveringTarget, setHoveringTarget] = useState(false);
  // Withheld until the first real pointer position is known, so the
  // circle doesn't flash into view at its default top-left origin.
  const [ready, setReady] = useState(false);
  const [supportsCursor, setSupportsCursor] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(SUPPORTS_CURSOR_QUERY);
    setSupportsCursor(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSupportsCursor(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const size = clicked ? CLICK_SIZE : hoveringTarget ? HOVER_SIZE : CURSOR_SIZE;
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    if (!supportsCursor) return;

    const handleMove = (e: MouseEvent) => {
      if (wrapperRef.current) {
        const half = sizeRef.current / 2;
        wrapperRef.current.style.transform = `translate(${e.clientX - half}px, ${e.clientY - half}px)`;
      }
      setReady(true);

      const target = document.elementFromPoint(e.clientX, e.clientY);
      setHoveringTarget(Boolean(target?.closest(POINTER_TARGET_SELECTOR)));
    };
    const handleDown = () => setClicked(true);
    const handleUp = () => setClicked(false);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [supportsCursor]);

  if (!supportsCursor) return null;

  return (
    <>
      <GlobalStyles
        styles={{
          [`@media ${SUPPORTS_CURSOR_QUERY}`]: {
            "*": { cursor: "none !important" },
          },
        }}
      />
      <Box
        ref={wrapperRef}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: (theme) => theme.zIndex.tooltip + 1,
          opacity: ready ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        <GlassBox
          width={size}
          height={size}
          borderRadius={size / 2}
          backgroundOpacity={0.2}
          blur={1}
          strength={20}
          magnify={0.7}
          style={{
            transition:
              "width 0.15s ease, height 0.15s ease, background-color 0.15s ease",
          }}
        >
          {/* dot, or a tilted chevron standing in for a pointer arrow while
              hovering something clickable */}
          {hoveringTarget ? (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                color: "rgba(255, 255, 255, 1)",
                display: "flex",
                transform: "translate(-50%, -50%) rotate(-20deg)",
              }}
            >
              <ChevronUp size={14} strokeWidth={4} />
            </Box>
          ) : (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: `${DOT_SIZE}px`,
                height: `${DOT_SIZE}px`,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 1)",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </GlassBox>
      </Box>
    </>
  );
}
// rgb(27, 36, 192) is the same blue as the AppBar's active tab highlight, so

export default Cursor;
