import { FaGithub } from "react-icons/fa";
import type { IconType } from "react-icons";
import { TbFileCv } from "react-icons/tb";
import { HiOutlineMail } from "react-icons/hi";

export const links: {
  Icon: IconType;
  label: string;
  href: string;
  target?: string;
}[] = [
  {
    Icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/henrynitzberg",
    target: "_blank",
  },
  {
    Icon: TbFileCv,
    label: "CV",
    href: "/cv.pdf",
    target: "_blank",
  },
  {
    Icon: HiOutlineMail,
    label: "Email",
    href: "mailto:henry@nitzb.org",
  },
];
