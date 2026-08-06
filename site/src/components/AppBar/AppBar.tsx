import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { ChevronLeft } from "lucide-react";
import GlassBox from "../GlassBox/GlassBox";
import GlassIconButton from "../GlassBox/GlassIconButton";
import { links } from "../../content/links";
import TabSwitcher, { type Tab } from "./TabSwitcher";

export const APP_BAR_HEIGHT = 64;
const APP_BAR_MAX_WIDTH = 850;
export const APP_BAR_MARGIN = 24;

// The back button is a circle the same height as the bar, sitting to its
// left with this much of a gap between them.
const BACK_BUTTON_SIZE = APP_BAR_HEIGHT;
const BACK_BUTTON_GAP = 12;
const BACK_BUTTON_FADE_MS = 250;

function getWidth() {
  return Math.min(APP_BAR_MAX_WIDTH, window.innerWidth - APP_BAR_MARGIN * 2);
}

interface AppBarProps {
  selectedTab: Tab;
  onSelectTab: (tab: Tab) => void;
  // Non-null means a detail view is open somewhere in the current tab: the
  // bar shrinks to make room for a back button that calls this.
  onBack: (() => void) | null;
}

function AppBar({ selectedTab, onSelectTab, onBack }: AppBarProps) {
  const theme = useTheme();
  // The "HN" mark and the link icons sit in their own flex thirds, but the
  // tab pill is centered over the *whole* bar independent of that layout -
  // at narrow widths the pill's own natural width (label text + gaps) can
  // exceed what's left after those thirds, so it overlaps them rather than
  // being squeezed by them. Simplest fix is to stop competing for the room:
  // below `sm`, the tabs are the only nav that matters, so the branding and
  // links just don't render, leaving the whole bar to the pill.
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [width, setWidth] = useState(getWidth);
  // A plain conditional mount only ever gets a fade *in* - there's no DOM
  // node left once onBack goes null for a CSS transition to animate the
  // opacity of. Keeping it mounted a little longer than `onBack` says to
  // is what makes the fade *out* possible: `shouldRender` controls whether
  // the button exists at all, `shown` (a tick behind on the way in, a tick
  // ahead on the way out) controls its opacity, so there's always a real
  // element present while its opacity is transitioning either direction.
  const [shouldRender, setShouldRender] = useState(Boolean(onBack));
  const [shown, setShown] = useState(Boolean(onBack));

  useEffect(() => {
    const handleResize = () => setWidth(getWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (onBack) {
      setShouldRender(true);
      // mounts at opacity 0 (shown=false); flipping this on the next frame,
      // rather than in the same commit, is what gives the transition an
      // actual "before" state to animate away from instead of just
      // appearing at full opacity with nothing to interpolate from
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    setShown(false);
    const timeout = window.setTimeout(
      () => setShouldRender(false),
      BACK_BUTTON_FADE_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [onBack]);

  const barWidth = onBack ? width - BACK_BUTTON_SIZE - BACK_BUTTON_GAP : width;

  return (
    <Box
      sx={{
        position: "fixed",
        top: APP_BAR_MARGIN,
        left: "50%",
        transform: "translateX(-50%)",
        // fixed at the bar's own normal (unshrunk) width regardless of
        // onBack, so this outer anchor never moves - only the bar inside
        // it shrinks, with the button filling the space that opens up.
        // Its own right edge is what has to stay put, not the page center,
        // which is why this can't just be `left: 50%` on the bar alone.
        width,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: `${BACK_BUTTON_GAP}px`,
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      {shouldRender && (
        <Box
          sx={{
            flexShrink: 0,
            opacity: shown ? 1 : 0,
            pointerEvents: shown ? "auto" : "none",
            transition: `opacity ${BACK_BUTTON_FADE_MS}ms ease`,
          }}
        >
          <GlassIconButton
            size={BACK_BUTTON_SIZE}
            onClick={() => onBack?.()}
            aria-label="Back"
          >
            <ChevronLeft size={26} />
          </GlassIconButton>
        </Box>
      )}

      <Box sx={{ position: "relative", flexShrink: 0 }}>
        <GlassBox
          width={barWidth}
          height={APP_BAR_HEIGHT}
          borderRadius={APP_BAR_HEIGHT / 2}
          backgroundOpacity={0.3}
          hoverBounceDeltaScale={0.001}
          style={{ transition: "width 0.3s ease" }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              px: 3,
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: isMobile ? "none" : "flex",
                justifyContent: "flex-start",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "text.primary", userSelect: "none" }}
              >
                HN
              </Typography>
            </Box>

            {/* TabSwitcher's own pill has its own backdrop-filter (to refract
                the tab labels behind it) - nested inside this GlassBox's
                backdrop-filter, that inner filter silently no-ops in Chromium
                and shows raw unfiltered content instead. This flex slot stays
                here only to keep HN and the links pinned to the same
                positions as before; TabSwitcher itself renders as a sibling
                of this GlassBox below, positioned on top of it visually
                instead of nested inside it. */}
            <Box sx={{ flex: 1 }} />

            <Box
              sx={{
                flex: 1,
                display: isMobile ? "none" : "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
              }}
            >
              {links.map(({ Icon, label, href, target }) => (
                <Tooltip
                  key={label}
                  title={
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      {label}
                    </Box>
                  }
                  placement="bottom"
                >
                  <Box
                    component="a"
                    href={href}
                    target={target}
                    rel="noopener noreferrer"
                    aria-label={label}
                    sx={{
                      display: "flex",
                      color: "text.primary",
                      transition: "opacity 0.15s",
                      "&:hover": { opacity: 0.75 },
                      "&:active": { opacity: 0.5 },
                    }}
                  >
                    <Icon size={18} />
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </GlassBox>

        {/* centered over the bar specifically (via this position:relative
            wrapper hugging just the bar's own GlassBox), not over the page -
            the bar's own center shifts right of page-center once it shrinks
            for the back button, and this needs to track that, not the
            outer row's (fixed, never-moving) center */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            height: APP_BAR_HEIGHT,
            display: "flex",
            alignItems: "center",
          }}
        >
          <TabSwitcher selectedTab={selectedTab} onSelectTab={onSelectTab} />
        </Box>
      </Box>
    </Box>
  );
}

export default AppBar;
