import { createTheme } from "@mui/material/styles";

const BACKGROUND = "#eeece3";
const TEXT = "#0B0000";
const TEXT_SECONDARY = "#0b0000b4";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: BACKGROUND,
      paper: BACKGROUND,
    },
    text: {
      primary: TEXT,
      secondary: TEXT_SECONDARY,
    },
    primary: {
      main: TEXT,
    },
    divider: TEXT,
  },
  typography: {
    fontFamily: '"Anonymous Pro", monospace',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: BACKGROUND,
          color: TEXT,
        },
      },
    },
  },
});

export default theme;
