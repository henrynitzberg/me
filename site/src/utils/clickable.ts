import type { KeyboardEvent } from "react";

// Spread onto a non-native clickable element (a styled div/span standing in
// for a real <button>, e.g. anything wrapping GlassBox) to give it the same
// keyboard behavior a real button gets for free: reachable by Tab, and
// activatable with Enter or Space. Native elements (<a>, <button>) don't
// need this - only used where the site's visual design requires a plain
// element instead.
export function clickableProps(onClick: () => void, role: "button" | "tab" = "button") {
  return {
    role,
    tabIndex: 0,
    onClick,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    },
  };
}
