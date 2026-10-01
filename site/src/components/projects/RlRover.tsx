import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { MdOpenInNew } from "react-icons/md";
import type { Project } from "../../content/making";
import Carousel from "./Carousel";
import Turntable from "./Turntable";
import { MODEL_WIDTH } from "../../constants";
import { fadeUpSx } from "../../styles/entrance";

// Shape of this project's `data` blob in content/making.tsx. Owned here, so
// the content file stays free-form and only this page depends on the keys.
type Material = {
  title: string;
  link: string;
  img?: string; // optional - a part may have no photo yet
};

type RlRoverData = {
  description: string;
  materials: Material[];
  extras: string[];
};

// breadcrumb + title, animated in ProjectHeader
const HEADER_SLOTS = 2;

type Props = {
  project: Project;
};

function RlRover({ project }: Props) {
  const { description, materials, extras } = project.data as RlRoverData;
  // the grid thumbnail leads, then the rest
  const images = [project.image, ...extras];

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
        <Carousel images={images} alt={project.title} />
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
            borderBottom: "1px solid",
            borderTop: "1px solid",
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
                mt: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                color: "inherit",
                textDecoration: "underline",
                transition: "opacity 0.15s",
                "&:hover": { opacity: 0.6 },
              }}
            >
              Repo
              <MdOpenInNew size={14} aria-hidden />
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          ...fadeUpSx(HEADER_SLOTS + 2),
          mt: 2,
          mx: "auto",
          maxWidth: MODEL_WIDTH,
          borderBottom: "1px solid",
          borderColor: "#0000006a",
          pb: 2,
        }}
      >
        <Typography
          variant="overline"
          sx={{ fontSize: "14px", color: "text.secondary" }}
        >
          Custom Bracket
        </Typography>
        <Turntable
          dir="/making/rl-rover/bracket"
          label="the custom sensor bracket"
          aspect="800 / 475"
          frameWidth={{ xs: "90%", sm: "60%" }}
          start_img={2}
        />
      </Box>

      <Box
        sx={{
          ...fadeUpSx(HEADER_SLOTS + 3),
          mt: 4,
          mx: "auto",
          maxWidth: MODEL_WIDTH,
        }}
      >
        <Typography
          variant="overline"
          sx={{ fontSize: "14px", color: "text.secondary" }}
        >
          Materials
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 2,
          }}
        >
          {materials.map(({ title, link, img }) => (
            <Box
              key={link}
              component="a"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "block",
                color: "inherit",
                textDecoration: "none",
                "&:hover .material-img": { scale: 1 },
                // the icon grows from zero width, so the title is pushed
                // aside by layout rather than needing its own transition
                "@media (hover: hover)": {
                  "&:hover .material-icon": { width: 14, opacity: 1, mr: 0.5 },
                },
              }}
            >
              {img && (
                <Box
                  className="material-img"
                  component="img"
                  src={img}
                  alt=""
                  loading="lazy"
                  sx={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "contain",
                    display: "block",
                    scale: 1.02,
                    transition: "scale 0.15s",
                  }}
                />
              )}
              <Box sx={{ mt: 0.5, display: "flex", alignItems: "center" }}>
                <Box
                  className="material-icon"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    width: 0,
                    opacity: 0,
                    overflow: "hidden", // clip the svg while collapsed
                    transition:
                      "width 0.15s, opacity 0.15s, margin-right 0.15s",
                  }}
                >
                  <MdOpenInNew size={14} opacity={0.8} aria-hidden />
                </Box>
                <Typography className="material-title" variant="body2">
                  {title}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default RlRover;
