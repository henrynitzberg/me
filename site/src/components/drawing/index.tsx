import { useState } from "react";
import { Box, ImageList, ImageListItem, useMediaQuery, useTheme } from "@mui/material";
import TabHeader from "../TabHeader";
import DrawingModal from "./DrawingModal";
import { works } from "../../content/drawing";

export default function Drawing() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

  const prev = () =>
    setSelectedIndex((i) =>
      i !== null ? (i - 1 + works.length) % works.length : null,
    );
  const next = () =>
    setSelectedIndex((i) => (i !== null ? (i + 1) % works.length : null));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: "24px" }}>
      <TabHeader
        src="/drawing.jpeg"
        text={
          <>
            I started drawing in middle school, kept up with it all through
            high school, and technically even went to art school for 1 week!
            Feeling somewhat burned out after doing commissions for the summer,
            I decided to switch to the studio art minor track in college so that I could pursue Computer
            Science and Mathematics as majors.
            <br /> My favorite mediums are ink and watercolor (or both).
          </>
        }
      />

      <ImageList variant="masonry" cols={isMobile ? 1 : 2} gap={12} sx={{ mt: "12px" }}>
        {works.map((work, i) => (
          <ImageListItem key={work.image} onClick={() => setSelectedIndex(i)}>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "#ffffffff",
                p: "4px",
                cursor: "pointer",
                userSelect: "none",
                "&:hover": { borderColor: "#000000ff" },
                "&:active": {
                  borderColor: "#000000ff",
                  p: "3px",
                  borderWidth: "2px",
                },
                transition: "border-color 150ms ease-in-out",
              }}
            >
              <Box
                component="img"
                src={work.image}
                alt={work.title}
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
