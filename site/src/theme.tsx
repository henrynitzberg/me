import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeBackground {
    subtle: string;
  }
}

export const tokens = {
  colors: {
    surface: "#f9f9f9",
    surfaceDim: "#dadada",
    surfaceBright: "#f9f9f9",
    surfaceContainerLowest: "#ffffff",
    surfaceContainerLow: "#f3f3f3",
    surfaceContainer: "#eeeeee",
    surfaceContainerHigh: "#e8e8e8",
    surfaceContainerHighest: "#e2e2e2",
    onSurface: "#1a1c1c",
    onSurfaceVariant: "#4c4546",
    inverseSurface: "#2f3131",
    inverseOnSurface: "#f1f1f1",
    outline: "#7e7576",
    outlineVariant: "#cfc4c5",
    surfaceTint: "#5e5e5e",
    primary: "#000000",
    onPrimary: "#ffffff",
    primaryContainer: "#1b1b1b",
    onPrimaryContainer: "#848484",
    inversePrimary: "#c6c6c6",
    secondary: "#5e5e5e",
    onSecondary: "#ffffff",
    secondaryContainer: "#e1dfdf",
    onSecondaryContainer: "#636262",
    tertiary: "#000000",
    onTertiary: "#ffffff",
    tertiaryContainer: "#201a1b",
    onTertiaryContainer: "#8b8283",
    error: "#ba1a1a",
    onError: "#ffffff",
    errorContainer: "#ffdad6",
    onErrorContainer: "#93000a",
    primaryFixed: "#e2e2e2",
    primaryFixedDim: "#c6c6c6",
    onPrimaryFixed: "#1b1b1b",
    onPrimaryFixedVariant: "#474747",
    secondaryFixed: "#e4e2e2",
    secondaryFixedDim: "#c7c6c6",
    onSecondaryFixed: "#1b1c1c",
    onSecondaryFixedVariant: "#464747",
    tertiaryFixed: "#ece0e1",
    tertiaryFixedDim: "#cfc4c5",
    onTertiaryFixed: "#201a1b",
    onTertiaryFixedVariant: "#4c4546",
    background: "#f9f9f9",
    onBackground: "#1a1c1c",
    surfaceVariant: "#e2e2e2",
    surfaceWhite: "#ffffff",
    borderHairline: "#cfc4c5",
    borderHeavy: "#7e7576",
    backgroundSubtle: "#f3f3f3",
  },
  spacing: {
    gridMargin: "2rem",
    gridGutter: "1rem",
    modulePadding: "1.5rem",
    stackLg: "2rem",
    stackMd: "1rem",
    stackSm: "0.5rem",
    hairline: "1px",
  },
  fontFamily: {
    mono: '"JetBrains Mono", monospace',
    sans: '"Inter", "Helvetica Neue", Arial, sans-serif',
  },
} as const;

const theme = createTheme({
  palette: {
    primary: {
      main: tokens.colors.primary,
      contrastText: tokens.colors.onPrimary,
    },
    secondary: {
      main: tokens.colors.secondary,
      contrastText: tokens.colors.onSecondary,
    },
    error: {
      main: tokens.colors.error,
      contrastText: tokens.colors.onError,
    },
    background: {
      default: tokens.colors.background,
      paper: tokens.colors.surfaceWhite,
      subtle: tokens.colors.backgroundSubtle,
    },
    text: {
      primary: tokens.colors.onSurface,
      secondary: tokens.colors.onSurfaceVariant,
    },
    divider: tokens.colors.borderHairline,
  },
  typography: {
    fontFamily: tokens.fontFamily.sans,
    // headline-lg
    h1: {
      fontFamily: tokens.fontFamily.mono,
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
    },
    // headline-md
    h2: {
      fontFamily: tokens.fontFamily.mono,
      fontSize: "24px",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    // body-lg
    body1: {
      fontSize: "18px",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    // body-md
    body2: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    // label-mono-md
    overline: {
      fontFamily: tokens.fontFamily.mono,
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.2,
      textTransform: "none",
    },
    // label-mono-sm
    caption: {
      fontFamily: tokens.fontFamily.mono,
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: 1.0,
      letterSpacing: "0.05em",
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: "none",
          transition: "background-color 150ms",
          "&:hover": {
            backgroundColor: tokens.colors.surfaceContainerHigh,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: tokens.colors.surfaceContainer,
          border: `1px solid ${tokens.colors.outlineVariant}`,
          fontFamily: tokens.fontFamily.mono,
          fontSize: "12px",
          fontWeight: 400,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: `1px solid ${tokens.colors.borderHeavy}`,
          backgroundColor: tokens.colors.surfaceWhite,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: tokens.colors.borderHairline,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${tokens.colors.borderHairline}`,
          transition: "background-color 150ms",
          "&:hover": {
            backgroundColor: tokens.colors.surfaceContainerLow,
          },
        },
      },
    },
  },
});

export default theme;
