import { Box, Typography } from "@mui/material";

function DrawingInfo() {
  return (
    <Box
      sx={{
        pt: "38px",
        display: "flex",
        flexDirection: "column",
        gap: "17px",
        maxWidth: 270,
        minWidth: 270,
      }}
    >
      <Typography variant="h2" color="primary.main">
        Making
      </Typography>
      <Typography variant="h4" color="primary.main">
        Woodworking, 3D printing, coding or some combination of the three.
      </Typography>
    </Box>
  );
}

export default DrawingInfo;
