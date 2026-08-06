import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ExternalLink } from "lucide-react";
import { projects } from "../../content/making";

interface ProjectDetailsProps {
  project: (typeof projects)[number];
}

const LINK_ICON_CLASS = "project-details-title-link-icon";

// Back navigation lives in the AppBar now (a circular button that shrinks
// the bar to make room for itself), not here - see AppBar.tsx.
function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Box>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            // both states need to live in this same sx (stylesheet) rule,
            // not split with an inline style on the icon itself - an inline
            // style has higher specificity than any class-based rule (short
            // of !important), so an inline opacity:0 on the icon would keep
            // beating this rule's opacity:1 on hover no matter what
            [`& .${LINK_ICON_CLASS}`]: {
              opacity: 0,
              transition: "opacity 0.15s",
            },
            [`&:hover .${LINK_ICON_CLASS}`]: { opacity: 1 },
          }}
        >
          <Typography
            variant="h4"
            component={project.link ? "a" : "span"}
            {...(project.link
              ? {
                  href: project.link,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {})}
            sx={{
              color: "text.primary",
              fontWeight: "bold",
              textDecoration: project.link ? "underline" : "none",
              ...(project.link && {
                transition: "opacity 0.15s",
                "&:hover": { opacity: 0.75 },
                "&:active": { opacity: 0.5 },
              }),
            }}
          >
            {project.title}
          </Typography>
          {project.link && (
            <ExternalLink
              className={LINK_ICON_CLASS}
              size={20}
              style={{ flexShrink: 0 }}
            />
          )}
        </Box>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {project.date}
        </Typography>
      </Box>

      <Typography variant="body1">{project.description}</Typography>

      {project.extras.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {project.extras.map((src) => (
            <Box
              key={src}
              component="img"
              src={src}
              draggable={false}
              sx={{
                display: "block",
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default ProjectDetails;
