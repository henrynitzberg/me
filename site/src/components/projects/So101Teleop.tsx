import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MdOpenInNew } from "react-icons/md";
import type { Project } from "../../content/making";
import { MODEL_WIDTH } from "../../constants";
import { fadeUpSx } from "../../styles/entrance";
import HandTrackingDemo from "./HandTrackingDemo";

// Shape of this project's `data` blob in content/making.tsx. Owned here, so
// the content file stays free-form and only this page depends on the keys.
type So101Data = {
  video: string;
  poster: string;
  description: string;
};

// breadcrumb + title, animated in ProjectHeader
const HEADER_SLOTS = 2;

type Props = {
  project: Project;
};

function So101Teleop({ project }: Props) {
  const { video, poster, description } = project.data as So101Data;

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
          component="video"
          src={video}
          poster={poster}
          autoPlay
          loop
          muted
          // iOS refuses to autoplay without this, falling back to fullscreen
          playsInline
          // no controls: it is a silent loop, not something to scrub
          preload="metadata"
          sx={{
            width: "100%",
            display: "block",
            borderRadius: 2,
            // the poster shares the video's shape, so nothing jumps on load
            aspectRatio: "16 / 9",
            objectFit: "cover",
            backgroundColor: "#00000010",
          }}
        />
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
            borderBottom: "1px solid",
            borderColor: "#0000006a",
            py: 2,
          }}
        >
          <Typography sx={{ textAlign: "justify" }}>{description}</Typography>

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
              Full writeup in the README
              <MdOpenInNew size={14} aria-hidden />
            </Typography>
          )}
        </Box>
        <HandTrackingDemo />
      </Box>
    </Box>
  );
}

export default So101Teleop;
