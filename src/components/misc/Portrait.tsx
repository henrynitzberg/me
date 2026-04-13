import { Avatar, Fade } from "@mui/material";
import meImage from "../../assets/static/me.jpg";

interface PortraitProps {
  showContent: boolean;
  innerWidth: number;
}

function Portrait({ showContent, innerWidth }: PortraitProps) {
  return (
    innerWidth > 750 && (
      <Fade in={showContent} timeout={1000}>
        <Avatar
          alt="Henry Nitzberg"
          src={meImage}
          sx={{
            width: 175,
            height: 175,
            position: "absolute",
            top: 24,
            right: 48,
            zIndex: 3,
            border: "10px solid white",
            opacity:
              showContent && innerWidth < 800
                ? Math.max((innerWidth - 750) / 50, 0)
                : 1,
          }}
        />
      </Fade>
    )
  );
}

export default Portrait;
