import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";

export const EndorsementScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgGradient = "linear-gradient(135deg, #FF6B35 0%, #FFC107 50%, #FF6B35 100%)";

  const charSlide = interpolate(frame, [0, 0.8 * fps], [-500, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const charOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const textPop = interpolate(
    frame,
    [1 * fps, 1.5 * fps, 1.8 * fps],
    [0, 1.15, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );
  const textOpacity = interpolate(frame, [1 * fps, 1.4 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const quoteScale = interpolate(
    frame,
    [2 * fps, 2.4 * fps, 2.7 * fps],
    [0.8, 1.05, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );
  const quoteOpacity = interpolate(frame, [2 * fps, 2.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const reactionEmojis = ["😱", "🤯", "🔥", "💪", "🏆"];
  const emojiPositions = reactionEmojis.map((_, i) => ({
    x: 150 + i * 300,
    delay: 3 + i * 0.25,
  }));

  const confettiCount = 20;
  const confetti = Array.from({ length: confettiCount }, (_, i) => {
    const startDelay = 0.5 + Math.random() * 2;
    const y = interpolate(
      frame,
      [startDelay * fps, (startDelay + 3) * fps],
      [-50, 1200],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    const opacity = interpolate(
      frame,
      [startDelay * fps, (startDelay + 0.3) * fps, (startDelay + 2.5) * fps, (startDelay + 3) * fps],
      [0, 1, 1, 0],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    const rotation = interpolate(
      frame,
      [startDelay * fps, (startDelay + 3) * fps],
      [0, 360 + Math.random() * 720],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    return {
      x: Math.random() * 1920,
      y,
      opacity,
      rotation,
      color: [BRAND.accentYellow, BRAND.red, BRAND.white, BRAND.primary][i % 4],
      size: 8 + Math.random() * 12,
    };
  });

  return (
    <AbsoluteFill
      style={{
        background: bgGradient,
        overflow: "hidden",
      }}
    >
      {/* Confetti */}
      {confetti.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: c.y,
            width: c.size,
            height: c.size * 0.6,
            background: c.color,
            borderRadius: 2,
            opacity: c.opacity,
            transform: `rotate(${c.rotation}deg)`,
          }}
        />
      ))}

      <div
        style={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
          padding: "0 100px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Character avatar */}
        <div
          style={{
            opacity: charOpacity,
            transform: `translateX(${charSlide}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: "white",
              border: `6px solid ${BRAND.dark}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 120,
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              overflow: "hidden",
            }}
          >
            🧑‍💼
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 20,
              fontWeight: 800,
              color: "white",
              fontFamily: "Inter, system-ui, sans-serif",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              maxWidth: 300,
            }}
          >
            Mukhya Mantri{"\n"}Bhanu Pratap Singh
          </div>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.85)",
              marginTop: 4,
            }}
          >
            (Fictional Character)
          </div>
        </div>

        {/* Quote */}
        <div
          style={{
            maxWidth: 700,
            opacity: textOpacity,
            transform: `translateX(${-charSlide}px)`,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: "white",
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.3,
              textShadow: "0 4px 20px rgba(0,0,0,0.2)",
              transform: `scale(${textPop})`,
            }}
          >
            "This app should be declared{"\n"}
            <span style={{ color: BRAND.dark, fontSize: 48 }}>ESSENTIAL SERVICE!</span>
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 24,
              color: "white",
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.5,
              fontWeight: 600,
              transform: `scale(${quoteScale})`,
              opacity: quoteOpacity,
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            5 hooks! CAROUSEL! Even my speechwriter is jealous! 😤
          </div>
        </div>
      </div>

      {/* Reaction emojis floating up */}
      {emojiPositions.map((pos, i) => {
        const emojiOpacity = interpolate(
          frame,
          [pos.delay * fps, (pos.delay + 0.3) * fps, (pos.delay + 1.5) * fps],
          [0, 1, 0],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );
        const emojiY = interpolate(
          frame,
          [pos.delay * fps, (pos.delay + 2) * fps],
          [0, -100],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.x,
              bottom: 80,
              fontSize: 40,
              opacity: emojiOpacity,
              transform: `translateY(${emojiY}px)`,
            }}
          >
            {reactionEmojis[i]}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
