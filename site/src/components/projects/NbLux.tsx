import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MdOpenInNew } from "react-icons/md";
import type { Project } from "../../content/making";
import Carousel from "./Carousel";
import { MODEL_WIDTH } from "../../constants";
import { fadeUpSx } from "../../styles/entrance";

// Shape of this project's `data` blob in content/making.tsx. Owned here, so
// the content file stays free-form and only this page depends on the keys.
type Section = {
  heading: string;
  body: string;
};

type NbLuxData = {
  intro: string;
  stack: string[];
  sections: Section[];
  extras: string[];
};

// breadcrumb + title, animated in ProjectHeader
const HEADER_SLOTS = 2;

type Props = {
  project: Project;
};

function NbLux({ project }: Props) {
  const { intro, stack, sections, extras } = project.data as NbLuxData;

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
        <Carousel
          images={extras}
          alt={project.title}
          // screenshots are landscape and vary in shape, so letterbox rather
          // than crop - a cropped UI capture loses interface
          aspect="16 / 10"
          fit="contain"
          // 80 rather than the rover's 62: enough peek to show there is more,
          // without shrinking the screenshots past legibility
          slidePct={80}
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
              nb-lux.com
              <MdOpenInNew size={14} aria-hidden />
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default NbLux;
