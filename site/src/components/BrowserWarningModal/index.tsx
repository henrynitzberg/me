import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { X, TriangleAlert } from "lucide-react";
import { SUPPORTS_SVG_BACKDROP_FILTER } from "../../utils/browserSupport";

// This warns about exactly the thing it can't rely on GlassBox to show -
// so, unlike the rest of the site's chrome, this dialog is a plain opaque
// card rather than a GlassBox. It has to look right on precisely the
// browsers where the liquid-glass effect doesn't render.
function BrowserWarningModal() {
  const [dismissed, setDismissed] = useState(false);
  const open = !SUPPORTS_SVG_BACKDROP_FILTER && !dismissed;

  return (
    <Modal
      open={open}
      onClose={() => setDismissed(true)}
      closeAfterTransition
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0, 0, 0, 0.7)" } } }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "relative",
            width: { xs: "85vw", sm: "420px" },
            maxWidth: "90vw",
            bgcolor: "#111",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            p: "28px",
            outline: "none",
          }}
        >
          <IconButton
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            sx={{ position: "absolute", top: "12px", right: "12px" }}
          >
            <X size={18} color="rgba(255, 255, 255, 0.7)" />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <TriangleAlert size={22} color="#ffb020" />
            <Typography variant="h6" sx={{ color: "text.primary" }}>
              Heads up
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mt: "12px", lineHeight: 1.6 }}
          >
            This site uses some visual effects that only render properly in
            Chromium-based browsers (Chrome, Edge, Arc, Brave, etc). You're on a
            browser that isn't one of those, so things may look a little flat -
            but everything should still work fine.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: "12px",
              lineHeight: 1.4,
              fontStyle: "italic",
              fontSize: "0.875rem",
            }}
          >
            If you have thoughts on how to emulate the effect you get from svg
            filters in other browsers, please reach out.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "20px" }}>
            <Button
              onClick={() => setDismissed(true)}
              variant="outlined"
              sx={{
                color: "text.primary",
                borderColor: "rgba(255, 255, 255, 0.3)",
                "&:hover": { borderColor: "rgba(255, 255, 255, 0.6)" },
              }}
            >
              Got it
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default BrowserWarningModal;
