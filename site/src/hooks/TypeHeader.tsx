import sleep from "./sleep";

const CHARS_PER_SECOND = 15;
const MS_PER_CHAR = 1000 / CHARS_PER_SECOND;

interface TypeHeaderProps {
  setHeader: (header: string) => void;
}

export default async function TypeHeader({ setHeader }: TypeHeaderProps) {
  let fullText1 = "Hey! ";
  const fullText2 = ", I'm Henry";

  const type = async () => {
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

    // delete two characters
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

    // Stop cursor at the end
    setHeader(fullText1 + fullText2);
  };

  type();
}
