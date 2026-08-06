import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import GlassBox from "./GlassBox";

interface GlassIconButtonProps {
  size?: number;
  onClick: () => void;
  "aria-label": string;
  children: ReactNode;
}

// The circular glass button pattern already used for the AppBar's back
// button (a GlassBox sized to a circle, wrapping a centered icon) - pulled
// out once a second and third use of it showed up (the drawing modal's
// prev/next/close).
function GlassIconButton({
  size = 44,
  onClick,
  children,
  ...rest
}: GlassIconButtonProps) {
  return (
    <GlassBox
      width={size}
      height={size}
      borderRadius={size / 2}
      backgroundOpacity={0.3}
      hoverBounceDeltaScale={0.04}
      clickBounceDeltaScale={0.06}
      onClick={onClick}
      data-cursor="pointer"
      style={{ cursor: "pointer" }}
      {...rest}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.primary",
        }}
      >
        {children}
      </Box>
    </GlassBox>
  );
}

export default GlassIconButton;
