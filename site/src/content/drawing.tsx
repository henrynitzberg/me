export type Work = {
  image: string;
  /** Higher-resolution variant, loaded only when the modal opens. */
  full: string;
  title: string;
  description: string;
  date: string;
  media: string;
  /** Intrinsic size, so the gallery can balance columns and reserve space. */
  width: number;
  height: number;
};

export const works: Work[] = [
  {
    image: "/drawing/the-nitzberg-look.webp",
    full: "/drawing/the-nitzberg-look-full.webp",
    title: "The Nitzberg Look",
    description:
      "My father, Mark Nitzberg, has a peculiar expression he makes from time to time. Here, I caught it at a restaurant.",
    date: "2024",
    media: "Acrylic on canvas",
    width: 1000,
    height: 1420,
  },
  {
    image: "/drawing/nitzberg-henry-project3.webp",
    full: "/drawing/nitzberg-henry-project3-full.webp",
    title: "Release",
    description:
      "In my last art class at Tufts, Professor Timothy gave every student a 4ft 2x4, and told us to come back with a sculpture. " +
      "Only basic fasteners were allowed, i.e. nails, screws, and wire.",
    date: "2025",
    media: "Fir, nails, and wire.",
    width: 1000,
    height: 1254,
  },
  {
    image: "/drawing/hopper-copy-copy.webp",
    full: "/drawing/hopper-copy-copy-full.webp",
    title: "Hopper Copy Copy",
    description:
      "Commission for client. Copy of Boulevard of Broken Dreams by Gottfried Helnwein, an homage to Nighthawks but with modern celebrities.",
    date: "2024",
    media: "Acrylic on canvas",
    width: 1000,
    height: 495,
  },
  {
    image: "/drawing/school-fever.webp",
    full: "/drawing/school-fever-full.webp",
    title: "School Fever",
    description: "Observational drawing from life.",
    date: "2021",
    media: "Acrylic on wood board",
    width: 722,
    height: 1000,
  },
  {
    image: "/drawing/upside-down-self-portrait.webp",
    full: "/drawing/upside-down-self-portrait-full.webp",
    title: "Upside Down Self Portrait",
    description: "Portrait for a class titled 'Painting from Photographs'.",
    date: "2024",
    media: "Acrylic on canvas",
    width: 1000,
    height: 1604,
  },
  {
    image: "/drawing/weible.webp",
    full: "/drawing/weible-full.webp",
    title: "Weible",
    description:
      "Portrait of my high school advisor Mr. Weible, gifted to him just before my graduation.",
    date: "2021",
    media: "Acrylic on canvas",
    width: 781,
    height: 1000,
  },
  {
    image: "/drawing/balloon-self-portrait.webp",
    full: "/drawing/balloon-self-portrait-full.webp",
    title: "Balloon Self Portrait",
    description: "Scholastic Golden Key Award winner, 2021.",
    date: "2021",
    media: "Graphite on paper",
    width: 745,
    height: 1000,
  },
  {
    image: "/drawing/dad.webp",
    full: "/drawing/dad-full.webp",
    title: "Dad",
    description: "Portrait of my father.",
    date: "2023-12",
    media: "Acrylic on wood panel",
    width: 1000,
    height: 1384,
  },
  {
    image: "/drawing/aqueduct.webp",
    full: "/drawing/aqueduct-full.webp",
    title: "Aqueduct",
    description: "Scholastic Golden Key Award winner, 2021.",
    date: "2021",
    media: "Acrylic on wood panel",
    width: 1000,
    height: 1014,
  },
];
