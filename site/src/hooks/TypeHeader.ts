import sleep from "./sleep";

const CHARS_PER_SECOND = 15;
const MS_PER_CHAR = 1000 / CHARS_PER_SECOND;

export default async function TypeHeader(
  setHeader: (header: string) => void,
  signal: AbortSignal,
): Promise<void> {
  let fullText1 = "Hey! ";
  const fullText2 = ", I'm Henry";

  const set = (val: string) => {
    if (!signal.aborted) setHeader(val);
  };

  // Blink cursor
  for (let i = 0; i < 3; i++) {
    if (signal.aborted) return;
    set(i % 2 === 0 ? "|" : " ");
    await sleep(350);
  }

  // Type first part
  for (let i = 0; i <= fullText1.length; i++) {
    if (signal.aborted) return;
    set(fullText1.slice(0, i) + "|");
    await sleep(MS_PER_CHAR);
  }

  // Blink cursor
  for (let i = 0; i < 4; i++) {
    if (signal.aborted) return;
    set(fullText1 + (i % 2 === 0 ? "|" : " "));
    await sleep(350);
  }

  // Delete two characters
  for (let i = fullText1.length; i >= fullText1.length - 2; i--) {
    if (signal.aborted) return;
    set(fullText1.slice(0, i) + "|");
    await sleep(MS_PER_CHAR);
  }

  fullText1 = fullText1.slice(0, fullText1.length - 2);

  // Type second part
  for (let i = 0; i <= fullText2.length; i++) {
    if (signal.aborted) return;
    set(fullText1 + fullText2.slice(0, i) + "|");
    await sleep(MS_PER_CHAR);
  }

  for (let i = 0; i < 6; i++) {
    if (signal.aborted) return;
    set(fullText1 + fullText2 + (i % 2 === 0 ? "|" : " "));
    await sleep(350);
  }

  set(fullText1 + fullText2);
}
