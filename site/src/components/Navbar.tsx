import { Box, Typography } from "@mui/material";
import { tokens } from "../theme";
import { Mail } from "lucide-react";

interface NavbarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const monoLabel = {
  fontFamily: tokens.fontFamily.mono,
  fontSize: "12px",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "color 150ms",
  "&:hover": { color: tokens.colors.onSurface },
} as const;

const tabUnderline = (isActive: boolean) => ({
  content: '""',
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "2px",
  backgroundColor: tokens.colors.onSurface,
  transform: isActive ? "scaleX(1)" : "scaleX(0)",
  transformOrigin: "center",
  transition: "transform 200ms ease",
});

export default function Navbar({ tabs, activeTab, onTabChange }: NavbarProps) {
  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: "32px",
        py: "8px",
        borderBottom: `1px solid ${tokens.colors.borderHairline}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: tokens.colors.surface,
      }}
    >
      <Typography variant="h2">v3.0</Typography>

      <Box sx={{ display: "flex", gap: "32px", alignItems: "center" }}>
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Box
              key={tab}
              onClick={() => onTabChange(tab)}
              sx={{
                ...monoLabel,
                position: "relative",
                pb: "2px",
                color: isActive
                  ? tokens.colors.onSurface
                  : tokens.colors.onSurfaceVariant,
                "&::after": tabUnderline(isActive),
                "&:hover::after": {
                  transform: "scaleX(1)",
                  backgroundColor: isActive
                    ? tokens.colors.onSurface
                    : tokens.colors.onSurfaceVariant,
                },
              }}
            >
              {tab}
            </Box>
          );
        })}

        <Box
          sx={{
            width: "1px",
            height: "16px",
            backgroundColor: tokens.colors.borderHairline,
            mx: "4px",
          }}
        />

        <Box sx={monoLabel}>github</Box>
        <Box sx={monoLabel}>linkedin</Box>
        <Box
          sx={{
            cursor: "pointer",
            transition: "color 150ms",
            "&:hover": { color: tokens.colors.onSurface },
          }}
        >
          <Mail size={16} />
        </Box>
      </Box>
    </Box>
  );
}
