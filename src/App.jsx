import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";
import { UI } from "./components/UI";

function App() {
  const backgroundMusicRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);

  useEffect(() => {
    const music = new Audio(
      encodeURI("/audios/Exploring The Crystal Caves - Asher Fulero.mp3"),
    );
    music.loop = true;
    music.volume = 0.2;
    music.preload = "auto";
    backgroundMusicRef.current = music;

    return () => {
      music.pause();
      music.src = "";
      backgroundMusicRef.current = null;
    };
  }, []);

  useEffect(() => {
    const unlockAudio = () => setHasInteracted(true);

    window.addEventListener("click", unlockAudio, { once: true });
    window.addEventListener("touchstart", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const music = backgroundMusicRef.current;
    if (!music) return;

    if (isMusicEnabled && hasInteracted) {
      void music.play().catch(() => {
        setIsMusicEnabled(false);
      });
      return;
    }

    music.pause();
  }, [hasInteracted, isMusicEnabled]);

  const handleMusicToggle = () => {
    setHasInteracted(true);
    setIsMusicEnabled((current) => !current);
  };

  return (
    <>
      <UI />
      <button
        type="button"
        onClick={handleMusicToggle}
        aria-label={isMusicEnabled ? "Disable background music" : "Enable background music"}
        className="pointer-events-auto fixed left-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-black/35 text-xl text-white backdrop-blur-md transition hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/70 sm:left-6 sm:top-6"
      >
        {isMusicEnabled ? "♫" : "♪"}
      </button>
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
        <color attach="background" args={["#333"]} />
        <Suspense>
          <Experience />
        </Suspense>
        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.9} mipmapBlur />
          <DepthOfField
            blur={2}
            bokehScale={5}
            target={[0, 1.8, 0]}
            focalLength={5}
            height={512}
          />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
