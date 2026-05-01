import { useState } from "react";
import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import TabHeader from "../TabHeader";
import ClimbingModal from "./ClimbingModal";
import { climbs } from "../../content/climbing";

export default function Climbing() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const prev = () =>
    setSelectedIndex((i) =>
      i !== null ? (i - 1 + climbs.length) % climbs.length : null,
    );
  const next = () =>
    setSelectedIndex((i) => (i !== null ? (i + 1) % climbs.length : null));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: "24px" }}>
      <TabHeader
        src="climbing.jpg"
        text={
          <>
            Pictured left are the sunglasses of Rohan and myself, with two
            climbing gym brand nalgene bottles in the background. Taken on our
            trip to Tahoe. <p /> Pictured below are some photos from various
            outdoor excursions.
          </>
        }
      />
      {
        <ImageList variant="masonry" cols={3} gap={12} sx={{ mt: "12px" }}>
          {climbs.map((climb, i) => (
            <ImageListItem
              key={climb.image}
              onClick={() => setSelectedIndex(i)}
              sx={{ cursor: "pointer", userSelect: "none" }}
            >
              <Box
                sx={{
                  border: "1px solid",
                  p: "4px",
                  borderColor: "#9c9c9cff",
                  opacity: 0.925,
                  "&:hover": { borderColor: "#434343ff", opacity: 0.975 },
                  "&:active": { borderColor: "#000000ff", opacity: 1 },
                  transition:
                    "border-color 150ms ease-in-out, opacity 150ms ease-in-out",
                }}
              >
                <Box
                  component="img"
                  src={climb.image}
                  alt={climb.title}
                  loading="lazy"
                  decoding="async"
                  sx={{ width: "100%", height: "auto", display: "block" }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{ pt: "2px", pb: "2px", color: "text.secondary" }}
              >
                <strong>{climb.title}</strong> · {climb.date}
              </Typography>
            </ImageListItem>
          ))}
        </ImageList>
      }
      <ClimbingModal
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onPrev={prev}
        onNext={next}
      />
    </Box>
  );
}
