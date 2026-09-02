import { useEffect, useRef, useState } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

interface VoiceoverLine {
  text: string;
  startFrame: number;
  endFrame: number;
}

const VOICEOVER_SCRIPT: VoiceoverLine[] = [
  {
    text: "Are you still posting boring LinkedIn content that NOBODY reads?",
    startFrame: 0,
    endFrame: 90,
  },
  {
    text: "Your posts get 3 likes. Your mom. Your cousin. Your auto-follow bot.",
    startFrame: 90,
    endFrame: 210,
  },
  {
    text: "Introducing Handle My LinkedIn, your AI-powered viral content engine.",
    startFrame: 210,
    endFrame: 330,
  },
  {
    text: "Pick your domain. Hit generate. Watch AI craft 5 killer hooks, a full post, carousel slides, and a virality score, in seconds.",
    startFrame: 330,
    endFrame: 570,
  },
  {
    text: "Main Bhanu Pratap Singh, and I say, this app should be declared ESSENTIAL SERVICE! 5 hooks! CAROUSEL! Even my speechwriter is jealous!",
    startFrame: 570,
    endFrame: 750,
  },
  {
    text: "Handle My LinkedIn. Your persona, our speed. Try it free today.",
    startFrame: 750,
    endFrame: 900,
  },
];

export const VoiceoverLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const spokenFramesRef = useRef<Set<number>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState<string>("");

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

    // Find which line should be playing at this frame
    const activeLine = VOICEOVER_SCRIPT.find(
      (line) => frame >= line.startFrame && frame < line.endFrame
    );

    if (activeLine) {
      // Create a key for this line's start frame to avoid re-speaking
      const lineKey = activeLine.startFrame;

      if (!spokenFramesRef.current.has(lineKey)) {
        // Cancel any ongoing speech
        synth.cancel();

        // Create new utterance
        const utterance = new SpeechSynthesisUtterance(activeLine.text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Pick a good English voice
        const voices = synth.getVoices();
        const preferred = voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Google") ||
              v.name.includes("Microsoft") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel"))
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
        activeUtteranceRef.current = utterance;
        synth.speak(utterance);
      }
    } else {
      // Between lines — cancel any lingering speech
      if (synth.speaking) {
        synth.cancel();
        setIsPlaying(false);
        setCurrentLine("");
      }
    }
  }, [frame]);

  // Format time display
  const seconds = (frame / fps).toFixed(1);
  const activeLine = VOICEOVER_SCRIPT.find(
    (l) => frame >= l.startFrame && frame < l.endFrame
  );
  const lineNum = activeLine
    ? VOICEOVER_SCRIPT.indexOf(activeLine) + 1
    : 0;

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
        {/* Mic icon */}
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
            transition: "background 0.2s",
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
            {lineNum > 0
              ? `Line ${lineNum}/6 • ${seconds}s`
              : `Preview • ${seconds}s`}
          </div>
        </div>

        {/* Audio bars animation */}
        {isPlaying && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              marginLeft: 8,
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => {
              const height =
                8 + Math.sin((frame * 0.3) + i * 1.2) * 6;
              return (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: Math.max(4, height),
                    borderRadius: 2,
                    background: "#4ADE80",
                    transition: "height 0.1s",
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Current line subtitle */}
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
