import { useState } from "react";
import { Box, Collapse, Typography } from "@mui/material";
import { ExternalLink } from "lucide-react";
import { projects } from "../../content/making";
import TabHeader from "../TabHeader";
import MakingModal from "./MakingModal";

export default function Making() {
  const [currExpandedProject, setCurrExpandedProject] = useState<string | null>(
    null,
  );
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const openModal = (images: string[], index: number) => {
    setModalImages(images);
    setModalIndex(index);
  };
  const closeModal = () => setModalIndex(null);
  const prevModal = () =>
    setModalIndex((i) =>
      i !== null ? (i - 1 + modalImages.length) % modalImages.length : null,
    );
  const nextModal = () =>
    setModalIndex((i) => (i !== null ? (i + 1) % modalImages.length : null));

  const handleClickProject = (projectTitle: string) => {
    setCurrExpandedProject((prev) =>
      prev === projectTitle ? null : projectTitle,
    );
  };

  const isExpanded = (projectTitle: string) =>
    currExpandedProject === projectTitle;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", p: "24px" }}>
      {/* header */}
      <TabHeader
        src="/making.jpg"
        text={
          <>
            I love coding, woodworking, CAD, really any sort of tinkering.
            <br />
            At the moment I design and build software systems at{" "}
            <Typography
              component="a"
              target="_blank"
              rel="noopener noreferrer"
              href="https://nucleusbiologics.com"
              sx={{ color: "text.primary" }}
            >
              Nucleus Biologics
            </Typography>
            .
          </>
        }
      />
      {projects.map(
        (project) => {
          const expanded = isExpanded(project.title);
          return (
            <Box
              key={project.title}
              sx={{
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                userSelect: "none",
                "&:hover .project-title": {
                  textDecorationColor: "currentColor",
                },
                "&:active .project-title": { opacity: 0.5 },
              }}
              onClick={() => handleClickProject(project.title)}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  py: "12px",
                  gap: "12px",
                }}
              >
                <Box
                  sx={{
                    border: "1px solid #000000ff",
                    p: "4px",
                    height: "85px",
                  }}
                >
                  <Box
                    component="img"
                    src={project.image}
                    sx={{
                      width: "auto",
                      height: "75px",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    variant="body1"
                    className="project-title"
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "underline",
                      textDecorationColor: "transparent",
                      transition: "text-decoration-color 0.15s, opacity 0.2s",
                      width: "fit-content",
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: expanded ? "normal" : "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {project.date + " ⋅ " + project.description}
                  </Typography>
                  <Collapse in={expanded} timeout={300}>
                    {project.link && (
                      <Typography
                        variant="body2"
                        component="a"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          mt: "8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          color: "text.secondary",
                          textDecoration: "underline",
                          // slight hover
                          "&:hover": {
                            opacity: 0.75,
                          },
                          "&:active": {
                            opacity: 0.5,
                          },
                          transition: "opacity 0.2s",
                        }}
                      >
                        <ExternalLink size={14} />
                        link
                      </Typography>
                    )}
                    <Box sx={{ display: "flex", gap: "8px", mt: "12px" }}>
                      {project.extras.map((src, i) => (
                        <Box key={i}>
                          <Box
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(project.extras, i);
                            }}
                            sx={{
                              border: "1px solid #9c9c9cff",
                              p: "4px",
                              flex: 1,
                              minWidth: 0,
                              cursor: "pointer",
                              opacity: 0.925,
                              "&:hover": {
                                borderColor: "#434343ff",
                                opacity: 0.975,
                              },
                              "&:active": { borderColor: "#000", opacity: 1 },
                              transition:
                                "border-color 150ms ease-in-out, opacity 150ms ease-in-out",
                            }}
                          >
                            <Box
                              component="img"
                              src={src}
                              sx={{
                                width: "100%",
                                height: "auto",
                                maxHeight: "150px",
                                display: "block",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              </Box>
              <Box
                sx={{
                  borderTop: "1px solid #ccc",
                  width: "95%",
                  alignSelf: "center",
                }}
              />
            </Box>
          );
        },
        // project box
      )}
      <MakingModal
        images={modalImages}
        selectedIndex={modalIndex}
        onClose={closeModal}
        onPrev={prevModal}
        onNext={nextModal}
      />
    </Box>
  );
}
