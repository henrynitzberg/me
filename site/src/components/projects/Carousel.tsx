import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Box, Typography } from "@mui/material";


type Props = {
  images: string[];
  alt?: string;
  /** Frame shape. Square suits cropped photos; wider suits screenshots. */
  aspect?: string;
  /**
   * "cover" crops to fill the frame, "contain" letterboxes. Screenshots want
   * contain - cropping a UI capture cuts off interface.
   */
  fit?: "cover" | "contain";
  /**
   * Slide width as a percent of the viewport. Below 100 the neighbouring
   * slides peek in at the edges, which suits photos; detail-heavy screenshots
   * need the full width to stay legible.
   */
  slidePct?: number;
};

/**
 * Looping carousel built on Embla.
 *
 * Embla translates a track rather than driving native scroll, which is what
 * makes `loop` seamless - there is no scroll extent to run out of, so no
 * cloning or silent scrollLeft repositioning. It also sidesteps the two
 * native-scroll traps this component hit before: smooth scrollTo losing a
 * race with `scroll-snap-type: mandatory`, and index maths that assumed
 * slides were exactly viewport-width.
 */
function Carousel({
  images,
  alt = "",
  aspect = "1 / 1",
  fit = "cover",
  slidePct = 62,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [index, setIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    // "init" rather than calling onSelect() straight away: a synchronous
    // setState in an effect body triggers a cascading render.
    emblaApi.on("init", onSelect).on("select", onSelect).on("reInit", onSelect);
    return () => {
      emblaApi.off("init", onSelect).off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const arrowSx = {
    border: "none",
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    color: "inherit",
    fontFamily: "inherit",
    cursor: "pointer",
    lineHeight: 1,
    transition: "opacity 0.15s",
    "&:hover": { opacity: 0.6 },
  };

  return (
    <Box>
      {/* viewport - must clip, Embla moves the container inside it */}
      <Box
        ref={emblaRef}
        tabIndex={0}
        aria-roledescription="carousel"
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "ArrowRight") emblaApi?.scrollNext();
          if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
        }}
        sx={{
          overflow: "hidden",
          outline: "none",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "text.primary",
            outlineOffset: 4,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            touchAction: "pan-y",
            // NOT `gap`: in loop mode Embla repositions slides with a
            // transform, and a container gap is not part of that offset - so
            // the seam between the last and first slide loses its spacing.
            // Padding on each slide travels with it, so every join matches.
            ml: -2,
          }}
        >
          {images.map((src, i) => (
            <Box
              key={src}
              sx={{
                // minWidth:0 is required - a flex item's automatic minimum is
                // its min-content width, which here is driven by the image's
                // intrinsic size, and that silently overrides the basis.
                flex: `0 0 ${slidePct}%`,
                minWidth: 0,
                // the gap, carried by the slide itself (border-box, so this
                // sits inside the basis rather than widening it)
                pl: 2,
                aspectRatio: aspect, // fixes the track height between slides
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                src={src}
                alt={`${alt} (${i + 1} of ${images.length})`}
                // Eager for all: Embla translates slides rather than
                // scrolling them, so a lazy image off to the side is never
                // "approaching the viewport" and only loads on arrival -
                // a visible pop-in. These sets are a few hundred KB total.
                loading="eager"
                draggable={false}
                sx={{
                  display: "block",
                  borderRadius: 2,
                  // The radius has to live on the image, not the frame. With
                  // objectFit:contain the frame's corners clip empty
                  // letterbox, so rounding it does nothing visible - the
                  // image sizes itself here instead, and gets rounded.
                  ...(fit === "cover"
                    ? { width: "100%", height: "100%", objectFit: "cover" }
                    : { maxWidth: "100%", maxHeight: "100%" }),
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          mt: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
        }}
      >
        <Typography
          component="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous image"
          sx={arrowSx}
        >
          {"<"}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          {images.map((src, i) => (
            <Box
              key={src}
              component="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index}
              sx={{
                width: 8,
                height: 8,
                p: 0,
                borderRadius: "50%",
                border: "1px solid",
                borderColor: "text.primary",
                background: i === index ? "currentColor" : "none",
                opacity: i === index ? 1 : 0.4,
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
            />
          ))}
        </Box>

        <Typography
          component="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next image"
          sx={arrowSx}
        >
          {">"}
        </Typography>
      </Box>
    </Box>
  );
}

export default Carousel;
