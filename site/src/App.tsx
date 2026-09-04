import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import AppBar, {
  APP_BAR_HEIGHT,
  APP_BAR_MARGIN,
} from "./components/AppBar/AppBar";
import { TABS, type Tab } from "./components/AppBar/TabSwitcher";
import Making from "./components/making";
import Drawing from "./components/drawing";
import Climbing from "./components/climbing";
import Cursor from "./components/Cursor";
import EdgeFade from "./components/EdgeFade/EdgeFade";
import CustomScrollbar from "./components/CustomScrollbar";
import BrowserWarningModal from "./components/BrowserWarningModal";
import { projects } from "./content/making";

const CONTENT_MAX_WIDTH = 800;
const CONTENT_GAP_BELOW_BAR = 32;
const TAB_QUERY_PARAM = "tab";

function getTabFromLocation(): Tab {
  const param = new URLSearchParams(window.location.search).get(
    TAB_QUERY_PARAM,
  );
  return (TABS as readonly string[]).includes(param ?? "")
    ? (param as Tab)
    : "making";
}

function App() {
  const [selectedTab, setSelectedTab] = useState<Tab>(getTabFromLocation);
  // Which project's detail view is open within the "making" tab, if any -
  // owned here (not inside Making) so the AppBar's back button can control
  // it directly. Making is a plain controlled component for this rather
  // than owning the state itself and notifying this component through a
  // callback: notifying a parent from a child effect update a sibling
  // (the AppBar) reads, `App`, while `Making` is rendering `App` itself is
  // exactly the kind of cross-component update React warns about - lifting
  // the state instead of the notification sidesteps that entirely.
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[number] | null
  >(null);
  const detailBack = selectedProject ? () => setSelectedProject(null) : null;

  // Whichever direction selectedProject changed - opening a project from a
  // scrolled-down grid, or coming back from a scrolled-down detail page -
  // land at the top rather than wherever the previous view happened to be
  // scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedProject]);

  // The browser back/forward button - including landing here from a tab
  // switch's own pushState below - always goes through "popstate", so this
  // is the one place that needs to read the URL back into state.
  useEffect(() => {
    const handlePopState = () => {
      setSelectedProject(null);
      setSelectedTab(getTabFromLocation());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleSelectTab = (tab: Tab) => {
    // leaving the tab entirely invalidates whatever detail view was open
    setSelectedProject(null);
    setSelectedTab(tab);

    // Re-selecting the already-active tab (a plain click on it, or a drag
    // that settles back where it started) shouldn't push a redundant
    // history entry - only an actual tab change should be a "back"-able step.
    if (tab !== selectedTab) {
      const url = new URL(window.location.href);
      url.searchParams.set(TAB_QUERY_PARAM, tab);
      window.history.pushState(null, "", url);
    }
  };

  const handleGlowMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    for (const card of document.getElementsByClassName(
      "glass-box",
    ) as HTMLCollectionOf<HTMLElement>) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }
  };

  return (
    <Box
      onMouseMove={handleGlowMouseMove}
      sx={{ position: "relative", width: "100vw", height: "100vh" }}
    >
      <img
        src="/background.jpeg"
        draggable={false}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          userSelect: "none",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      />
      <Cursor />
      <EdgeFade />
      <CustomScrollbar />
      <BrowserWarningModal />

      <AppBar
        selectedTab={selectedTab}
        onSelectTab={handleSelectTab}
        onBack={detailBack}
      />

      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          pt: `${APP_BAR_MARGIN + APP_BAR_HEIGHT + CONTENT_GAP_BELOW_BAR}px`,
          px: "24px",
          pb: "64px",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: CONTENT_MAX_WIDTH }}>
          {selectedTab === "making" && (
            <Making
              selectedProject={selectedProject}
              onSelectProject={setSelectedProject}
            />
          )}
          {selectedTab === "drawing" && <Drawing />}
          {selectedTab === "climbing" && <Climbing />}
        </Box>
      </Box>
    </Box>
  );
}

export default App;
