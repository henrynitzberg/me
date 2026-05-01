import { Box, Typography } from "@mui/material";

interface TabHeaderProps {
  src: string;
  text: string | React.ReactNode;
}

export default function TabHeader({ src, text }: TabHeaderProps) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: "24px",
        }}
      >
        <Box
          sx={{
            width: "fit-content",
            border: "1px solid #000000ff",
            p: "4px",
            flexShrink: 0,
            alignSelf: { xs: "center", sm: "flex-start" },
          }}
        >
          <Box
            component="img"
            src={src}
            sx={{
              height: { xs: "auto", sm: 300 },
              maxHeight: { xs: 220, sm: "none" },
              maxWidth: { xs: "calc(95vw - 16px)", sm: "none" },
              width: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
        <Typography variant="body1">{text}</Typography>
      </Box>
      <Box
        sx={{
          borderTop: "1px solid #ccc",
          mt: "24px",
          width: "95%",
          alignSelf: "center",
        }}
      />
    </>
  );
}
