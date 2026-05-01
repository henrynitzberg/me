import { useEffect, useRef, useState } from "react";
import { Box, Popover, Typography } from "@mui/material";
import TypeHeader from "../../hooks/TypeHeader";
import { links } from "../../content/links";

interface HeaderProps {
  version: string;
  last_updated: string;
  selectedTab: string;
  handleTabChange: (tab: string) => void;
}

export default function Header({
  version,
  last_updated,
  selectedTab,
  handleTabChange,
}: HeaderProps) {
  const [header, setHeader] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    TypeHeader({ setHeader });
  }, []);

  const tabText = (text: string) => {
    const selected = selectedTab === text;
    return (
      <Typography
        variant="h6"
        component="span"
        sx={{
          color: "text.primary",
          textDecoration: selected ? "underline" : "none",
          fontWeight: "bold",
          cursor: "pointer",
          // Add a subtle color change on hover
          "&:hover": {
            opacity: "75%",
          },
          // on mouse down
          "&:active": {
            opacity: "50%",
          },
          transition: "opacity 0.2s",
          userSelect: "none",
        }}
        onClick={() => handleTabChange(text)}
      >
        {text}
      </Typography>
    );
  };
  return (
    <Box
      sx={{
        width: "100%",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        paddingTop: 4,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          width: 320,
          whiteSpace: "nowrap",
          alignSelf: "center",
          minHeight: "1.2em",
        }}
      >
        {header}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          color: "text.secondary",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        My life is mostly comprised of {tabText("making")}, {tabText("drawing")}
        , and {tabText("climbing")}.
      </Typography>
      <Box
        sx={{
          width: "75%",
          minWidth: 500,
          borderBottom: "1px solid #000",
          pt: "3px",
          height: "0px",
        }}
      />
      <Box
        sx={{
          width: "75%",
          minWidth: 500,
          borderBottom: "1px solid #000",
          height: "18px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: "15px",
        }}
      >
        <Typography variant="body2">{version}</Typography>
        <Typography variant="body2">Last Updated {last_updated}</Typography>
        <Typography
          ref={menuAnchorRef}
          variant="body2"
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
            "&:hover": { opacity: 0.75 },
            "&:active": { opacity: 0.5 },
            transition: "opacity 0.2s",
            userSelect: "none",
          }}
          onClick={() => setMenuOpen((o) => !o)}
        >
          Me
        </Typography>

        <Popover
          open={menuOpen}
          anchorEl={menuAnchorRef.current}
          onClose={() => setMenuOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                mt: "3px",
                p: "12px",
                overflow: "visible",
                border: "1px solid #000",
                borderRadius: 0,
              },
            },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row", gap: "12px" }}>
            {links.map(({ Icon, label, href, target }) => (
              <Box
                key={label}
                component="a"
                href={href}
                target={target}
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  color: "text.primary",
                  "&:hover": { opacity: 0.75 },
                  "&:active": { opacity: 0.5 },
                  transition: "opacity 0.15s",
                }}
              >
                <Icon size={24} />
              </Box>
            ))}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
