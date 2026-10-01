import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useTypeHeader from "../../hooks/useTypeHeader";

function Header() {
  const header = useTypeHeader();

  return (
    <Box
      component="header"
      sx={{
        px: { xs: 3, sm: 6 },
        py: { xs: 5, sm: 8 },
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontWeight: 700,
          whiteSpace: "pre",
          userSelect: "none",
          fontSize: { xs: "2.5rem", sm: "4rem" },
        }}
      >
        {header}
      </Typography>
      <Typography
        sx={{
          whiteSpace: "pre",
          userSelect: "none",
        }}
      >
        Here's some of my work --
      </Typography>
    </Box>
  );
}

export default Header;
