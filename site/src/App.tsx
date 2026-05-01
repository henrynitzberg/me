import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Header from "./components/header";
import Making from "./components/making";
import Drawing from "./components/drawing";
import Climbing from "./components/climbing";

const TAB_COMPONENTS = { making: Making, drawing: Drawing, climbing: Climbing };
const TABS = Object.keys(TAB_COMPONENTS);

const getTabFromUrl = () => {
  const param = new URLSearchParams(window.location.search).get("tab");
  return param && TABS.includes(param) ? param : TABS[0];
};

function App() {
  const [selectedTab, setSelectedTab] = useState(getTabFromUrl);

  useEffect(() => {
    const onPopState = () => setSelectedTab(getTabFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleTabChange = (newTab: string) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    history.pushState(null, "", `?tab=${newTab}`);
    setSelectedTab(newTab);
  };

  const Tab = TAB_COMPONENTS[selectedTab as keyof typeof TAB_COMPONENTS];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100vw" }}>
      <Header
        version="v1.0"
        last_updated="April 30, 2026"
        selectedTab={selectedTab}
        handleTabChange={handleTabChange}
      />

      <Box sx={{ pb: "64px", display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: { xs: "95%", md: "75%" }, maxWidth: 750 }}>
          <Tab />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
