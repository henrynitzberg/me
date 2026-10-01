import { useEffect, useRef, useState, type ReactNode } from "react";
import { Box, Typography } from "@mui/material";

const PX_PER_FRAME = 14; // drag sensitivity

const frameSrc = (dir: string, i: number) =>
  `${dir}/${String(i + 1).padStart(3, "0")}.webp`;

/** Warm the browser cache for a whole set so dragging never hits a decode. */
function preloadDir(dir: string, frames: number) {
  return Promise.all(
    Array.from(
      { length: frames },
      (_, i) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // a missing frame shouldn't hang the set
          img.src = frameSrc(dir, i);
        }),
    ),
  );
}

type Props = {
  /** Folder of 001.webp ... NNN.webp. Changing it swaps variants in place. */
  dir: string;
  /** Subject of the aria-label, e.g. "the computer case". */
  label: string;
  /** CSS aspect-ratio of a frame - required, since a wrong guess crops. */
  aspect: string;
  frames?: number;
  /**
   * Frame to open on, 1-based to match the file names (001..025 -> 1..25).
   * Out-of-range values wrap, so 0 is the last frame and 26 is the first.
   * Applied on mount only - later changes don't yank the view around while
   * someone is dragging it.
   */
  start_img?: number;
  /** Width of the frame within the component. */
  frameWidth?: string | { xs: string; sm: string };
  /** Rendered under the frame; disabled automatically while a set loads. */
  controls?: ReactNode;
};

function Turntable({
  dir,
  label,
  aspect,
  frames = 25,
  start_img = 1,
  frameWidth = "100%",
  controls,
}: Props) {
  const wrap = (n: number) => ((n % frames) + frames) % frames;

  const [frame, setFrame] = useState(() => {
    const i = Math.round(start_img) - 1;
    return ((i % frames) + frames) % frames;
  });
  const [ready, setReady] = useState<string[]>([]);
  const drag = useRef<{ x: number; frame: number } | null>(null);

  // Fetch each folder the first time it is actually shown, so variants the
  // visitor never opens are never downloaded. The frame index deliberately
  // survives a swap - you keep your angle when changing variant.
  useEffect(() => {
    if (ready.includes(dir)) return;
    let alive = true;
    preloadDir(dir, frames).then(() => {
      if (alive) setReady((r) => (r.includes(dir) ? r : [...r, dir]));
    });
    return () => {
      alive = false;
    };
  }, [dir, frames, ready]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = { x: e.clientX, frame };
    // capture keeps the drag alive past the element edge; not fatal if refused
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const steps = Math.round((e.clientX - drag.current.x) / PX_PER_FRAME);
    setFrame(wrap(drag.current.frame + steps));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    drag.current = null;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      /* ignore */
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setFrame((f) => wrap(f + 1));
    if (e.key === "ArrowLeft") setFrame((f) => wrap(f - 1));
  };

  const loaded = ready.includes(dir);

  return (
    <Box
      sx={{
        width: "100%",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        role="img"
        aria-label={`Rotatable view of ${label}. Use the arrow keys to turn it.`}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        sx={{
          position: "relative",
          width: frameWidth,
          aspectRatio: aspect,
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          touchAction: "pan-y", // keep vertical page scrolling on mobile
          userSelect: "none",
          outline: "none",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "text.primary",
            outlineOffset: 4,
            borderRadius: 2,
          },
        }}
      >
        {loaded ? (
          Array.from({ length: frames }, (_, i) => (
            <Box
              key={i}
              component="img"
              src={frameSrc(dir, i)}
              alt=""
              draggable={false}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                opacity: i === frame ? 1 : 0,
                pointerEvents: "none",
              }}
            />
          ))
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              loading...
            </Typography>
          </Box>
        )}
      </Box>

      {controls && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            // a variant can't be shown before its frames exist
            opacity: loaded ? 1 : 0.5,
            pointerEvents: loaded ? "auto" : "none",
            transition: "opacity 0.15s",
          }}
        >
          {controls}
        </Box>
      )}

      <Typography
        variant="body2"
        sx={{ mt: 1, textAlign: "center", color: "text.secondary" }}
      >
        drag to rotate
      </Typography>
    </Box>
  );
}

export default Turntable;
