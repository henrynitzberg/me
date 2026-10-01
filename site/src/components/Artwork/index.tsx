import { useState } from "react";
import { Box } from "@mui/material";
import { works, type Work } from "../../content/drawing";
import { fadeUpSx } from "../../styles/entrance";
import WorkModal from "./WorkModal";

const COLUMNS = 2;

/**
 * Newest first. Dates are authored as "YYYY" or "YYYY-MM", so compare on
 * months-since-year-zero; a bare year sorts to the start of its own year.
 */
const dateKey = (date: string) => {
  const [year, month] = date.split("-");
  return Number(year) * 12 + (month ? Number(month) : 0);
};

/**
 * Split the works across columns, always adding the next piece to whichever
 * column is currently shortest.
 *
 * CSS `column-count` would be a one-liner, but it fills each column to the
 * bottom before starting the next - so the first half of the gallery ends up
 * entirely on the left. Balancing by accumulated height keeps the columns
 * level and preserves order across the page rather than down it.
 */
function balance(items: Work[], columns: number) {
  const cols: Work[][] = Array.from({ length: columns }, () => []);
  const heights = new Array(columns).fill(0);

  items.forEach((work) => {
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].push(work);
    // relative height once scaled to a common column width
    heights[shortest] += work.height / work.width;
  });

  return cols;
}

const Artwork = () => {
  // sort before balancing, so columns are filled in display order
  const sorted = [...works].sort((a, b) => dateKey(b.date) - dateKey(a.date));
  const columns = balance(sorted, COLUMNS);

  // index into `sorted`, so the modal's arrows follow what is on screen
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Box
      sx={{
        // same box as the projects grid: App already caps at MAX_WIDTH
        p: 2,
        pb: 8,
        display: "grid",
        // one column on phones, where two would make every piece tiny
        gridTemplateColumns: { xs: "1fr", sm: `repeat(${COLUMNS}, 1fr)` },
        gap: 2,
        alignItems: "start",
        // same treatment as the projects grid: hovering one piece desaturates
        // the rest. Scoped to real pointers - on touch :hover sticks after a
        // tap and would leave the gallery stuck grey.
        "@media (hover: hover)": {
          "&:has(.art-item:hover) .art-img": {
            filter: "grayscale(1) blur(1px)",
          },
          "& .art-item:hover .art-img": {
            filter: "grayscale(0) blur(0px)",
            transform: "scale(1)",
          },
        },
        maxWidth: "1000px",
        mx: "auto",
      }}
    >
      {columns.map((column, i) => (
        <Box key={i} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {column.map(({ image, title, width, height }, j) => (
            <Box
              key={image}
              className="art-item"
              role="button"
              tabIndex={0}
              aria-label={`View ${title}`}
              onClick={() =>
                setOpen(sorted.findIndex((w) => w.image === image))
              }
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen(sorted.findIndex((w) => w.image === image));
                }
              }}
              sx={{
                cursor: "pointer",
                ...fadeUpSx(i + j * COLUMNS),
                // reserve the space before the file arrives, so nothing jumps
                aspectRatio: `${width} / ${height}`,
                borderRadius: 2,
                // the scale zooms inside a fixed frame, so the frame must clip
                overflow: "hidden",
                backgroundColor: "#00000010",
              }}
            >
              <Box
                className="art-img"
                component="img"
                src={image}
                alt={title}
                loading="lazy"
                width={width}
                height={height}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transform: "scale(1.02)",
                  transition: "transform 0.15s, filter 0.15s",
                }}
              />
            </Box>
          ))}
        </Box>
      ))}

      <WorkModal
        works={sorted}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </Box>
  );
};

export default Artwork;
