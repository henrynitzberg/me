import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TabHeader from "../TabHeader";
import ClimbingModal from "./ClimbingModal";
import { climbs } from "../../content/climbing";

function Climbing() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const prev = () =>
    setSelectedIndex((i) =>
      i !== null ? (i - 1 + climbs.length) % climbs.length : null,
    );
  const next = () =>
    setSelectedIndex((i) => (i !== null ? (i + 1) % climbs.length : null));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <TabHeader
        src="/climbing.jpg"
        heading={
          <Typography variant="h5" sx={{ color: "text.primary" }}>
            Climbing
          </Typography>
        }
        text={
          <>
            Pictured left are the sunglasses of Rohan and myself, with two
            climbing gym brand nalgene bottles in the background. Taken on
            our trip to Tahoe.
            <br />
            Pictured below are some photos from various outdoor excursions.
          </>
        }
      />

      <ImageList
        variant="masonry"
        cols={isMobile ? 1 : isTablet ? 2 : 3}
        gap={20}
        sx={{ overflowY: "visible" }}
      >
        {climbs.map((climb, i) => (
          <ImageListItem
            key={climb.image}
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
                src={climb.image}
                alt={climb.title}
                draggable={false}
                sx={{ width: "100%", height: "auto", display: "block" }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{ pt: "6px", color: "text.secondary" }}
            >
              <strong>{climb.title}</strong> ⋅ {climb.date}
            </Typography>
          </ImageListItem>
        ))}
      </ImageList>

      <ClimbingModal
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onPrev={prev}
        onNext={next}
      />
    </Box>
  );
}

export default Climbing;
