import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 2.5 * fps], [1.4, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const shakeX = frame < 1 * fps
    ? Math.sin(frame * 1.8) * interpolate(frame, [0, 1 * fps], [8, 0], { extrapolateRight: "clamp" })
    : 0;

  const line1Y = interpolate(frame, [0.2 * fps, 1 * fps], [60, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const line1Opacity = interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const line2Y = interpolate(frame, [0.6 * fps, 1.4 * fps], [60, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const line2Opacity = interpolate(frame, [0.6 * fps, 1.2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const emojiScale = interpolate(frame, [1.5 * fps, 2 * fps, 2.5 * fps], [0, 1.3, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: BRAND.gradient,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Animated background circles */}
      {[...Array(6)].map((_, i) => {
        const size = 200 + i * 120;
        const delay = i * 0.15;
        const circleOpacity = interpolate(
          frame,
          [delay * fps, (delay + 1) * fps],
          [0, 0.06],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: BRAND.white,
              opacity: circleOpacity,
              left: `${20 + i * 10}%`,
              top: `${10 + (i % 3) * 25}%`,
              transform: `scale(${zoom})`,
            }}
          />
        );
      })}

      <div
        style={{
          opacity,
          transform: `scale(${zoom}) translateX(${shakeX}px)`,
          textAlign: "center",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: BRAND.white,
            lineHeight: 1.05,
            fontFamily: "Inter, system-ui, sans-serif",
            transform: `translateY(${line1Y}px)`,
            opacity: line1Opacity,
            textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          STOP POSTING
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: BRAND.accentYellow,
            lineHeight: 1.05,
            fontFamily: "Inter, system-ui, sans-serif",
            transform: `translateY(${line2Y}px)`,
            opacity: line2Opacity,
            textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          BORING LINKEDIN
        </div>
        <div
          style={{
            fontSize: 56,
            marginTop: 20,
            transform: `scale(${emojiScale})`,
          }}
        >
          🤦‍♂️
        </div>
      </div>
    </AbsoluteFill>
  );
};
