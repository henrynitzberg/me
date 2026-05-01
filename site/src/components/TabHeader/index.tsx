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
          flexDirection: "row",
          gap: "24px",
        }}
      >
        <Box
          sx={{
            height: 310,
            width: "fit-content",
            border: "1px solid #000000ff",
            p: "4px",
          }}
        >
          <Box
            component="img"
            src={src}
            sx={{
              height: 300,
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
