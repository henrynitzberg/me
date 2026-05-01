import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: ["Georgia", "serif"].join(","),
    h1: {
      fontFamily: "Georgia, serif",
      fontWeight: 700,
      fontSize: "2.5rem",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "Georgia, serif",
      fontWeight: 700,
      fontSize: "2rem",
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: "Georgia, serif",
      fontWeight: 700,
      fontSize: "1.75rem",
      lineHeight: 1.3,
    },
    body1: {
      fontFamily: "Georgia, serif",
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: "Georgia, serif",
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
  },
  palette: {
    primary: {
      main: "#333333", // Dark grey, almost black
    },
    secondary: {
      main: "#666666", // Medium grey
    },
    text: {
      primary: "#111111", // Very dark grey for main text
      secondary: "#555555", // Slightly lighter grey for secondary text
    },
    background: {
      default: "#FFFFFF", // White background
      paper: "#F9F9F9", // Off-white for paper-like elements
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `,
    },
  },
});

export default theme;
