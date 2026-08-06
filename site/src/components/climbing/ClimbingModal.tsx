import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import GlassBox from "../GlassBox/GlassBox";
import GlassIconButton from "../GlassBox/GlassIconButton";
import { climbs } from "../../content/climbing";

interface ClimbingModalProps {
  selectedIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const IMAGE_FRAME_RADIUS = 20;
const IMAGE_PADDING = 10;
const NAV_BUTTON_SIZE = 48;
const CLOSE_BUTTON_SIZE = 40;

// Same shape as DrawingModal (glass-framed image, circular glass nav/close
// buttons), just without a side info panel - climbs only carry a title and
// date, so that lives as a caption under the image instead of a whole
// second column next to it.
function ClimbingModal({
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: ClimbingModalProps) {
  const [displayedIndex, setDisplayedIndex] = useState(selectedIndex);
  useEffect(() => {
    if (selectedIndex !== null) setDisplayedIndex(selectedIndex);
  }, [selectedIndex]);

  const isOpen = selectedIndex !== null;
  const selected = displayedIndex !== null ? climbs[displayedIndex] : null;

  const imageRef = useRef<HTMLDivElement>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = imageRef.current;
    if (!el) return;

    const measure = () =>
      setImageSize({ width: el.offsetWidth, height: el.offsetHeight });

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [selected?.image]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") onPrev();
    if (e.key === "ArrowRight") onNext();
    if (e.key === "Escape") onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      closeAfterTransition
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0, 0, 0, 0.85)" } } }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: { xs: "90vw", sm: "auto" },
            maxWidth: "90vw",
            maxHeight: "90vh",
            outline: "none",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: { xs: "8px", sm: "-64px" },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
            }}
          >
            <GlassIconButton
              size={NAV_BUTTON_SIZE}
              onClick={onPrev}
              aria-label="Previous"
            >
              <ChevronLeft size={24} />
            </GlassIconButton>
          </Box>

          <Box
            sx={{
              position: "absolute",
              top: "-56px",
              right: 0,
              zIndex: 2,
            }}
          >
            <GlassIconButton
              size={CLOSE_BUTTON_SIZE}
              onClick={onClose}
              aria-label="Close"
            >
              <X size={18} />
            </GlassIconButton>
          </Box>

          <Box sx={{ position: "relative", flexShrink: 0 }}>
            {imageSize.width > 0 && imageSize.height > 0 && (
              <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <GlassBox
                  width={imageSize.width}
                  height={imageSize.height}
                  borderRadius={IMAGE_FRAME_RADIUS}
                  backgroundOpacity={0.1}
                />
              </Box>
            )}
            <Box
              ref={imageRef}
              sx={{
                position: "relative",
                zIndex: 1,
                p: `${IMAGE_PADDING}px`,
              }}
            >
              {selected && (
                <Box
                  component="img"
                  src={selected.image}
                  alt={selected.title}
                  draggable={false}
                  sx={{
                    display: "block",
                    borderRadius: `${IMAGE_FRAME_RADIUS - IMAGE_PADDING}px`,
                    maxHeight: "75vh",
                    maxWidth: { xs: "calc(90vw - 20px)", sm: "80vw" },
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>
          </Box>

          {selected && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: "12px" }}
            >
              <strong>{selected.title}</strong> ⋅ {selected.date}
            </Typography>
          )}

          <Box
            sx={{
              position: "absolute",
              right: { xs: "8px", sm: "-64px" },
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 2,
            }}
          >
            <GlassIconButton
              size={NAV_BUTTON_SIZE}
              onClick={onNext}
              aria-label="Next"
            >
              <ChevronRight size={24} />
            </GlassIconButton>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default ClimbingModal;
