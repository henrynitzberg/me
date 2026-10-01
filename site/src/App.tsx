import Box from "@mui/material/Box";
import { Route, Routes } from "react-router";
import Header from "./components/Header";
import Portfolio from "./components/Portfolio";
import Artwork from "./components/Artwork";
import ProjectPage from "./components/ProjectPage";
import Nav from "./components/Nav";
import ScrollToTop from "./components/ScrollToTop";
import { MAX_WIDTH } from "./constants";

function App() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: MAX_WIDTH,
        mx: "auto",
        minHeight: "100vh",
      }}
    >
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Header />
              <Portfolio />
            </>
          }
        />
        <Route
          path="/artwork"
          element={
            <>
              <Header />
              <Artwork />
            </>
          }
        />
        {/* project pages swap the typed header for the project title */}
        <Route path="/projects/:slug" element={<ProjectPage />} />
      </Routes>
    </Box>
  );
}

export default App;
