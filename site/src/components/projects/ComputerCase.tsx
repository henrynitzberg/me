import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { Project } from "../../content/making";
import Turntable from "./Turntable";
import { MODEL_WIDTH } from "../../constants";
import { fadeUpSx } from "../../styles/entrance";

// Shape of this project's `data` blob in content/making.tsx. Owned here, so
// the content file stays free-form and only this page depends on the keys.
type ComputerCaseData = {
  description: string;
  extras: string[];
};

const CASE_TURNTABLE = "/making/computer-case/turntable";

/** Each panel toggles independently; the pair picks one of the four sets. */
const setFor = (left: boolean, right: boolean) =>
  left && right
    ? "both"
    : !left && right
      ? "left-off"
      : left && !right
        ? "right-off"
        : "both-off";

// breadcrumb + title, animated in ProjectHeader
const HEADER_SLOTS = 2;

type Props = {
  project: Project;
};

function ComputerCase({ project }: Props) {
  const { description } = project.data as ComputerCaseData;

  const [left, setLeft] = useState(true);
  const [right, setRight] = useState(true);
  const panels = [
    { key: "left" as const, label: "Left panel", on: left, set: setLeft },
    { key: "right" as const, label: "Right panel", on: right, set: setRight },
  ];
  // Life photo is set aside for now - restore alongside the block below:
  const { extras } = project.data as ComputerCaseData;
  // by name rather than index, so reordering `extras` can't silently swap it
  const life = extras.find((src) => src.includes("life"));

  return (
    <Box sx={{ px: { xs: 3, sm: 6 }, pb: 8 }}>
      {/* ProjectHeader takes cascade slots 0-1, so the body continues from 2 */}
      <Box sx={fadeUpSx(HEADER_SLOTS)}>
        <Turntable
          dir={`${CASE_TURNTABLE}/${setFor(left, right)}`}
          label="the computer case"
          aspect="800 / 724"
          frameWidth={{ xs: "90%", sm: "60%" }}
          start_img={16}
          controls={panels.map(({ key, label, on, set }) => (
            <Typography
              key={key}
              component="button"
              variant="overline"
              onClick={() => set((v) => !v)}
              aria-pressed={on}
              sx={{
                fontSize: "13px",
                lineHeight: 1,
                px: 1.5,
                py: 1,
                border: "1px solid",
                borderColor: on ? "text.primary" : "divider",
                opacity: on ? 1 : 0.5,
                borderRadius: "16px",
                background: "none",
                color: "inherit",
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "opacity 0.15s, border-color 0.15s",
                "&:hover": { opacity: 1 },
              }}
            >
              {label}
            </Typography>
          ))}
        />
      </Box>

      <Box
        sx={{
          ...fadeUpSx(HEADER_SLOTS + 1),
          mt: 2,
          mx: "auto",
          maxWidth: MODEL_WIDTH, // line the copy up with the turntable
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "flex-start",
          gap: 3,
        }}
      >
        <Typography
          sx={{
            width: "100%",
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "#0000006a",
            py: 2,
            textAlign: "justify",
          }}
        >
          {description}
        </Typography>
      </Box>
      {life && (
        <Box
          component="img"
          src={life}
          alt="The finished case on a desk, its brushed aluminium side panel cut with diagonal vent slots and two round fan openings."
          loading="lazy"
          sx={{
            ...fadeUpSx(HEADER_SLOTS + 2),
            // a fixed width can't shrink, so it overflowed between the sm
            // breakpoint and ~900px wide - cap it instead
            width: "100%",
            maxWidth: MODEL_WIDTH - 50,
            display: "block", // an img is inline by default; auto margins
            mx: "auto", // only centre a block-level element
            borderRadius: 2,
            // margin, not padding: padding sits inside the rounded border box,
            // so the image's own top corners would stay square
            mt: 2,
          }}
        />
      )}
    </Box>
  );
}

export default ComputerCase;
