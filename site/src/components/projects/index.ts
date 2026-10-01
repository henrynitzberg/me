import type { ComponentType } from "react";
import type { Project } from "../../content/making";
import ComputerCase from "./ComputerCase";
import RlRover from "./RlRover";
import NbLux from "./NbLux";
import AiPolicyDb from "./AiPolicyDb";
import So101Teleop from "./So101Teleop";

export type ProjectPageProps = { project: Project };

// Each project gets its own bespoke page. Slugs without an entry here fall
// back to the generic layout in ../ProjectPage.
export const projectPages: Record<
  string,
  ComponentType<ProjectPageProps> | undefined
> = {
  "computer-case": ComputerCase,
  "rl-rover": RlRover,
  "nb-lux": NbLux,
  aipolicydb: AiPolicyDb,
  "so101-human-teleop": So101Teleop,
};
