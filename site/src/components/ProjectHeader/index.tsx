import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router";
import { fadeUpSx } from "../../styles/entrance";

type Props = {
  title: string;
};

function ProjectHeader({ title }: Props) {
  return (
    <Box
      component="header"
      sx={{
        px: { xs: 3, sm: 6 },
        pt: { xs: 7, sm: 10 }, // clears the fixed nav pill
        pb: { xs: 3, sm: 5 },
      }}
    >
      <Typography
        component={Link}
        to="/"
        variant="overline"
        sx={{
          ...fadeUpSx(0),
          display: "inline-block",
          mb: 1,
          fontSize: "14px",
          color: "text.secondary",
          textDecoration: "none",
          transition: "margin-left 0.15s",
          "&:hover": {
            color: "text.primary",
            ml: -0.5,
          },
        }}
      >
        {"< Projects"}
      </Typography>
      <Typography
        variant="h1"
        sx={{
          ...fadeUpSx(1),
          fontWeight: 700,
          fontSize: { xs: "2.5rem", sm: "4rem" },
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

export default ProjectHeader;
