import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffffff",
    },
    secondary: {
      main: "#000000ff",
      contrastText: "#ffffffff",
    },
    background: {
      default: "#000000ff", // page background
    },
    text: {
      primary: "#000000ff",
      secondary: "#ffffff75",
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontSize: 48,
      fontWeight: 500,
    },
    h2: {
      fontSize: 36,
      fontWeight: 500,
    },
    h3: {
      fontSize: 24,
      fontWeight: 500,
    },
    h4: {
      fontSize: 16,
      fontWeight: 500,
    },
  },
  components: {},
});

export default theme;
