import { useEffect, useState } from "react";
import { Box, Fade, Modal } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MakingModalProps {
  images: string[];
  selectedIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function MakingModal({ images, selectedIndex, onClose, onPrev, onNext }: MakingModalProps) {
  const [displayedIndex, setDisplayedIndex] = useState(selectedIndex);
  useEffect(() => {
    if (selectedIndex !== null) setDisplayedIndex(selectedIndex);
  }, [selectedIndex]);

  const isOpen = selectedIndex !== null;
  const src = displayedIndex !== null ? images[displayedIndex] : null;

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
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0,0,0,0.85)" } } }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Fade in={isOpen}>
        <Box sx={{ position: "relative", outline: "none", maxWidth: "90vw" }}>
          <Box
            onClick={onPrev}
            sx={{
              position: "absolute",
              left: { xs: "8px", sm: "-48px" },
              top: "50%",
              transform: "translateY(-50%)",
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
            }}
          >
            <ChevronLeft size={40} />
          </Box>

          {src && (
            <Box
              component="img"
              src={src}
              sx={{
                display: "block",
                maxHeight: "90vh",
                maxWidth: "90vw",
                width: "auto",
                height: "auto",
              }}
            />
          )}

          <Box
            onClick={onNext}
            sx={{
              position: "absolute",
              right: { xs: "8px", sm: "-48px" },
              top: "50%",
              transform: "translateY(-50%)",
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
            }}
          >
            <ChevronRight size={40} />
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
