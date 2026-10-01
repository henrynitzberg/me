import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Navigate, useParams } from "react-router";
import { projects } from "../../content/making";
import { projectPages } from "../projects";
import ProjectHeader from "../ProjectHeader";

function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);

  // unknown slug (stale link, typo) - send them back to the grid
  if (!project) return <Navigate to="/" replace />;

  const Custom = projectPages[project.slug];

  return (
    <>
      <ProjectHeader title={project.title} />
      {Custom ? (
        <Custom project={project} />
      ) : (
        <Box sx={{ px: { xs: 3, sm: 6 }, pb: 8 }}>
          <Typography sx={{ color: "text.secondary" }}>
            Write-up coming soon.
          </Typography>
        </Box>
      )}
    </>
  );
}

export default ProjectPage;
