import { AbsoluteFill, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries } from "@remotion/transitions";
import { linearTiming } from "@remotion/transitions";
import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { RevealScene } from "./scenes/RevealScene";
import { DemoScene } from "./scenes/DemoScene";
import { EndorsementScene } from "./scenes/EndorsementScene";
import { CTAScene } from "./scenes/CTAScene";
import { VoiceoverLayer } from "./scenes/VoiceoverLayer";

/*
 * Audio durations (actual MP3 lengths):
 *   hook:     4.08s   problem: 6.06s   reveal: 5.91s
 *   demo:     9.51s   endorse: 11.50s  cta:    5.51s
 *
 * playbackRate adjusts each clip to fit its scene slot:
 *   hook  ×0.85 → 4.80s   problem ×0.85 → 7.13s   reveal ×0.85 → 6.95s
 *   demo  ×1.30 → 7.32s   endorse ×1.70 → 6.76s   cta    ×0.85 → 6.48s
 *
 * Scene durations (frames) account for TransitionSeries overlaps.
 * Total ≈ 29.4s after transition compression.
 */

const HOOK_DUR = Math.round(5.0 * 30);     // 150f
const PROBLEM_DUR = Math.round(7.5 * 30);   // 225f
const REVEAL_DUR = Math.round(7.0 * 30);    // 210f
const DEMO_DUR = Math.round(7.5 * 30);      // 225f
const ENDORSE_DUR = Math.round(7.0 * 30);   // 210f
const CTA_DUR = Math.round(6.5 * 30);       // 195f

const TRANSITION_DUR = Math.round(0.3 * 30); // 9f

// Audio start frames (cumulative minus transition overlaps)
const HOOK_START = 0;
const PROBLEM_START = HOOK_DUR - TRANSITION_DUR;              // 141
const REVEAL_START = PROBLEM_START + PROBLEM_DUR - TRANSITION_DUR; // 357
const DEMO_START = REVEAL_START + REVEAL_DUR - TRANSITION_DUR;     // 558
const ENDORSE_START = DEMO_START + DEMO_DUR - TRANSITION_DUR;      // 774
const CTA_START = ENDORSE_START + ENDORSE_DUR - TRANSITION_DUR;    // 975

export const LaunchVideo: React.FC = () => {

  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={HOOK_DUR} name="Hook">
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={PROBLEM_DUR} name="Problem">
          <ProblemScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={REVEAL_DUR} name="Reveal">
          <RevealScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={DEMO_DUR} name="Demo">
          <DemoScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={ENDORSE_DUR} name="Endorsement">
          <EndorsementScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={undefined}
          timing={linearTiming({ durationInFrames: TRANSITION_DUR })}
        />

        <TransitionSeries.Sequence durationInFrames={CTA_DUR} name="CTA">
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* ElevenLabs Voiceover — playbackRate syncs audio to scene duration */}
      <Audio src={staticFile("audio/hook.mp3")} from={HOOK_START} playbackRate={0.85} volume={1} />
      <Audio src={staticFile("audio/problem.mp3")} from={PROBLEM_START} playbackRate={0.85} volume={1} />
      <Audio src={staticFile("audio/reveal.mp3")} from={REVEAL_START} playbackRate={0.85} volume={1} />
      <Audio src={staticFile("audio/demo.mp3")} from={DEMO_START} playbackRate={1.30} volume={1} />
      <Audio src={staticFile("audio/endorse.mp3")} from={ENDORSE_START} playbackRate={1.70} volume={1} />
      <Audio src={staticFile("audio/cta.mp3")} from={CTA_START} playbackRate={0.85} volume={1} />

      {/* Web Speech API subtitles */}
      <VoiceoverLayer />
    </AbsoluteFill>
  );
};
