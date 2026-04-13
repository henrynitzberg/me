import { useEffect, useState, useRef } from "react";
import {
  Backdrop,
  Box,
  IconButton,
  Typography,
  ImageList,
  ImageListItem,
} from "@mui/material";
import { useKeyDown } from "@react-hooks-library/core";
import { sleep } from "../misc/sleep.tsx";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import drawingGalleryJson from "../../assets/drawing/info.json";

interface DrawingGalleryProps {
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
}

function DrawingGallery({
  selectedTabIndex,
  setSelectedTabIndex,
}: DrawingGalleryProps) {
  const drawingImagesRecord = import.meta.glob("../../assets/drawing/*.j*", {
    eager: true,
    as: "url",
  }) as Record<string, string>;

  const drawingGallery = drawingGalleryJson.gallery.map((item) => {
    // Find the image URL that ends with the filename
    const imageUrl = Object.values(drawingImagesRecord).find((url) =>
      url.endsWith(item.image)
    );

    return {
      ...item,
      image: imageUrl,
    };
  });

  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [startRect, setStartRect] = useState<DOMRect | null>(null);
  const itemRefs = useRef<(HTMLImageElement | null)[]>([]);
  const handleExpand = (idx: number) => {
    const rect = itemRefs.current[idx]?.getBoundingClientRect();
    if (rect) setStartRect(rect);
    setSelectedBoxIndex(idx);
  };
  const [transitionExpand, setTransitionExpand] = useState<boolean>(false);
  useEffect(() => {
    const setTransitionVar = async () => {
      if (selectedBoxIndex === null) {
        setTransitionExpand(false);
      } else {
        await sleep(50);
        setTransitionExpand(true);
      }
    };
    setTransitionVar();
  }, [selectedBoxIndex]);

  const [closing, setClosing] = useState<Boolean>(false);
  const handleCloseImage = async () => {
    setClosing(true);
    await sleep(150);
    setClosing(false);
    setSelectedBoxIndex(null);
  };

  useKeyDown("ArrowRight", () => {
    if (selectedBoxIndex != null) {
      setSelectedBoxIndex((selectedBoxIndex + 1) % drawingGallery.length);
    } else {
      setSelectedTabIndex((selectedTabIndex + 1) % 3);
    }
  });
  useKeyDown("ArrowLeft", () => {
    if (selectedBoxIndex != null) {
      setSelectedBoxIndex(
        (selectedBoxIndex + drawingGallery.length - 1) % drawingGallery.length
      );
    } else {
      setSelectedTabIndex((selectedTabIndex + 2) % 3);
    }
  });
  useKeyDown("Escape", () => {
    if (selectedBoxIndex != null) {
      handleCloseImage();
    }
  });

  return (
    <>
      <Box
        sx={{
          position: "relative",
          m: "48px",
          mt: "8px",
          width: innerWidth - 350,
          maxWidth: innerWidth - 350,
          mr: "48px",

          // BOTTOM GRADIENT
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "10px",
            pointerEvents: "none",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 1), rgba(255,255,255,0))",
          },

          // TOP GRADIENT
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "10px",
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(255,255,255,0))",
            zIndex: 1,
          },
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            height: "100%",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <ImageList
            variant="masonry"
            cols={2}
            gap={8}
            sx={{
              width: "100%",
              maxWidth: "100%",
              pt: "10x",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {drawingGallery.map((_, idx) => {
              return (
                <ImageListItem
                  key={idx}
                  ref={(el) => {
                    itemRefs.current[idx] = el as HTMLImageElement | null;
                  }}
                  component="img"
                  src={drawingGallery[idx].image}
                  sx={{
                    maxWidth: "100%",
                    borderRadius: "3px",
                    objectFit: "cover",
                    cursor: "pointer",
                    opacity: selectedBoxIndex === idx ? 1 : 0.9,
                    "&:hover": {
                      opacity: 1,
                    },
                    transition: "opacity 0.2s ease",
                  }}
                  onClick={() => {
                    if (selectedBoxIndex === null) {
                      handleExpand(idx);
                    }
                  }}
                />
              );
            })}
          </ImageList>
        </Box>
      </Box>
      {selectedBoxIndex !== null && startRect && (
        <Backdrop
          open={true}
          sx={{
            zIndex: 998,
            backgroundColor:
              closing || !transitionExpand
                ? "transparent"
                : "rgba(1, 1, 1, 0.6)",
            transition: "background-color .3s ease",
          }}
          onClick={() => {
            handleCloseImage();
          }}
        >
          <Box
            sx={{
              position: "fixed",
              top: startRect.top,
              left: startRect.left,
              width: startRect.width,
              height: startRect.height,
              zIndex: 999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: closing ? 0 : 1,

              // Animate wrapper to full screen
              ...(transitionExpand && {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80vw",
                height: "90vh",
              }),
              transition: "all 0.4s ease, opacity 0.15s ease",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Actual image */}
              <Box
                component="img"
                src={drawingGallery[selectedBoxIndex].image}
                sx={{
                  maxWidth: transitionExpand ? "80vw" : startRect.width,
                  maxHeight: transitionExpand ? "90vh" : startRect.height,
                  width: transitionExpand ? "none" : startRect.width,
                  height: transitionExpand ? "none" : startRect.height,
                  borderRadius: "3px",
                  objectFit: "cover",
                  transition: "all 0.4s ease, opacity 0.15s ease",
                  border: "5px solid black",
                }}
              />
              {drawingGallery[selectedBoxIndex].title ||
              drawingGallery[selectedBoxIndex].size ||
              drawingGallery[selectedBoxIndex].medium ||
              drawingGallery[selectedBoxIndex].notes ? (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: "white",
                    opacity: transitionExpand ? 1 : 0,
                    transition: "opacity 0.75s ease",
                      display: "flex",
                    flexDirection: "column",
                    maxWidth: "200px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {drawingGallery[selectedBoxIndex].title && (
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: "200px",
                        textWrap: "wrap",
                        fontWeight: "600",
                      }}
                    >
                      {drawingGallery[selectedBoxIndex].title}
                    </Typography>
                  )}
                  {drawingGallery[selectedBoxIndex].size && (
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: "200px",
                        textWrap: "wrap",
                      }}
                    >
                      {drawingGallery[selectedBoxIndex].size}
                    </Typography>
                  )}
                  {drawingGallery[selectedBoxIndex].medium && (
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: "200px",
                        textWrap: "wrap",
                      }}
                    >
                      {drawingGallery[selectedBoxIndex].medium}
                    </Typography>
                  )}
                  {drawingGallery[selectedBoxIndex].notes && (
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: "200px",
                        textWrap: "wrap",
                      }}
                    >
                      {drawingGallery[selectedBoxIndex].notes}
                    </Typography>
                  )}
                </Box>
              ) : null}
            </Box>
          </Box>
          {/* left and right arrows */}
          <IconButton
            sx={{ opacity: closing ? 0 : 1, transition: "opacity 0.15s ease" }}
          >
            <KeyboardDoubleArrowLeftIcon
              sx={{
                position: "fixed",
                top: "50%",
                left: "30px",
                transform: "translateY(-50%)",
                color: "white",
                fontSize: "48px",
                zIndex: 1000,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBoxIndex(
                  (selectedBoxIndex + drawingGallery.length - 1) %
                    drawingGallery.length
                );
              }}
            />
          </IconButton>
          <IconButton
            sx={{ opacity: closing ? 0 : 1, transition: "opacity 0.15s ease" }}
          >
            <KeyboardDoubleArrowRightIcon
              sx={{
                position: "fixed",
                top: "50%",
                right: "30px",
                transform: "translateY(-50%)",
                color: "white",
                fontSize: "48px",
                zIndex: 1000,
              }}
              onClick={(e) => {
                e.stopPropagation();

                setSelectedBoxIndex(
                  (selectedBoxIndex + drawingGallery.length - 1) %
                    drawingGallery.length
                );
              }}
            />
          </IconButton>
        </Backdrop>
      )}
    </>
  );
}

export default DrawingGallery;
