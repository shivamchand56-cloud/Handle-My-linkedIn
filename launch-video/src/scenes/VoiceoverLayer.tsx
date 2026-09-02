import { useEffect, useRef, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface VoiceoverLine {
  text: string;
  startFrame: number;
  endFrame: number;
}

// Timing matches LaunchVideo.tsx scene boundaries
const VOICEOVER_SCRIPT: VoiceoverLine[] = [
  {
    text: "Stop posting boring LinkedIn content.",
    startFrame: 0,
    endFrame: 150, // hook scene
  },
  {
    text: "Your posts get 3 likes. Your mom. Your cousin. Your bot.",
    startFrame: 141,
    endFrame: 366, // problem scene
  },
  {
    text: "Handle My LinkedIn. Your AI viral content engine.",
    startFrame: 357,
    endFrame: 567, // reveal scene
  },
  {
    text: "Pick your domain. Hit generate. Get 5 hooks, a full post, and a virality score in seconds.",
    startFrame: 558,
    endFrame: 783, // demo scene
  },
  {
    text: "This app should be declared ESSENTIAL SERVICE!",
    startFrame: 774,
    endFrame: 984, // endorse scene
  },
  {
    text: "Handle My LinkedIn. Try it free today.",
    startFrame: 975,
    endFrame: 1170, // cta scene
  },
];

export const VoiceoverLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const spokenFramesRef = useRef<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    synthRef.current = window.speechSynthesis;
    return () => {
      synthRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return;

    const activeLine = VOICEOVER_SCRIPT.find(
      (line) => frame >= line.startFrame && frame < line.endFrame
    );

    if (activeLine) {
      const lineKey = activeLine.startFrame;

      if (!spokenFramesRef.current.has(lineKey)) {
        synth.cancel();
        const utterance = new SpeechSynthesisUtterance(activeLine.text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = synth.getVoices();
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Google") ||
              v.name.includes("Microsoft") ||
              v.name.includes("Samantha"))
        );
        if (preferred) utterance.voice = preferred;

        utterance.onstart = () => {
          setIsPlaying(true);
          setCurrentLine(activeLine.text);
        };
        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentLine("");
        };
        utterance.onerror = () => {
          setIsPlaying(false);
          setCurrentLine("");
        };

        spokenFramesRef.current.add(lineKey);
        synth.speak(utterance);
      }
    } else {
      if (synth.speaking) {
        synth.cancel();
        setIsPlaying(false);
        setCurrentLine("");
      }
    }
  }, [frame]);

  const seconds = (frame / fps).toFixed(1);
  const activeLine = VOICEOVER_SCRIPT.find(
    (l) => frame >= l.startFrame && frame < l.endFrame
  );
  const lineNum = activeLine ? VOICEOVER_SCRIPT.indexOf(activeLine) + 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      {/* TTS Status Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
          borderRadius: 12,
          padding: "8px 16px",
          border: isPlaying
            ? "1px solid rgba(5,118,66,0.6)"
            : "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: isPlaying ? "#057642" : "#444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          {isPlaying ? "🎤" : "🔇"}
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: isPlaying ? "#4ADE80" : "#888",
              fontFamily: "Inter, system-ui, sans-serif",
              letterSpacing: 0.5,
            }}
          >
            {isPlaying ? "TTS VOICEOVER ACTIVE" : "WEB SPEECH API"}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#999",
              fontFamily: "Inter, system-ui, sans-serif",
              marginTop: 1,
            }}
          >
            {lineNum > 0 ? `Line ${lineNum}/6 • ${seconds}s` : `Preview • ${seconds}s`}
          </div>
        </div>
        {isPlaying && (
          <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 8 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 3,
                  height: Math.max(4, 8 + Math.sin(frame * 0.3 + i * 1.2) * 6),
                  borderRadius: 2,
                  background: "#4ADE80",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Subtitle */}
      {currentLine && (
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: 800,
            textAlign: "center",
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(10px)",
            borderRadius: 8,
            padding: "8px 20px",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: "white",
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 500,
              lineHeight: 1.4,
            }}
          >
            {currentLine}
          </div>
        </div>
      )}
    </div>
  );
};
