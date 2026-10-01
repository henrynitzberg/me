import { Box, Typography } from "@mui/material";
import { Link } from "react-router";
import { projects } from "../../content/making";
import { fadeUpSx } from "../../styles/entrance";

const MIN_SIZE = 150; // px
const MAX_SIZE = 275; // px

// content dates are authored as "YYYY-MM"
const formatDate = (date: string) => {
  const [year, month] = date.split("-");
  return `${month}/${year}`;
};

const Portfolio = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${MIN_SIZE}px, ${MAX_SIZE}px))`,
        justifyContent: "center", // centers leftover space once tracks hit max
        gap: 2,
        p: 2,
        "@media (hover: hover)": {
          "&:has(.portfolio-item:hover) .portfolio-img": {
            filter: "grayscale(1) blur(1px)",
          },
          "& .portfolio-item:hover .portfolio-img": {
            filter: "grayscale(0) blur(0px)",
          },
        },
      }}
    >
      {projects.map(({ image, title, date, slug }, i) => (
        <Box
          className="portfolio-item"
          key={slug}
          component={Link}
          to={`/projects/${slug}`}
          sx={{
            color: "inherit",
            textDecoration: "none",
            ...fadeUpSx(i),
            "&:hover": {
              cursor: "pointer",
            },
            "&:hover .portfolio-img": {
              transform: "scale(1)",
            },
            "&:hover .portfolio-title": {
              ml: 0.5,
            },
          }}
        >
          <Box
            sx={{
              aspectRatio: "1 / 1",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              className="portfolio-img"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                backgroundImage: `url("${image}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transform: "scale(1.02)",
                transition: "transform 0.15s, filter 0.15s",
              }}
            />
          </Box>
          <Box
            className="portfolio-text"
            sx={{
              mt: 0.5,
              ml: 0.5,

              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", lineHeight: 1 }}
            >
              {formatDate(date)}
            </Typography>
            <Typography
              className="portfolio-title"
              sx={{ transition: "margin-left 0.15s", fontWeight: "bold" }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default Portfolio;
