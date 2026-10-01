import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

// Loaded from CDNs rather than bundled: the WASM runtime is ~11MB and the
// model ~7.5MB, which would dwarf the entire site. Nothing is fetched until
// the visitor presses the button.
const WASM_PATH =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task";

// MediaPipe's 21-point hand skeleton
const BONES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4], // thumb
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8], // index
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12], // middle
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16], // ring
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20], // pinky
  [0, 17], // palm edge
];

type Point = { x: number; y: number; z: number };
type Metrics = {
  reach: number;
  roll: number;
  pitch: number;
  yaw: number;
  grip: number;
};

const sub = (a: Point, b: Point) => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});
const len = (v: Point) => Math.hypot(v.x, v.y, v.z);
const cross = (a: Point, b: Point) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * The same five channels the teleop loop drives the arm with, derived from
 * the landmarks. Approximations: a single webcam cannot recover true depth,
 * which is why the real project triangulates two.
 */
function measure(L: Point[]): Metrics {
  const wrist = L[0];
  const indexMcp = L[5];
  const middleMcp = L[9];
  const pinkyMcp = L[17];

  const across = sub(pinkyMcp, indexMcp); // knuckle to knuckle
  const along = sub(middleMcp, wrist); // wrist up the palm
  const normal = cross(across, along); // palm facing

  const scale = len(along) || 1e-6;
  const pinch = len(sub(L[4], L[8])); // thumb tip to index tip

  return {
    // apparent hand size stands in for distance from the camera
    reach: Math.min(1, Math.max(0, (scale - 0.08) / 0.22)),
    roll: deg(Math.atan2(across.y, across.x)),
    pitch: deg(Math.atan2(along.z, -along.y)),
    yaw: deg(Math.atan2(normal.x, normal.z)),
    grip: Math.min(1, Math.max(0, (pinch / scale - 0.15) / 1.05)),
  };
}

type Status = "idle" | "loading" | "running" | "error";

function HandTrackingDemo() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<{
    detectForVideo: (
      v: HTMLVideoElement,
      t: number,
    ) => { landmarks: Point[][] };
    close: () => void;
  } | null>(null);
  const rafRef = useRef<number | null>(null);

  // Releasing the camera matters more than anything else here: without this
  // the recording indicator stays lit after the visitor navigates away.
  const stop = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const stopDemo = useCallback(() => {
    stop();
    setMetrics(null);
    setStatus("idle");
  }, [stop]);

  const start = useCallback(async () => {
    setStatus("loading");
    setMessage("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("This browser has no camera API.");
      }

      const { FilesetResolver, HandLandmarker } =
        await import("@mediapipe/tasks-vision");
      const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
      const landmarker = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "VIDEO",
        numHands: 1,
      });
      landmarkerRef.current = landmarker as never;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) throw new Error("Video element missing.");
      video.srcObject = stream;
      await video.play();

      setStatus("running");

      const tick = () => {
        const canvas = canvasRef.current;
        const current = landmarkerRef.current;
        if (!canvas || !current || !video.videoWidth) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const result = current.detectForVideo(video, performance.now());
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // mirrored, so moving right moves the drawing right
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const hand = result.landmarks?.[0];
        if (hand) {
          ctx.strokeStyle = "#fff";
          ctx.lineWidth = 1.5;
          BONES.forEach(([a, b]) => {
            ctx.beginPath();
            ctx.moveTo(hand[a].x * canvas.width, hand[a].y * canvas.height);
            ctx.lineTo(hand[b].x * canvas.width, hand[b].y * canvas.height);
            ctx.stroke();
          });
          ctx.fillStyle = "#fff";
          hand.forEach((p) => {
            ctx.beginPath();
            ctx.arc(
              p.x * canvas.width,
              p.y * canvas.height,
              2.5,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          });
          setMetrics(measure(hand));
        } else {
          setMetrics(null);
        }
        ctx.restore();
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      stop();
      setStatus("error");
      const name = (err as DOMException)?.name;
      setMessage(
        name === "NotAllowedError"
          ? "Camera permission was declined - nothing else to see here."
          : name === "NotFoundError"
            ? "No camera found on this device."
            : (err as Error)?.message || "Could not start the demo.",
      );
    }
  }, [stop]);

  const rows: {
    label: string | React.ReactNode;
    value: string;
    fill: number;
  }[] = metrics
    ? [
        {
          label: <strong>Gripper</strong>,
          value: metrics.grip.toFixed(2),
          fill: metrics.grip,
        },
        {
          label: "Reach",
          value: metrics.reach.toFixed(2),
          fill: metrics.reach,
        },
        {
          label: "Roll",
          value: `${metrics.roll.toFixed(0)}°`,
          fill: (metrics.roll + 180) / 360,
        },
        {
          label: "Pitch",
          value: `${metrics.pitch.toFixed(0)}°`,
          fill: (metrics.pitch + 180) / 360,
        },
        {
          label: "Yaw",
          value: `${metrics.yaw.toFixed(0)}°`,
          fill: (metrics.yaw + 180) / 360,
        },
      ]
    : [];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="overline"
        sx={{
          display: "block",
          fontSize: "13px",
          lineHeight: 1.6,
          color: "text.secondary",
        }}
      >
        Hand Tracking Demo
      </Typography>
      <Typography sx={{ mb: 1.5 }}>
        Try the hand tracking yourself right here in your browser!
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "#0000006a",
          backgroundColor: "#00000010",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          component="video"
          ref={videoRef}
          muted
          playsInline
          sx={{ display: "none" }}
        />
        <Box
          component="canvas"
          ref={canvasRef}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: status === "running" ? "block" : "none",
          }}
        />

        {status === "running" && (
          <>
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                width: 148,
                px: 1.25,
                py: 1,
                borderRadius: 2,
                backdropFilter: "blur(6px)",
                backgroundColor: (theme) =>
                  theme.palette.background.default + "d9",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {metrics ? (
                rows.map(({ label, value, fill }) => (
                  <Box
                    key={label as string}
                    sx={{ "&:not(:last-of-type)": { mb: 0.75 } }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <Typography
                        variant="overline"
                        sx={{ fontSize: "10px", color: "text.secondary" }}
                      >
                        {label}
                      </Typography>
                      <Typography sx={{ fontSize: "11px" }}>{value}</Typography>
                    </Box>
                    <Box
                      sx={{
                        height: 3,
                        borderRadius: 2,
                        backgroundColor: "#0000001a",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          width: `${Math.min(100, Math.max(0, fill * 100))}%`,
                          backgroundColor: "#0b0000b4",
                        }}
                      />
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body2"
                  sx={{ fontSize: "11px", color: "text.secondary" }}
                >
                  Hold a hand up to the camera.
                </Typography>
              )}
            </Box>

            <Typography
              component="button"
              variant="overline"
              onClick={stopDemo}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                fontSize: "11px",
                lineHeight: 1,
                px: 1.5,
                py: 0.9,
                borderRadius: "16px",
                backdropFilter: "blur(6px)",
                backgroundColor: (theme) =>
                  theme.palette.background.default + "d9",
                border: "1px solid",
                borderColor: "divider",
                color: "inherit",
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "opacity 0.15s",
                "&:hover": { opacity: 0.6 },
              }}
            >
              Stop
            </Typography>
          </>
        )}

        {status !== "running" && (
          <Box sx={{ textAlign: "center", px: 3 }}>
            {status === "idle" && (
              <>
                <Typography
                  component="button"
                  variant="overline"
                  onClick={start}
                  sx={{
                    fontSize: "13px",
                    lineHeight: 1,
                    px: 2,
                    py: 1.25,
                    border: "1px solid",
                    borderColor: "text.primary",
                    borderRadius: "18px",
                    background: "none",
                    color: "inherit",
                    fontFamily: "inherit",
                    cursor: "pointer",
                    transition: "opacity 0.15s",
                    "&:hover": { opacity: 0.6 },
                  }}
                >
                  Start camera
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1.5, color: "text.secondary" }}
                >
                  Runs locally on device.
                  <br />
                  Loading the model may take a moment.
                </Typography>
              </>
            )}
            {status === "loading" && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                loading model...
              </Typography>
            )}
            {status === "error" && (
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {message}
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {status === "running" && (
        <Typography
          variant="body2"
          sx={{ mt: 1.5, color: "text.secondary", fontSize: "13px" }}
        >
          Note that the actual project uses two cameras to triangulate depth
          more accurately, alongside various smoothing functions.
        </Typography>
      )}
    </Box>
  );
}

export default HandTrackingDemo;
