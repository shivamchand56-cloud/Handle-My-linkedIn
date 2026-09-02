import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND } from "../theme";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = interpolate(frame, [0, 0.8 * fps], [0.5, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const logoOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const taglineY = interpolate(frame, [0.5 * fps, 1.3 * fps], [30, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const taglineOpacity = interpolate(frame, [0.5 * fps, 1.1 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const ctaScale = interpolate(
    frame,
    [1.5 * fps, 2 * fps, 2.3 * fps],
    [0, 1.1, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }
  );
  const ctaOpacity = interpolate(frame, [1.5 * fps, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const pulse = frame > 2.5 * fps
    ? 1 + Math.sin((frame - 2.5 * fps) * 0.15) * 0.03
    : 1;

  const particleCount = 16;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 350 + Math.sin(i * 2.3) * 50;
    const delay = 0.3 + i * 0.06;
    const pOpacity = interpolate(
      frame,
      [delay * fps, (delay + 0.5) * fps, (delay + 3) * fps],
      [0, 0.7, 0.3],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    const pScale = interpolate(
      frame,
      [delay * fps, (delay + 0.5) * fps],
      [0, 1],
      { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );
    return { angle, radius, opacity: pOpacity, scale: pScale };
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
      {/* Background particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `calc(50% + ${Math.cos(p.angle) * p.radius}px)`,
            top: `calc(50% + ${Math.sin(p.angle) * p.radius}px)`,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: i % 3 === 0 ? BRAND.accentYellow : "rgba(255,255,255,0.4)",
            opacity: p.opacity,
            transform: `scale(${p.scale})`,
          }}
        />
      ))}

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              background: BRAND.white,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: BRAND.primary,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              in
            </span>
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: BRAND.white,
              fontFamily: "Inter, system-ui, sans-serif",
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            Handle My LinkedIn
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.9)",
            marginTop: 20,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 600,
            transform: `translateY(${taglineY}px)`,
            opacity: taglineOpacity,
            letterSpacing: 1,
          }}
        >
          Your Persona, Our Speed — A Viral LinkedIn Post.
        </div>

        {/* CTA Button */}
        <div
          style={{
            marginTop: 40,
            opacity: ctaOpacity,
            transform: `scale(${ctaScale * pulse})`,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "18px 60px",
              background: BRAND.accentYellow,
              borderRadius: 60,
              fontSize: 26,
              fontWeight: 900,
              color: BRAND.dark,
              fontFamily: "Inter, system-ui, sans-serif",
              boxShadow: "0 6px 30px rgba(255,193,7,0.4)",
              letterSpacing: 0.5,
            }}
          >
            Try It FREE Today →
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            color: "rgba(255,255,255,0.7)",
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: interpolate(frame, [2.5 * fps, 3 * fps], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          handemylinkedin.com
        </div>
      </div>
    </AbsoluteFill>
  );
};
