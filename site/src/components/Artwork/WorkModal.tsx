import { useCallback, useEffect } from "react";
import { Box, Modal, Typography } from "@mui/material";
import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import type { Work } from "../../content/drawing";

type Props = {
  works: Work[];
  /** Index of the open work, or null when the modal is closed. */
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const control = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  border: "none",
  borderColor: "#ffffff44",
  background: "none",
  color: "#eeece3",
  cursor: "pointer",
  flexShrink: 0,
  transition: "opacity 0.15s",
  "&:hover": { opacity: 0.6 },
};

function WorkModal({ works, index, onClose, onNavigate }: Props) {
  const open = index !== null;
  const work = open ? works[index] : null;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      // wrap, so the ends are not dead
      onNavigate((index + delta + works.length) % works.length);
    },
    [index, works.length, onNavigate],
  );

  // Arrow keys move between pieces. Escape is handled by Modal itself.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="work-title"
      slotProps={{
        backdrop: { sx: { backgroundColor: "#0b0000e6" } },
      }}
    >
      <Box
        // clicking the surround closes; clicks on the content stop here
        onClick={onClose}
        sx={{
          position: "absolute",
          inset: 0,
          outline: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          p: { xs: 2, sm: 4 },
          overflowY: "auto",
        }}
      >
        <Typography
          component="button"
          onClick={onClose}
          aria-label="Close"
          sx={{ ...control, position: "absolute", top: 16, right: 16 }}
        >
          <MdClose size={18} />
        </Typography>

        {work && (
          <Box
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 3 },
              maxWidth: "100%",
            }}
          >
            {works.length > 1 && (
              <Typography
                component="button"
                onClick={() => step(-1)}
                aria-label="Previous work"
                sx={{ ...control, display: { xs: "none", sm: "flex" } }}
              >
                <MdChevronLeft size={22} />
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                minWidth: 0,
              }}
            >
              <Box
                component="img"
                // keyed on src so React swaps the element rather than
                // leaving the previous picture up while the next decodes
                key={work.full}
                src={work.full}
                alt={work.title}
                sx={{
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: { xs: "58vh", sm: "72vh" },
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />

              <Box sx={{ maxWidth: "60ch", color: "#eeece3" }}>
                <Typography id="work-title" sx={{ fontWeight: "bold" }}>
                  {work.title}
                </Typography>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block",
                    fontSize: "12px",
                    lineHeight: 1.8,
                    opacity: 0.65,
                  }}
                >
                  {work.date} &middot; {work.media}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.85 }}>
                  {work.description}
                </Typography>
              </Box>
            </Box>

            {works.length > 1 && (
              <Typography
                component="button"
                onClick={() => step(1)}
                aria-label="Next work"
                sx={{ ...control, display: { xs: "none", sm: "flex" } }}
              >
                <MdChevronRight size={22} />
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Modal>
  );
}

export default WorkModal;
