import { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MdOpenInNew } from "react-icons/md";
import type { Project } from "../../content/making";
import { MODEL_WIDTH } from "../../constants";
import { fadeUpSx } from "../../styles/entrance";

// Shape of this project's `data` blob in content/making.tsx. Owned here, so
// the content file stays free-form and only this page depends on the keys.
type Section = {
  heading: string;
  body: string;
};

type AiPolicyDbData = {
  embed: string;
  intro: string;
  stack: string[];
  sections: Section[];
};

// breadcrumb + title, animated in ProjectHeader
const HEADER_SLOTS = 2;

// The iframe is rendered at desktop width and scaled down, so the site inside
// lays out as it would on a real monitor rather than collapsing to its mobile
// breakpoint inside a narrow frame.
const LIVE_GREEN = "#2ea043";

// Breathes between dim and full rather than blinking: the floor sits well
// above zero so it never reads as a glitch or a broken image.
const pulse = keyframes({
  "0%, 100%": { opacity: 1 },
  "50%": { opacity: 0.35 },
});

const EMBED_WIDTH = 1440;
const EMBED_HEIGHT = 900;

function AiPolicyDb({ project }: Props) {
  const { embed, intro, stack, sections } = project.data as AiPolicyDbData;

  // The iframe is a fixed EMBED_WIDTH so the site inside lays out as it would
  // on a monitor, then scaled to fit. That scale has to track the real
  // container width - a constant based on MODEL_WIDTH overflows every screen
  // narrower than it, which is every phone.
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(MODEL_WIDTH / EMBED_WIDTH);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / EMBED_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box sx={{ px: { xs: 3, sm: 6 }, pb: 8 }}>
      {/* ProjectHeader takes cascade slots 0-1, so the body continues from 2 */}
      <Box
        sx={{
          ...fadeUpSx(HEADER_SLOTS),
          mx: "auto",
          maxWidth: MODEL_WIDTH,
        }}
      >
        <Box
          ref={frameRef}
          sx={{
            position: "relative",
            width: "100%",
            // reserve the scaled height so the page does not jump on load
            aspectRatio: `${EMBED_WIDTH} / ${EMBED_HEIGHT}`,
            overflow: "hidden",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "#0000006a",
          }}
        >
          <Box
            component="iframe"
            src={embed}
            title="AI Policy Database, live"
            loading="lazy"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: EMBED_WIDTH,
              height: EMBED_HEIGHT,
              border: 0,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </Box>

        <Box
          sx={{
            mt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0.75,
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              backgroundColor: LIVE_GREEN,
              animation: `${pulse} 2s ease-in-out infinite`,
              "@media (prefers-reduced-motion: reduce)": { animation: "none" },
            }}
          />
          <Typography
            variant="overline"
            sx={{ fontSize: "12px", lineHeight: 1, color: "text.secondary" }}
          >
            Live
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          ...fadeUpSx(HEADER_SLOTS + 1),
          mt: 2,
          mx: "auto",
          maxWidth: MODEL_WIDTH,
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderTop: "1px solid",
            borderColor: "#0000006a",
            py: 2,
          }}
        >
          <Typography sx={{ textAlign: "justify" }}>{intro}</Typography>

          <Box sx={{ mt: 3 }}>
            <Typography
              variant="overline"
              sx={{
                display: "block",
                fontSize: "13px",
                lineHeight: 1.6,
                color: "text.secondary",
              }}
            >
              Tech Stack
            </Typography>
            <Box sx={{ mt: 0.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {stack.map((tech) => (
                <Typography
                  key={tech}
                  variant="overline"
                  sx={{
                    fontSize: "12px",
                    lineHeight: 1,
                    px: 1.25,
                    py: 0.75,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: "7px",
                    color: "text.secondary",
                  }}
                >
                  {tech}
                </Typography>
              ))}
            </Box>
          </Box>

          {sections.map(({ heading, body }) => (
            <Box key={heading} sx={{ mt: 3 }}>
              <Typography
                variant="overline"
                sx={{
                  display: "block",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "text.secondary",
                }}
              >
                {heading}
              </Typography>
              <Typography sx={{ textAlign: "justify" }}>{body}</Typography>
            </Box>
          ))}

          {project.link && (
            <Typography
              component="a"
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                // the <p> above is block-level, so this starts its own line
                mt: 3,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "inherit",
                textDecoration: "underline",
                transition: "opacity 0.15s",
                "&:hover": { opacity: 0.6 },
              }}
            >
              aipolicydb.com
              <MdOpenInNew size={14} aria-hidden />
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

type Props = {
  project: Project;
};

export default AiPolicyDb;
