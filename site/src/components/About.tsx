import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TypeHeader from "../hooks/TypeHeader";
import { tokens } from "../theme";
import { GraduationCap } from "lucide-react";

const LANGUAGES = ["C++", "C", "Python", "JS", "TS"];
const LIBRARIES = [
  "OpenCV",
  "PyTorch",
  "Tensorflow",
  "NumPy",
  "Stable Baselines",
  "IsaacSim",
  "ROS",
];
const TOOLS = ["Git", "Docker", "CAD"];
const SKILLS = {
  languages: LANGUAGES,
  libraries: LIBRARIES,
  tools: TOOLS,
};

export default function About() {
  const [header, setHeader] = useState("");
  useEffect(() => {
    TypeHeader({ setHeader: setHeader });
  }, []);

  return (
    <Box
      sx={{
        mx: "64px",
        my: 0,
        pt: "128px",
        px: "32px",
        pb: "32px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "80px",
      }}
    >
      {/* actual about section */}
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "32px" }}>
          <Box
            sx={{
              width: "225px",
              height: "225px",
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
            component="img"
            src="/me.jpg"
          />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Typography variant="h1" sx={{ minHeight: "39px" }}>
              {header}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: tokens.colors.surfaceTint,
              }}
            >
              My life is mostly comprised of making, drawing, and climbing.
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <GraduationCap size={22} />{" "}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: tokens.fontFamily.mono,
                  color: tokens.colors.onSurfaceVariant
                }}
              >
                Tufts University '25
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              p: "16px",
              border: `1px solid ${tokens.colors.outlineVariant}`,
              backgroundColor: `${tokens.colors.backgroundSubtle}`,
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {Object.entries(SKILLS).map(([categoryName, categoryItems]) => (
              <Box
                key={categoryName}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: tokens.fontFamily.mono,
                    color: tokens.colors.onPrimaryContainer,
                    fontSize: "10px",
                    textTransform: "uppercase",
                  }}
                >
                  {categoryName}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  {categoryItems.map((item) => (
                    <Box
                      key={item}
                      sx={{
                        px: "8px",
                        py: "2px",
                        borderRadius: "4px",
                        backgroundColor: tokens.colors.onPrimary,
                        border: `1px solid ${tokens.colors.outlineVariant}`,
                        fontFamily: tokens.fontFamily.mono,
                        fontSize: "12px",
                      }}
                    >
                      {item}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {/* projects */}
      <Box sx={{ display: "flex", flexDirection: "row", borderTop: `1px solid ${tokens.colors.borderHairline}` }}></Box>
    </Box>
  );
}
