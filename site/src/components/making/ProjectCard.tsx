import { useLayoutEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import GlassBox from "../GlassBox/GlassBox";
import { projects } from "../../content/making";

const CARD_BORDER_RADIUS = 20;
const IMAGE_ASPECT_RATIO = "16 / 10";

interface ProjectCardProps {
  project: (typeof projects)[number];
  onClick: () => void;
}

// Same glass-frames-media-not-text approach as TabHeader: the card's own
// glass sits behind everything (so it warps the starfield behind the card,
// not the title/description text on top of it), while the image gets its
// own thin border rather than a second nested glass layer - one glass
// surface per card reads cleanly, stacking more would just compete with
// itself.
function ProjectCard({ project, onClick }: ProjectCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () =>
      setSize({ width: el.offsetWidth, height: el.offsetHeight });

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      onClick={onClick}
      data-cursor="pointer"
      sx={{
        position: "relative",
        cursor: "pointer",
        userSelect: "none",
        // translateY, not scale - a scale() on any ancestor of a
        // backdrop-filter element (the GlassBox below) breaks Chromium's
        // backdrop capture for it, even sitting still. translate doesn't
        // trigger that, so the lift has to be a plain translate here; the
        // GlassBox's own hoverBounceDeltaScale (scaling itself, not an
        // ancestor) is what's safe to use for the "pop" part of the hover.
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.35)",
        },
      }}
    >
      {size.width > 0 && size.height > 0 && (
        <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <GlassBox
            width={size.width}
            height={size.height}
            borderRadius={CARD_BORDER_RADIUS}
            backgroundOpacity={0.08}
            hoverBounceDeltaScale={0.025}
          />
        </Box>
      )}
      <Box
        ref={contentRef}
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          p: "20px",
        }}
      >
        <Box
          component="img"
          src={project.image}
          draggable={false}
          sx={{
            display: "block",
            width: "100%",
            aspectRatio: IMAGE_ASPECT_RATIO,
            objectFit: "cover",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "12px",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {project.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", flexShrink: 0 }}
          >
            {project.date}
          </Typography>
        </Box>

        {/* single-line preview only for now - full description, the link,
            and extras all come back later */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {project.description}
        </Typography>
      </Box>
    </Box>
  );
}

export default ProjectCard;
