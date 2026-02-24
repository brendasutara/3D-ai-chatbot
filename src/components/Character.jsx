import { useAnimations, useGLTF } from "@react-three/drei";
import { useCallback, useEffect, useMemo } from "react";
import useChatbot from "../hooks/useChatbot";
import { useFrame } from "@react-three/fiber";
import { VISEMES } from "wawa-lipsync";
import { lerp } from "three/src/math/MathUtils.js";

export const Character = ({ ...props }) => {
  const { scene, animations } = useGLTF("/models/Santa.glb");
  const { actions } = useAnimations(animations, scene);

  // Estado del store
  const lipsyncManager = useChatbot((state) => state.lipsyncManager);
  const isSpeaking = useChatbot((state) => state.isSpeaking);
  const mouthOpen = useChatbot((state) => state.mouthOpen);

  const avatarSkinnedMeshes = useMemo(() => {
    const skinnedMeshes = [];
    scene.traverse((child) => {
      if (child.isSkinnedMesh) skinnedMeshes.push(child);
    });
    return skinnedMeshes;
  }, [scene]);

  const lerpMorphTarget = useCallback(
    (target, value, speed = 0.1) => {
      avatarSkinnedMeshes.forEach((skinnedMesh) => {
        if (!skinnedMesh.morphTargetDictionary) return;

        const morphIndex = skinnedMesh.morphTargetDictionary[target];
        if (morphIndex === undefined) return;

        const currentValue = skinnedMesh.morphTargetInfluences[morphIndex] ?? 0;
        skinnedMesh.morphTargetInfluences[morphIndex] = lerp(
          currentValue,
          value,
          speed,
        );
      });
    },
    [avatarSkinnedMeshes],
  );

  useEffect(() => {
    actions["Idle"]?.reset().play();
  }, [actions]);

  const availableVisemes = useMemo(() => {
    const set = new Set();
    avatarSkinnedMeshes.forEach((skinnedMesh) => {
      if (!skinnedMesh.morphTargetDictionary) return;
      Object.values(VISEMES).forEach((viseme) => {
        if (skinnedMesh.morphTargetDictionary[viseme] !== undefined) {
          set.add(viseme);
        }
      });
    });
    return Array.from(set);
  }, [avatarSkinnedMeshes]);

  useFrame(() => {
    if (availableVisemes.length === 0) return;

    // 1) Si hay lipsync real (audio + manager), usamos eso
    if (lipsyncManager && typeof lipsyncManager.processAudio === "function") {
      lipsyncManager.processAudio();
      const currentViseme = lipsyncManager.viseme;

      availableVisemes.forEach((viseme) => {
        const target = viseme === currentViseme ? 1 : 0;
        lerpMorphTarget(viseme, target, 0.2);
      });

      return;
    }

    // 2) Si no hay lipsync real, hacemos fake-mouth con SpeechSynthesis
    if (isSpeaking) {
      const targets = new Map([
        ["viseme_aa", mouthOpen],
        ["viseme_O", mouthOpen * 0.25],
      ]);

      availableVisemes.forEach((viseme) => {
        const target = targets.get(viseme) ?? 0;
        const speed = target > 0 ? 0.35 : 0.2;
        lerpMorphTarget(viseme, target, speed);
      });

      return;
    }

    // 3) Si no esta hablando, aseguramos boca neutral
    availableVisemes.forEach((viseme) => {
      lerpMorphTarget(viseme, 0, 0.25);
    });
  });

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload("/models/Santa.glb");
