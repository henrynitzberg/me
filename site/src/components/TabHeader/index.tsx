import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GlassBox from "../GlassBox/GlassBox";

interface TabHeaderProps {
  src: string;
  text: string | ReactNode;
  heading?: ReactNode;
}

const IMAGE_FRAME_RADIUS = 20;
const IMAGE_PADDING = 10;

// Glass frames just the image, not the header/body text next to it - unlike
// the tab switcher's pill, there's no need (or want) for body copy to be
// warped through refraction: legibility matters more here than the
// liquid-glass effect reaching all the way through it. The image, though,
// is exactly the kind of content a glass frame reads well around: it warps
// the starfield behind it like a real pane of glass would, the same
// relationship the AppBar itself has with the page.
function TabHeader({ src, text, heading }: TabHeaderProps) {
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = imageRef.current;
    if (!el) return;

    const measure = () =>
      setImageSize({ width: el.offsetWidth, height: el.offsetHeight });

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center", sm: "flex-start" },
        gap: "24px",
      }}
    >
      <Box sx={{ position: "relative", flexShrink: 0 }}>
        {imageSize.width > 0 && imageSize.height > 0 && (
          <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <GlassBox
              width={imageSize.width}
              height={imageSize.height}
              borderRadius={IMAGE_FRAME_RADIUS}
              backgroundOpacity={0.1}
            />
          </Box>
        )}
        <Box
          ref={imageRef}
          sx={{ position: "relative", zIndex: 1, p: `${IMAGE_PADDING}px` }}
        >
          <Box
            component="img"
            src={src}
            draggable={false}
            sx={{
              display: "block",
              borderRadius: `${IMAGE_FRAME_RADIUS - IMAGE_PADDING}px`,
              height: { xs: "auto", sm: 260 },
              maxHeight: { xs: 220, sm: "none" },
              maxWidth: { xs: "calc(95vw - 16px)", sm: "none" },
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {heading}
        <Typography variant="body1">{text}</Typography>
      </Box>
    </Box>
  );
}

export default TabHeader;
