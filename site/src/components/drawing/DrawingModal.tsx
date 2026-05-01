import { useEffect, useState } from "react";
import { Box, Fade, Modal, Typography } from "@mui/material";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { works } from "../../content/drawing";

interface DrawingModalProps {
  selectedIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function DrawingModal({
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: DrawingModalProps) {
  const [displayedIndex, setDisplayedIndex] = useState(selectedIndex);
  useEffect(() => {
    if (selectedIndex !== null) setDisplayedIndex(selectedIndex);
  }, [selectedIndex]);

  const isOpen = selectedIndex !== null;
  const selected = displayedIndex !== null ? works[displayedIndex] : null;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
    if (e.key === "Escape") onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onKeyDown={handleKey}
      closeAfterTransition
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0, 0, 0, 0.85)" } } }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Fade in={isOpen}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: { xs: "90vw", sm: "auto" },
          maxWidth: "90vw",
          maxHeight: "90vh",
          outline: "none",
          position: "relative",
        }}
      >
        {/* Prev arrow */}
        <Box
          onClick={onPrev}
          sx={{
            position: "absolute",
            left: { xs: "8px", sm: "calc(5vw - 48px)" },
            top: { xs: "auto", sm: "50%" },
            bottom: { xs: "8px", sm: "auto" },
            transform: { xs: "none", sm: "translateY(-50%)" },
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            opacity: 0.7,
            bgcolor: { xs: "rgba(0,0,0,0.35)", sm: "transparent" },
            borderRadius: { xs: "50%", sm: 0 },
            p: { xs: "2px", sm: 0 },
            "&:hover": { opacity: 1 },
            transition: "opacity 150ms",
            zIndex: 1,
          }}
        >
          <ChevronLeft size={40} />
        </Box>

        {/* Image panel */}
        <Box sx={{ flexShrink: 0, bgcolor: { xs: "transparent", sm: "#111" }, display: "flex", justifyContent: "center" }}>
          {selected && (
            <Box
              component="img"
              src={selected.image}
              alt={selected.title}
              sx={{
                display: "block",
                maxHeight: { xs: "55vh", sm: "90vh" },
                maxWidth: { xs: "90vw", sm: "calc(90vw - 280px)" },
                width: "auto",
                height: "auto",
              }}
            />
          )}
        </Box>

        {/* Info panel */}
        <Box
          sx={{
            width: { xs: "90vw", sm: "280px" },
            flexShrink: 0,
            bgcolor: "#fff",
            p: "32px 24px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflowY: "auto",
            maxHeight: { xs: "35vh", sm: "90vh" },
          }}
        >
          <Box
            onClick={onClose}
            sx={{
              position: "absolute",
              top: "24px",
              right: "24px",
              cursor: "pointer",
              opacity: 0.75,
              "&:hover": { opacity: 1 },
              "&:active": { opacity: 0.5 },
              transition: "opacity 150ms",
            }}
          >
            <X size={18} />
          </Box>

          {selected && (
            <>
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", pr: "24px", lineHeight: 1.3 }}
              >
                {selected.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: "2px", color: "text.secondary" }}
              >
                {selected.date} · {selected.media}
              </Typography>
              <Box
                sx={{
                  borderBottom: "1px solid #ccc",
                  width: "48px",
                  mt: "12px",
                  mb: "16px",
                }}
              />
              <Typography variant="body1">{selected.description}</Typography>
            </>
          )}
        </Box>

        {/* Next arrow */}
        <Box
          onClick={onNext}
          sx={{
            position: "absolute",
            right: { xs: "8px", sm: "calc(5vw - 48px)" },
            top: { xs: "auto", sm: "50%" },
            bottom: { xs: "8px", sm: "auto" },
            transform: { xs: "none", sm: "translateY(-50%)" },
            cursor: "pointer",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            opacity: 0.7,
            bgcolor: { xs: "rgba(0,0,0,0.35)", sm: "transparent" },
            borderRadius: { xs: "50%", sm: 0 },
            p: { xs: "2px", sm: 0 },
            "&:hover": { opacity: 1 },
            transition: "opacity 150ms",
            zIndex: 1,
          }}
        >
          <ChevronRight size={40} />
        </Box>
      </Box>
      </Fade>
    </Modal>
  );
}
