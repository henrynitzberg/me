import { Box, Typography } from "@mui/material";

function ClimbingInfo() {
  const getConsistentClimbingDays = () => {
    // September 1, 2024
    const startDate = new Date(2024, 8, 1);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return (
      <Typography variant="h4" component="span" sx={{ fontWeight: 600 }}>
        {diffDays}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "17px",
        maxWidth: 270,
        minWidth: 270,
        pt: "38px"
      }}
    >
      <Typography variant="h2" color="primary.main">
        Climbing
      </Typography>
      <Typography variant="h4" color="primary.main">
        I love rock climbing. Maybe even more than cheese.
      </Typography>
      <Typography variant="h4" color="primary.main">
        I’ve been climbing on and off since middle school, and consistently for
        ~{getConsistentClimbingDays()} days. My (2016) moon board obsession is
        approaching addiction, so I don’t climb outside enough, and have a
        perpetually injured left shoulder.
      </Typography>
    </Box>
  );
}

export default ClimbingInfo;
