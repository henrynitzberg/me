import { useEffect, useState, useRef } from "react";
import { Backdrop, Box, IconButton, Typography } from "@mui/material";
import { useKeyDown } from "@react-hooks-library/core";
import { sleep } from "../misc/sleep.tsx";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import climbingGalleryJson from "../../assets/climbing/info.json";

interface ClimbingGalleryProps {
  selectedTabIndex: number;
  setSelectedTabIndex: (index: number) => void;
}

function ClimbingGallery({
  selectedTabIndex,
  setSelectedTabIndex,
}: ClimbingGalleryProps) {
  const climbingImagesRecord = import.meta.glob("../../assets/climbing/*.jpg", {
    eager: true,
    as: "url",
  }) as Record<string, string>;

  const climbingGallery = climbingGalleryJson.gallery.map((item) => {
    // Find the image URL that ends with the filename
    const imageUrl = Object.values(climbingImagesRecord).find((url) =>
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
      setSelectedBoxIndex((selectedBoxIndex + 1) % climbingGallery.length);
    } else {
      setSelectedTabIndex((selectedTabIndex + 1) % 3);
    }
  });
  useKeyDown("ArrowLeft", () => {
    if (selectedBoxIndex != null) {
      setSelectedBoxIndex(
        (selectedBoxIndex + climbingGallery.length - 1) % climbingGallery.length
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

  const [galleryWidth, setGalleryWidth] = useState<number>(window.innerWidth - 350);
  useEffect(() => {
    const handleResize = () => {
      setGalleryWidth(window.innerWidth - 350);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "relative",
          m: "48px",
          mt: "8px",
          width: galleryWidth,
          maxWidth: galleryWidth,
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
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            overflow: "auto",
            gap: "20px",
            width: "100%",
            height: "100%",
            pt: "10px",
            pb: "10px",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {climbingGallery.map((_, idx) => {
            return (
              <Box
                key={idx}
                ref={(el) => {
                  itemRefs.current[idx] = el as HTMLImageElement | null;
                }}
                component="img"
                src={climbingGallery[idx].image}
                sx={{
                  width: Math.max(200, (galleryWidth - 127) / 4),
                  minWidth: Math.max(200, (galleryWidth - 127) / 4),
                  height: Math.max(200, (galleryWidth - 127) / 4),
                  minHeight: Math.max(200, (galleryWidth - 127) / 4),
                  borderRadius: "5px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: selectedBoxIndex === idx ? "1px solid" : "none",
                  "&:hover": {
                    border: "2px solid",
                  },
                  transition: "border 0.15s ease",
                }}
                onClick={() => {
                  if (selectedBoxIndex === null) {
                    handleExpand(idx);
                  }
                }}
              />
            );
          })}
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
                : "rgba(0, 0, 0, 0.4)",
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
                height: "fit-content",
                width: "fit-content",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Actual image */}
              <Box
                component="img"
                src={climbingGallery[selectedBoxIndex].image}
                sx={{
                  maxWidth: transitionExpand ? "80vw" : startRect.width,
                  maxHeight: transitionExpand ? "90vh" : startRect.height,
                  width: transitionExpand ? "none" : startRect.width,
                  height: transitionExpand ? "none" : startRect.height,
                  borderRadius: transitionExpand ? "15px" : "5px",
                  objectFit: "cover",
                  transition: "all 0.4s ease, opacity 0.15s ease",
                }}
              />
              {climbingGallery[selectedBoxIndex].title ||
              climbingGallery[selectedBoxIndex].description ? (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    color: "white",
                    opacity: transitionExpand ? 1 : 0,
                    transition: "opacity 0.75s ease",
                    display: "flex",
                    maxWidth: "200px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {climbingGallery[selectedBoxIndex].title && (
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: "200px",
                        textWrap: "wrap",
                        fontWeight: "600",
                      }}
                    >
                      {climbingGallery[selectedBoxIndex].title}
                    </Typography>
                  )}
                  {climbingGallery[selectedBoxIndex].description && (
                    <Typography
                      variant="body1"
                      sx={{
                        maxWidth: "200px",
                        textWrap: "wrap",
                        fontSize: "14px",
                      }}
                    >
                      {climbingGallery[selectedBoxIndex].description}
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
                  (selectedBoxIndex + climbingGallery.length - 1) %
                    climbingGallery.length
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
                  (selectedBoxIndex + climbingGallery.length - 1) %
                    climbingGallery.length
                );
              }}
            />
          </IconButton>
        </Backdrop>
      )}
    </>
  );
}

export default ClimbingGallery;
