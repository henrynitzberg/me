import { useEffect, useState } from "react";
import { Box, Fade, Typography } from "@mui/material";
import MakingInfo from "./components/making/MakingInfo";
import ClimbingInfo from "./components/climbing/ClimbingInfo";
import DrawingInfo from "./components/drawing/DrawingInfo";

import Portrait from "./components/misc/Portrait";
import ClimbingGallery from "./components/climbing/ClimbingGallery.tsx";
import { sleep } from "./components/misc/sleep.tsx";
import DrawingGallery from "./components/drawing/DrawingGallery.tsx";

function App() {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setInnerHeight(window.innerHeight);
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [topHeight, setTopHeight] = useState(0);
  const [bottomHeight, setBottomHeight] = useState(0);

  const topHeightPercent = 0.2;

  // Update heights on innerHeight change
  useEffect(() => {
    const topHeight = Math.max(window.innerHeight * topHeightPercent, 175);
    const bottomHeight = window.innerHeight - topHeight;
    setTopHeight(topHeight);
    setBottomHeight(bottomHeight);
  }, [innerHeight]);
  const [titleText, setTitleText] = useState("|");
  const [showContent, setShowContent] = useState(false);

  // Type title
  useEffect(() => {
    let fullText1 = "Hey! ";
    const fullText2 = ", I'm Henry.";

    const type = async () => {
      // Blink cursor
      for (let i = 0; i < 3; i++) {
        setTitleText(i % 2 === 0 ? "|" : "");
        await sleep(350);
      }

      // Type first part
      for (let i = 0; i <= fullText1.length; i++) {
        setTitleText(fullText1.slice(0, i) + "|");
        await sleep(75);
      }

      // Blink cursor
      for (let i = 0; i < 4; i++) {
        setTitleText(fullText1 + (i % 2 === 0 ? "|" : ""));
        await sleep(350);
      }

      // delete two characters
      for (let i = fullText1.length; i >= fullText1.length - 2; i--) {
        setTitleText(fullText1.slice(0, i) + "|");
        await sleep(100);
      }

      fullText1 = fullText1.slice(0, fullText1.length - 2);

      // Type second part
      for (let i = 0; i <= fullText2.length; i++) {
        setTitleText(fullText1 + fullText2.slice(0, i) + "|");
        await sleep(75);
      }

      setShowContent(true);
      for (let i = 0; i < 4; i++) {
        setTitleText(fullText1 + fullText2 + (i % 2 === 0 ? "|" : ""));
        await sleep(350);
      }

      // Stop cursor at the end
      setTitleText(fullText1 + fullText2);
    };

    type();
  }, []);

  const [selectedTabIndex, setSelectedTabIndex] = useState(1);

  const getTabText = (index: number, text: string) => {
    return (
      <Typography
        variant="h3"
        color="secondary.main"
        component="span"
        sx={{
          cursor: "pointer",
          borderBottom:
            index === selectedTabIndex ? "2px solid" : "2px solid transparent",
          transition: "border-color 0.3s",
        }}
        onClick={() => setSelectedTabIndex(index)}
      >
        {text}
      </Typography>
    );
  };

  return (
    <Box sx={{ width: "100vw", height: "100vh" }}>
      {/* Intro Section */}
      <Box
        sx={{
          width: "100vw",
          height: topHeight,
          backgroundColor: "primary.main",
          position: "relative",
          pl: "48px",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "20px", // adjust fade strength
            pointerEvents: "none",
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255, 255, 255, 1))",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          {/* title and subtitle text */}
          <Box
            sx={{
              pt: "38px",
              display: "flex",
              flexDirection: "column",
              gap: "17px",
            }}
          >
            <Typography
              variant="h1"
              color="secondary.main"
              sx={{ minHeight: "57px" }}
            >
              {titleText}
            </Typography>
            <Fade in={showContent} timeout={1000}>
              <Typography variant="h3" color="secondary.main">
                I like to spend my time {getTabText(0, "making")},{" "}
                {getTabText(1, "climbing")}, and {getTabText(2, "drawing")}.
              </Typography>
            </Fade>
          </Box>
          <Portrait showContent={showContent} innerWidth={innerWidth} />
        </Box>
      </Box>
      {/* Content Section */}
      <Fade in={showContent} timeout={1000}>
        <Box
          sx={{
            width: "100vw",
            height: bottomHeight,
            maxHeight: bottomHeight,
            backgroundColor: "secondary.main",
            pl: "48px",
            display: "flex",
            flexDirection: innerWidth < 612 ? "column" : "row",
            position: "relative",
            overflowY: "auto",
          }}
        >
          {selectedTabIndex === 0 && <MakingInfo />}
          {selectedTabIndex === 1 && <ClimbingInfo />}
          {selectedTabIndex === 1 && (
            <ClimbingGallery
              selectedTabIndex={selectedTabIndex}
              setSelectedTabIndex={setSelectedTabIndex}
            />
          )}
          {selectedTabIndex === 2 && <DrawingInfo />}
          {selectedTabIndex === 2 && (
            <DrawingGallery
              selectedTabIndex={selectedTabIndex}
              setSelectedTabIndex={setSelectedTabIndex}
            />
          )}
        </Box>
      </Fade>
    </Box>
  );
}

export default App;
