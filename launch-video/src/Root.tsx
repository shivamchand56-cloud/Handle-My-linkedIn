import "./index.css";
import { Composition } from "remotion";
import { LaunchVideo } from "./LaunchVideo";
import { HookScene } from "./scenes/HookScene";
import { ProblemScene } from "./scenes/ProblemScene";
import { RevealScene } from "./scenes/RevealScene";
import { DemoScene } from "./scenes/DemoScene";
import { EndorsementScene } from "./scenes/EndorsementScene";
import { CTAScene } from "./scenes/CTAScene";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Hook"
        component={HookScene}
        durationInFrames={3 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Problem"
        component={ProblemScene}
        durationInFrames={4 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Reveal"
        component={RevealScene}
        durationInFrames={4 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Demo"
        component={DemoScene}
        durationInFrames={8 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Endorsement"
        component={EndorsementScene}
        durationInFrames={6 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="CTA"
        component={CTAScene}
        durationInFrames={5 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="LaunchVideo"
        component={LaunchVideo}
        durationInFrames={30 * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
