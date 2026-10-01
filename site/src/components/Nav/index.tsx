import { Box, Typography } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { Link, NavLink } from "react-router";
import { links } from "../../content/links";
import { MAX_WIDTH } from "../../constants";

const ROUTES = [
  { label: "Projects", to: "/" },
  { label: "Artwork", to: "/artwork" },
];

const pill = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 2,
  height: 40,
  borderRadius: "20px",
  backdropFilter: "blur(5px)",
  backgroundColor: (theme: Theme) => theme.palette.background.default + "64",
  width: "fit-content",
  px: 2,
  my: 0.5,
} as const;

const Nav = () => {
  return (
    <Box
      component="nav"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        width: "100%",
        maxWidth: MAX_WIDTH,
        mx: "auto",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography
        component={Link}
        to="/"
        aria-label="Home"
        variant="overline"
        sx={{
          ...pill,
          position: "absolute",
          top: 0,
          left: 10,
          color: "inherit",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        HN
      </Typography>

      <Box sx={pill}>
        {ROUTES.map(({ label, to }) => (
          <Typography
            key={to}
            component={NavLink}
            to={to}
            end
            variant="overline"
            sx={{
              fontSize: "14px",
              color: "inherit",
              textDecoration: "none",
              "&.active": {
                fontWeight: "bold",
                textDecoration: "underline",
              },
            }}
          >
            {label}
          </Typography>
        ))}
      </Box>

      <Box sx={{ ...pill, position: "absolute", top: 0, right: 10 }}>
        {links.map(({ Icon, label, href, target }) => (
          <Box
            key={label}
            component="a"
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            aria-label={label}
            title={label}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "inherit",
              opacity: 0.75,
              transition: "opacity 0.15s",
              "&:hover": { opacity: 1 },
            }}
          >
            <Icon size={18} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Nav;
