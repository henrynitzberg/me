export type Project = {
  image: string;
  title: string;
  slug: string;
  date: string;
  link?: string;
  // Free-form payload for this project's bespoke page. Each page in
  // components/projects owns the shape of its own entry - nothing outside
  // that page should reach into it.
  data: Record<string, unknown>;
};

export const projects: Project[] = [
  {
    image: "/making/so101-human-teleop/title.webp",
    title: "SO-101 Human Teleop",
    slug: "so101-human-teleop",
    date: "2026-09",
    link: "https://github.com/henrynitzberg/SO101_Human_Teleop#readme",
    data: {
      video: "/making/so101-human-teleop/teleop.mp4",
      poster: "/making/so101-human-teleop/teleop-poster.webp",
      description:
        "In need of a project to get me through my brief unemployement, I decided to build the open source hugging face robot arm: the SO-101. " +
        "It felt like cheating to use the leader arm to control it directly and I didn't particularly feel like buying 6 additional servos. " +
        "Instead, I built a system that uses computer vision to track my hand in 3D space and translate that into the arm's movements. " +
        "If you have 2 webcams, a chessboard, and an SO101 follower arm, try it out!",
    },
  },
  {
    image: "/making/nb-lux/title.JPG",
    title: "NB-Lux",
    slug: "nb-lux",
    date: "2026-08",
    link: "https://nb-lux.com",
    data: {
      intro:
        "NB-Lux represents the sum of just over a years worth of work at Nucleus Biologics. It is an end to end digital ordering platform for cell media manufacturer Nucleus Biologics, in two halves: NB-Lux, the customer-facing app, and NB-Dash, the internal dashboard behind it. " +
        "Designed, developed, tested, and deployed from the ground up by myself and Zeno Marquis.",
      stack: ["React", "TypeScript", "FastAPI", "Python", "PostgreSQL", "AWS"],
      sections: [
        {
          heading: "Ordering",
          body:
            "Customers configure a custom media formulation - components by CAS number, packaging, QC testing, grade level - or just describe what they need to CRAIC, an AI assistant that assembles it for them. " +
            "Drafts become requests, requests group into quotes, and quotes become orders: each layer adds only what it owns.",
        },
        {
          heading: "Moving work through",
          body:
            "Internally that same work crosses configurable kanban boards, from intake through quoting, manufacturing prep, and release. " +
            "The kanban boards are fairly standard, except that ownership belongs to board columns AND tickets, so a single ticket may change hands several times (even within an individual status) before it's completed.",
        },
        {
          heading: "Pricing",
          body: "Prices are calculated from a living database of inventory items, each with its own cost, markup, and availability. All pricing data for raw materials is tracked over time, and visible on various dashboards.",
        },
        {
          heading: "Reproducible quotes",
          body: "Reference data is copied in place the moment it is pulled into a request, so a quote issued a year ago still reproduces exactly even after every catalog and cost behind it has moved on.",
        },
        {
          heading: "Integrations",
          body: "The platform syncs both ways with Fishbowl for inventory, pricing, and scheduling, pulls material specifications from ZenQMS, reconciles committed builds against stock to surface shortages, generates quote PDFs, and records every mutating call in an audit trail.",
        },
      ],
      extras: [
        "/making/nb-lux/splash.webp",
        "/making/nb-lux/craic.webp",
        "/making/nb-lux/dashboard.webp",
        "/making/nb-lux/orders.webp",
        "/making/nb-lux/login.webp",
      ],
    },
  },
  {
    image: "/making/aipolicydb/title.JPG",
    title: "AI Policy Database",
    slug: "aipolicydb",
    date: "2026-06",
    link: "https://aipolicydb.com",
    data: {
      embed: "https://aipolicydb.com",
      intro:
        "Worked with Zeno Marquis to revamp his CHAI project: a continuously updating database of American artificial intelligence policy, with over 4,000 entries spanning all 50 states, Washington D.C., and federal agencies. " +
        "The two of us put this together the weekend before the 2026 CHAI conference, staying up rather late in Lestats (University Heights, San Diego).",
      stack: [
        "Django",
        "Python",
        "PostgreSQL",
        "React",
        "TypeScript",
        "Docker",
        "AWS",
      ],
      sections: [
        {
          heading: "Ingestion",
          body:
            "State bills come from LegiScan, federal packages from GovInfo. Each are refreshed every 24 hours." +
            "Every Sunday morning an AI written digest of the week's activity is written and stored in our database.",
        },
        {
          heading: "Search",
          body: "Filters narrow by date, state, subject, and status, wiht text being applied last.",
        },
      ],
    },
  },
  {
    image: "/making/rl-rover/RL_Rover.webp",
    title: "RL Rover",
    slug: "rl-rover",
    date: "2025-03",
    link: "https://github.com/henrynitzberg/RL_Rover",
    data: {
      description:
        "Self Driving Rover project using only a cheap lidar sensor, and PPO reinforcement learning. " +
        "We trained the underlying model SB3 in a custom Gymnasium gridworld with basic ray tracing to simulate the lidar sensor. " +
        "A policy trained over 100,000 steps on a 7x7 map drops straight onto a Raspberry Pi 5, which reads the physical sensor over serial and drives the treads over GPIO PWM. " +
        "We had a lot of trouble getting data out of the lidar sensor, and eventually wrote a custom C++ driver to unpack the bits directly from the sensor.",
      materials: [
        {
          title: "LiDAR Sensor",
          link: "https://www.amazon.com/dp/B0C1C4VW47?ref_=ppx_hzsearch_conn_dt_b_fed_asin_title_3",
          img: "/making/rl-rover/sensor.webp",
        },
        {
          title: "Raspberry Pi 5",
          link: "https://www.digikey.com/en/products/detail/raspberry-pi/SC1432/21658257?gclsrc=aw.ds&gad_source=1&gad_campaignid=20228387720&gbraid=0AAAAADrbLlj4_ooglbngmEkUqZ4jPbrA5&gclid=Cj0KCQjw5vLVBhCiARIsAD56SFL-qZ-Jx7BDEECHN6HJnhvy2JLFCAx-TVpnaktN0DxyhsQghC9Gkb0aAgELEALw_wcB",
          img: "/making/rl-rover/pi.webp",
        },
        {
          title: "Motor Controller",
          link: "https://www.amazon.com/dp/B0CR6BX5QL?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1",
          img: "/making/rl-rover/motor_controller.webp",
        },
        {
          title: "Batteries",
          link: "https://www.amazon.com/dp/B0CWF8FNNQ?ref=ppx_yo2ov_dt_b_fed_asin_title",
          img: "/making/rl-rover/batteries.webp",
        },
        {
          title: "Base",
          link: "https://www.amazon.com/Tracked-Caterpillar-Platform-Raspberry-Microbit/dp/B09V7NMCPK/ref=sr_1_5?crid=36L3UC7X46ZP7&dib=eyJ2IjoiMSJ9.DgFeS_0jApo5e0_sYe4V4TQvYnix0S7fw7ONUlyAx1tbvoNhOo1EYoj3hskIeDXcJYxZMMgcWWVCbiAeMTZ06zjqjdYpE_MZbC2bPqfWYDnbeyngfKgHQha_Hth3UIqwloulk6YxZ34yvAInuZPVcXyOo2aa3yITm8euWtEfbDXqvqnJFoSO-CuUFuxWBsc9Wac94bdHYNJ9e-EfazkmhXfy4okC5_9rVRfhi_coyRSPU7lkzihRop7zUNX8_xgNGDupUpFa2vEbiMz4KnAuQ_Ucy_fa0NGCcXkd26BUv1o.4VVtszRkOlAyixgPB2Gq2hCmFoK6ciC4UczgMM7ua34&dib_tag=se&keywords=tank%2Btread%2Brobot%2Bbase&qid=1790792187&sprefix=tank%2Btread%2Brobot%2Bbase%2Caps%2C201&sr=8-5&th=1",
          img: "/making/rl-rover/treads.webp",
        },
      ],
      extras: [
        "/making/rl-rover/rover_back.webp",
        "/making/rl-rover/rover_env.webp",
        "/making/rl-rover/lidar_reading.webp",
      ],
    },
  },
  {
    image: "/making/computer-case/title.JPG",
    title: "Computer Case",
    slug: "computer-case",
    date: "2024-06",
    data: {
      description:
        "I designed this custom computer case to enable myself to pack my desktop PC into a suitcase, and bring it back and forth between home and school. " +
        "The case was modeled in OnShape (inspired by the Skyreach 4 Mini), and is made of 3d printed ABS parts. The side panels were a generous gift from a friend: custom cut/formed aluminium sheets (Thanks, Bob!). " +
        "Internal highlights include a 3080, an Intel 12900k, and a Glorious Panda keyboard switch as the power button.",
      extras: ["/making/computer-case/life.webp"],
    },
  },
];
