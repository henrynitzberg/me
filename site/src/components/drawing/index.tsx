import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TabHeader from "../TabHeader";
import DrawingModal from "./DrawingModal";
import { works } from "../../content/drawing";

function Drawing() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

  const prev = () =>
    setSelectedIndex((i) =>
      i !== null ? (i - 1 + works.length) % works.length : null,
    );
  const next = () =>
    setSelectedIndex((i) => (i !== null ? (i + 1) % works.length : null));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <TabHeader
        src="/drawing.jpeg"
        heading={
          <Typography variant="h5" sx={{ color: "text.primary" }}>
            Drawing
          </Typography>
        }
        text={
          <>
            I started drawing in middle school, kept up with it all through
            high school, and technically even went to art school for 1 week!
            Feeling somewhat burned out after doing commissions for the
            summer, I decided to switch to the studio art minor track in
            college so that I could pursue Computer Science and Mathematics
            as majors.
            <br />
            My favorite mediums are ink and watercolor (or both).
          </>
        }
      />

      <ImageList
        variant="masonry"
        cols={isMobile ? 1 : 2}
        gap={20}
        // MUI's ImageList root defaults to overflowY: "auto" regardless of
        // variant, which clips the hover lift/shadow the moment it extends
        // past the grid's own box (most visibly the top row, translating
        // up into space the grid otherwise clips as if it were overflow).
        sx={{ overflowY: "visible" }}
      >
        {works.map((work, i) => (
          <ImageListItem
            key={work.image}
            onClick={() => setSelectedIndex(i)}
            data-cursor="pointer"
          >
            <Box
              sx={{
                cursor: "pointer",
                userSelect: "none",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                // translateY, matching the same hover lift ProjectCard
                // uses, for a consistent feel across both tabs' grids
                transition:
                  "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 28px rgba(0, 0, 0, 0.35)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                },
              }}
            >
              <Box
                component="img"
                src={work.image}
                alt={work.title}
                draggable={false}
                sx={{ width: "100%", height: "auto", display: "block" }}
              />
            </Box>
          </ImageListItem>
        ))}
      </ImageList>

      <DrawingModal
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onPrev={prev}
        onNext={next}
      />
    </Box>
  );
}

export default Drawing;
