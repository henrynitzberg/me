import { createTheme } from "@mui/material/styles";

const headingFont = '"Space Grotesk", "Inter", system-ui, sans-serif';
const bodyFont = '"Inter", system-ui, sans-serif';

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffffff",
      contrastText: "#000000",
    },
    secondary: {
      main: "rgba(255, 255, 255, 0.7)",
      contrastText: "#000000",
    },
    background: {
      default: "#000000",
      paper: "rgba(255, 255, 255, 0.04)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
      disabled: "rgba(255, 255, 255, 0.38)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: headingFont, fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontFamily: headingFont, fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontFamily: headingFont, fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontFamily: headingFont, fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontFamily: headingFont, fontWeight: 600 },
    h6: { fontFamily: headingFont, fontWeight: 600 },
    subtitle1: { fontFamily: headingFont, fontWeight: 500 },
    subtitle2: { fontFamily: headingFont, fontWeight: 500 },
    button: { fontFamily: headingFont, fontWeight: 500, textTransform: "none" },
    body1: { fontFamily: bodyFont, fontWeight: 400 },
    body2: { fontFamily: bodyFont, fontWeight: 400 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body": {
          margin: 0,
          height: "100%",
          backgroundColor: "#000",
          // nothing on the site is selectable by default - it reads as an
          // app/interface rather than a document, and user-select inherits,
          // so setting it once here covers everything unless some element
          // explicitly opts back into "text"
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
        },
        body: {
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        // native scrollbar hidden in favor of CustomScrollbar, which draws
        // its own thumb and handles drag-to-scroll itself - this doesn't
        // touch scroll behavior at all, just the browser's own visual
        // indicator for it
        html: {
          scrollbarWidth: "none", // Firefox
        },
        "html::-webkit-scrollbar": {
          display: "none", // Chromium, Safari
        },
      },
    },
  },
});

export default theme;
