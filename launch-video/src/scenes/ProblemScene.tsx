import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";

export const ProblemScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const phoneSlideUp = interpolate(frame, [0.3 * fps, 1.2 * fps], [400, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const phoneOpacity = interpolate(frame, [0.3 * fps, 0.8 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const textSlide = interpolate(frame, [0.5 * fps, 1.5 * fps], [80, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const textOpacity = interpolate(frame, [0.5 * fps, 1.2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const likes = [
    { emoji: "❤️", label: "Your Mom", x: 0, delay: 1.5 },
    { emoji: "👍", label: "Your Cousin", x: 1, delay: 2.0 },
    { emoji: "🤖", label: "Auto-follow Bot", x: 2, delay: 2.5 },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "#F8F6F0",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
        padding: "0 100px",
        opacity: fadeIn,
      }}
    >
      {/* Left: Phone mockup */}
      <div
        style={{
          opacity: phoneOpacity,
          transform: `translateY(${phoneSlideUp}px)`,
          width: 340,
          height: 580,
          background: BRAND.white,
          borderRadius: 32,
          border: `3px solid ${BRAND.dark}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 24,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.gray, marginBottom: 8 }}>
          ✍️ New Post
        </div>
        <div
          style={{
            flex: 1,
            background: BRAND.offWhite,
            borderRadius: 12,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 13, color: "#999", fontStyle: "italic" }}>
            "Today I went to a meeting... and also had lunch... it was fine..."
          </div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 8,
                width: `${60 + i * 10}%`,
                background: "#DDD",
                borderRadius: 4,
              }}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 16,
            padding: "10px 0",
            background: "#EEE",
            borderRadius: 8,
            textAlign: "center",
            fontSize: 14,
            fontWeight: 700,
            color: BRAND.gray,
          }}
        >
          Post 💀
        </div>
      </div>

      {/* Right: Sad stats */}
      <div
        style={{
          transform: `translateX(${textSlide}px)`,
          opacity: textOpacity,
          maxWidth: 500,
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: BRAND.dark,
            lineHeight: 1.15,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          Your posts get{" "}
          <span style={{ color: BRAND.red }}>3 likes</span>.
        </div>
        <div
          style={{
            fontSize: 22,
            color: BRAND.gray,
            marginTop: 16,
            lineHeight: 1.5,
          }}
        >
          Your mom. Your cousin. Your auto-follow bot.
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 30 }}>
          {likes.map(({ emoji, label, x, delay }) => {
            const likeScale = interpolate(
              frame,
              [delay * fps, (delay + 0.3) * fps, (delay + 0.5) * fps],
              [0, 1.3, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );
            const likeOpacity = interpolate(
              frame,
              [delay * fps, (delay + 0.2) * fps],
              [0, 1],
              { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
            );
            return (
              <div
                key={x}
                style={{
                  textAlign: "center",
                  opacity: likeOpacity,
                  transform: `scale(${likeScale})`,
                }}
              >
                <div style={{ fontSize: 36 }}>{emoji}</div>
                <div style={{ fontSize: 11, color: BRAND.gray, marginTop: 4 }}>
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
