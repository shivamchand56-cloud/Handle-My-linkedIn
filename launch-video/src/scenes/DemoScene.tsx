import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";

const steps = [
  { icon: "🎯", label: "Pick your domain", sub: "Product • Marketing • Finance" },
  { icon: "⚡", label: "Hit Generate", sub: "AI crafts your post in seconds" },
  { icon: "🪝", label: "5 killer hooks", sub: "Click to swap, A/B test instantly" },
  { icon: "📊", label: "Virality score: 9.6/10", sub: "Algorithm-optimized for maximum reach" },
  { icon: "📋", label: "Copy & post", sub: "One click to clipboard" },
];

export const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, 0.3 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#F8F6F0",
        opacity: bgOpacity,
        display: "flex",
        flexDirection: "column",
        padding: "50px 80px",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: interpolate(frame, [0, 0.5 * fps], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
          fontSize: 36,
          fontWeight: 900,
          color: BRAND.dark,
          fontFamily: "Inter, system-ui, sans-serif",
          marginBottom: 40,
        }}
      >
        Watch the magic ✨
      </div>

      {/* Steps */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          flex: 1,
          justifyContent: "center",
        }}
      >
        {steps.map((step, i) => {
          const stepDelay = 0.5 + i * 1.2;
          const stepOpacity = interpolate(
            frame,
            [stepDelay * fps, (stepDelay + 0.4) * fps],
            [0, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );
          const stepX = interpolate(
            frame,
            [stepDelay * fps, (stepDelay + 0.6) * fps],
            [i % 2 === 0 ? -60 : 60, 0],
            {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }
          );
          const iconScale = interpolate(
            frame,
            [stepDelay * fps, (stepDelay + 0.3) * fps, (stepDelay + 0.5) * fps],
            [0, 1.4, 1],
            { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                opacity: stepOpacity,
                transform: `translateX(${stepX}px)`,
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 18,
                  background: BRAND.primary,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 32,
                  transform: `scale(${iconScale})`,
                  flexShrink: 0,
                  boxShadow: `0 4px 16px rgba(0,119,181,0.3)`,
                }}
              >
                {step.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: BRAND.dark,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {step.label}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: BRAND.gray,
                    marginTop: 2,
                  }}
                >
                  {step.sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
