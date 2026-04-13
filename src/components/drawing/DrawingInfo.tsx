import { Box, Typography } from "@mui/material";

function DrawingInfo() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "17px",
        maxWidth: 270,
        minWidth: 270,
        pt: "38px",
      }}
    >
      <Typography variant="h2" color="primary.main">
        Drawing
      </Typography>
      <Typography variant="h4" color="primary.main">
        I started drawing in middle school, painting in high school, briefly
        worked on a few sculpters in college. Since finishing my last art class
        in 2024 (and securing my minor in studio art) I haven't really felt to
        the urge to create like I used to.
      </Typography>
      <Typography variant="h4" color="primary.main">
        For a long time, I wanted to be the absolute best artist I could,
        whatever that means. I focused mainly on portaits. In recent years my
        engineering projects have been encroaching on the part of my brain that
        I am used to satisfying with drawing and painting.
      </Typography>
      
    </Box>
  );
}

export default DrawingInfo;
