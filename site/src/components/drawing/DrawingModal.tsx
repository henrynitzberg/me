import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import GlassBox from "../GlassBox/GlassBox";
import GlassIconButton from "../GlassBox/GlassIconButton";
import { works } from "../../content/drawing";

interface DrawingModalProps {
  selectedIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const IMAGE_FRAME_RADIUS = 20;
const IMAGE_PADDING = 10;
const NAV_BUTTON_SIZE = 48;
const CLOSE_BUTTON_SIZE = 40;

// Same glass-frames-media-not-text split as TabHeader/ProjectDetails: the
// image gets a glass frame (so it reads as a pane of glass over the
// darkened backdrop, not just a plain picture), the title/date/description
// stay plain text next to it, and prev/next/close are the same circular
// glass buttons as the AppBar's back button.
function DrawingModal({
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
    // re-measure whenever the displayed work changes, since a differently
    // shaped image can change the frame's own size even at the same
    // max-height/max-width constraints
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
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "flex-start" },
            gap: "24px",
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
              top: { xs: "-56px", sm: "-56px" },
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

          <Box
            sx={{
              position: "relative",
              flexShrink: 0,
              // the column layout's alignItems: "stretch" on xs is only
              // there for the info panel below, which otherwise wants to
              // span the full width - applied here too by default, it
              // stretches this box (and the plain-block imageRef div inside
              // it) out to the full column width regardless of the image's
              // own rendered size, so the measured imageSize (and the glass
              // frame sized from it) ends up far wider than the image
              // itself. Overriding back to shrink-to-content on xs is what
              // keeps the frame hugging the actual image.
              alignSelf: { xs: "center", sm: "flex-start" },
            }}
          >
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
                    maxHeight: { xs: "45vh", sm: "80vh" },
                    maxWidth: { xs: "calc(90vw - 20px)", sm: "55vw" },
                    width: "auto",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              )}
            </Box>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", sm: "260px" },
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              maxHeight: { xs: "30vh", sm: "80vh" },
              overflowY: "auto",
            }}
          >
            {selected && (
              <>
                <Typography
                  variant="h6"
                  sx={{ color: "text.primary", fontWeight: "bold" }}
                >
                  {selected.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mt: "2px" }}
                >
                  {selected.date} ⋅ {selected.media}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", mt: "16px" }}
                >
                  {selected.description}
                </Typography>
              </>
            )}
          </Box>

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

export default DrawingModal;
