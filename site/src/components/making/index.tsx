import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TabHeader from "../TabHeader";
import useTypeHeader from "../../hooks/useTypeHeader";
import ProjectCard from "./ProjectCard";
import ProjectDetails from "./ProjectDetails";
import { projects } from "../../content/making";

interface MakingProps {
  // Which project's detail view is open, if any - lifted to App.tsx so the
  // AppBar's back button can control it, so this is a plain controlled
  // component for it rather than owning the state itself.
  selectedProject: (typeof projects)[number] | null;
  onSelectProject: (project: (typeof projects)[number] | null) => void;
}

function Making({ selectedProject, onSelectProject }: MakingProps) {
  const header = useTypeHeader();

  if (selectedProject) {
    return <ProjectDetails project={selectedProject} />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <TabHeader
        src="/making.jpg"
        heading={
          <Typography
            variant="h5"
            sx={{
              color: "text.primary",
              // reserves the line's height from the very first frame, before
              // the hook has typed any characters - without it the heading
              // (and the card around it, which measures this content) would
              // start at zero height and jump once typing begins
              minHeight: "1.4em",
              whiteSpace: "nowrap",
            }}
          >
            {header}
          </Typography>
        }
        text={
          <>
            I love coding, woodworking, CAD, really any sort of tinkering.
            <br />
            Until recently, I designed and built software systems at{" "}
            <Typography
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://nucleusbiologics.com"
              sx={{
                color: "text.primary",
                textDecoration: "underline",
                transition: "opacity 0.15s",
                "&:hover": { opacity: 0.75 },
                "&:active": { opacity: 0.5 },
              }}
            >
              Nucleus Biologics
            </Typography>
            .
          </>
        }
      />

      <Box
        sx={{
          display: "grid",
          // minmax(0, 1fr), not a bare 1fr - a plain 1fr track still won't
          // shrink a cell below its content's intrinsic (min-content) size,
          // and an <img>'s min-content width is its natural pixel size
          // regardless of any CSS width:100% on it, so without the minmax
          // every column - and every card in it - stretches to fit whichever
          // project photo happens to be widest.
          gridTemplateColumns: {
            xs: "minmax(0, 1fr)",
            sm: "repeat(2, minmax(0, 1fr))",
          },
          gap: "20px",
        }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            onClick={() => onSelectProject(project)}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Making;
