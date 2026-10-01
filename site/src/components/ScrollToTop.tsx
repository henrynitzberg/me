import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

/**
 * Resets scroll on every navigation.
 *
 * <BrowserRouter> does not touch scroll position when the route changes, so
 * tapping a project from halfway down the grid lands you halfway down the
 * project page. React Router's own <ScrollRestoration> only works with a data
 * router (createBrowserRouter), so this does the job instead.
 *
 * useLayoutEffect rather than useEffect: it runs before the browser paints,
 * so the new page never flashes at the old scroll position first.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // "instant" guards against a global `scroll-behavior: smooth` turning
    // every navigation into a visible scroll back up the old page
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
