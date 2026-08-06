import { useEffect, useState } from "react";
import sleep from "./sleep";

const CHARS_PER_SECOND = 15;
const MS_PER_CHAR = 1000 / CHARS_PER_SECOND;

const GREETING_PREFIX = "Hey! ";
const GREETING_SUFFIX = ", I'm Henry.";
// what typeHeader eventually settles on: the prefix minus the 2 characters
// it deletes partway through, plus the suffix - derived here (rather than
// hardcoded separately) so it can't drift from what the animation below
// actually produces.
const FINAL_TEXT =
  GREETING_PREFIX.slice(0, GREETING_PREFIX.length - 2) + GREETING_SUFFIX;

// The `making` tab (and this hook with it) unmounts and remounts every
// time you switch tabs away and back - a plain useEffect would replay the
// whole animation on every remount. This flag lives at module scope
// (outside any component), so it survives that unmount/remount cycle for
// as long as the page itself stays loaded: the animation runs once, ever,
// per session, and every mount after the first just renders FINAL_TEXT.
let hasPlayed = false;

// No abort/cancellation here on purpose - see the note on `hasPlayed`
// below for why. Calling setHeader after the component that started this
// has unmounted is harmless in React 18+ (a silent no-op, not a warning),
// so there's nothing to actually clean up by stopping it early.
async function typeHeader(setHeader: (header: string) => void): Promise<void> {
  let fullText1 = GREETING_PREFIX;
  const fullText2 = GREETING_SUFFIX;

  // Blink cursor
  for (let i = 0; i < 3; i++) {
    setHeader(i % 2 === 0 ? "|" : " ");
    await sleep(350);
  }

  // Type first part
  for (let i = 0; i <= fullText1.length; i++) {
    setHeader(fullText1.slice(0, i) + "|");
    await sleep(MS_PER_CHAR);
  }

  // Blink cursor
  for (let i = 0; i < 4; i++) {
    setHeader(fullText1 + (i % 2 === 0 ? "|" : " "));
    await sleep(350);
  }

  // Delete two characters
  for (let i = fullText1.length; i >= fullText1.length - 2; i--) {
    setHeader(fullText1.slice(0, i) + "|");
    await sleep(MS_PER_CHAR);
  }

  fullText1 = fullText1.slice(0, fullText1.length - 2);

  // Type second part
  for (let i = 0; i <= fullText2.length; i++) {
    setHeader(fullText1 + fullText2.slice(0, i) + "|");
    await sleep(MS_PER_CHAR);
  }

  for (let i = 0; i < 6; i++) {
    setHeader(fullText1 + fullText2 + (i % 2 === 0 ? "|" : " "));
    await sleep(350);
  }

  setHeader(fullText1 + fullText2);
}

export default function useTypeHeader(): string {
  const [header, setHeader] = useState(() => (hasPlayed ? FINAL_TEXT : ""));

  useEffect(() => {
    // already ran once this session (e.g. remounting after a tab switch) -
    // leave the plain final text in place rather than typing it out again
    if (hasPlayed) return;
    hasPlayed = true;

    // StrictMode (dev only) runs every effect, its cleanup, then the
    // effect again, specifically to catch effects that behave badly under
    // that - the previous version aborted the animation in that synthetic
    // cleanup, and since `hasPlayed` was already true by then, the second
    // (real) invocation saw it and skipped starting a new one, leaving
    // the header stuck on whatever the aborted first attempt last set.
    // Not cancelling it is what makes it survive that: the one instance
    // that actually starts just runs to completion regardless of which
    // mount is "current" by the time it finishes.
    typeHeader(setHeader);
  }, []);

  return header;
}
