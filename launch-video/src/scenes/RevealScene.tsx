import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";

export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flashOpacity = interpolate(frame, [0, 0.3 * fps, 0.8 * fps], [1, 0.8, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const logoScale = interpolate(frame, [0.2 * fps, 1 * fps], [0.3, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoOpacity = interpolate(frame, [0.2 * fps, 0.7 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const taglineY = interpolate(frame, [1 * fps, 1.8 * fps], [40, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const taglineOpacity = interpolate(frame, [1 * fps, 1.6 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const sparkleCount = 12;
  const sparkles = Array.from({ length: sparkleCount }, (_, i) => {
    const angle = (i / sparkleCount) * Math.PI * 2;
    const radius = 280 + Math.sin(i * 1.5) * 60;
    const delay = 0.8 + i * 0.05;
    const sparkleOpacity = interpolate(
      frame,
      [delay * fps, (delay + 0.3) * fps, (delay + 1) * fps],
      [0, 1, 0.6],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    const sparkleScale = interpolate(
      frame,
      [delay * fps, (delay + 0.4) * fps],
      [0, 1],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
    );
    return { angle, radius, opacity: sparkleOpacity, scale: sparkleScale };
  });

  return (
    <AbsoluteFill
      style={{
        background: BRAND.gradient,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* White flash */}
      <AbsoluteFill
        style={{
          background: "white",
          opacity: flashOpacity,
        }}
      />

      {/* Sparkle particles */}
      {sparkles.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${Math.cos(s.angle) * s.radius}px)`,
            top: `calc(50% + ${Math.sin(s.angle) * s.radius}px)`,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: i % 2 === 0 ? BRAND.accentYellow : BRAND.white,
            opacity: s.opacity,
            transform: `scale(${s.scale})`,
            boxShadow: `0 0 10px ${i % 2 === 0 ? BRAND.accentYellow : BRAND.white}`,
          }}
        />
      ))}

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Logo mark */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background: BRAND.white,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: BRAND.primary,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              in
            </span>
          </div>
        </div>

        {/* App name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: BRAND.white,
            marginTop: 24,
            fontFamily: "Inter, system-ui, sans-serif",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          Handle My LinkedIn
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.9)",
            marginTop: 12,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 500,
            transform: `translateY(${taglineY}px)`,
            opacity: taglineOpacity,
          }}
        >
          Your AI-Powered Viral Content Engine ⚡
        </div>
      </div>
    </AbsoluteFill>
  );
};
