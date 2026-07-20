import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import Navbar from "./components/Navbar";
import About from "./components/About";
import { tokens } from "./theme";

const TABS = ["about", "drawing", "climbing"];

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
      }}
    >
      <Navbar tabs={TABS} activeTab={selectedTab} onTabChange={handleTabChange} />
      <Box
        component="main"
        sx={{
          flex: 1,
          px: tokens.spacing.gridMargin,
          py: tokens.spacing.stackLg,
          maxWidth: "1280px",
          width: "100%",
          mx: "auto",
        }}
      >
        {selectedTab === "about" && <About />}
      </Box>
    </Box>
  );
}

export default App;
