import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { linearTiming } from "@remotion/transitions";
import { useVideoConfig } from "remotion";
import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { RevealScene } from "./scenes/RevealScene";
import { DemoScene } from "./scenes/DemoScene";
import { EndorsementScene } from "./scenes/EndorsementScene";
import { CTAScene } from "./scenes/CTAScene";
import { VoiceoverLayer } from "./scenes/VoiceoverLayer";

export const LaunchVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {/* Scene 1: Hook — 0-3s */}
        <TransitionSeries.Sequence durationInFrames={3 * fps} name="Hook">
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
        />

        {/* Scene 2: Problem — 3-7s (4s) */}
        <TransitionSeries.Sequence durationInFrames={4 * fps} name="Problem">
          <ProblemScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: Math.round(0.4 * fps) })}
        />

        {/* Scene 3: Reveal — 7-11s (4s) */}
        <TransitionSeries.Sequence durationInFrames={4 * fps} name="Reveal">
          <RevealScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
        />

        {/* Scene 4: Demo — 11-19s (8s) */}
        <TransitionSeries.Sequence durationInFrames={8 * fps} name="Demo">
          <DemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
        />

        {/* Scene 5: Endorsement — 19-25s (6s) */}
        <TransitionSeries.Sequence durationInFrames={6 * fps} name="Endorsement">
          <EndorsementScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: Math.round(0.3 * fps) })}
        />

        {/* Scene 6: CTA — 25-30s (5s) */}
        <TransitionSeries.Sequence durationInFrames={5 * fps} name="CTA">
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* ElevenLabs Voiceover — embedded audio tracks synced to scenes */}
      <Audio src={staticFile("audio/hook.mp3")} from={0} volume={1} />
      <Audio src={staticFile("audio/problem.mp3")} from={3 * fps} volume={1} />
      <Audio src={staticFile("audio/reveal.mp3")} from={7 * fps} volume={1} />
      <Audio src={staticFile("audio/demo.mp3")} from={11 * fps} volume={1} />
      <Audio src={staticFile("audio/endorse.mp3")} from={19 * fps} volume={1} />
      <Audio src={staticFile("audio/cta.mp3")} from={25 * fps} volume={1} />

      {/* Web Speech API overlay — shows subtitles and TTS indicator */}
      <VoiceoverLayer />
    </AbsoluteFill>
  );
};
