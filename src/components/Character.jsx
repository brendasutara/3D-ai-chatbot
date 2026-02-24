import { useAnimations, useGLTF } from "@react-three/drei";
import { useCallback, useEffect, useMemo } from "react";
import useChatbot from "../hooks/useChatbot";
import { useFrame } from "@react-three/fiber";
import { VISEMES } from "wawa-lipsync";
import { lerp } from "three/src/math/MathUtils.js";

export const Character = ({ ...props }) => {
  const { scene, animations } = useGLTF("/models/Santa.glb");
  const { actions, mixer } = useAnimations(animations, scene);

  const lipsyncManager = useChatbot((state) => state.lipsyncManager);

  const avatarSkinnedMeshes = useMemo(() => {
    const skinnedMeshes = [];
    scene.traverse((child) => {
      if (child.isSkinnedMesh) {
        skinnedMeshes.push(child);
      }
    });
    return skinnedMeshes;
  }, [scene]);

  const lerpMorphTarget = useCallback(
    (target, value, speed = 0.1) => {
      avatarSkinnedMeshes.forEach((skinnedMesh) => {
        if (!skinnedMesh.morphTargetDictionary) {
          return;
        }
        const morphIndex = skinnedMesh.morphTargetDictionary[target];
        if (morphIndex !== undefined) {
          const currentValue = skinnedMesh.morphTargetInfluences[morphIndex];
          skinnedMesh.morphTargetInfluences[morphIndex] = lerp(
            currentValue,
            value,
            speed,
          );
        }
      });
    },
    [avatarSkinnedMeshes],
  );

  useEffect(() => {
    actions["Idle"].play();
  }, [actions]);

  useFrame(() => {
    lipsyncManager.processAudio();
    const currentViseme = lipsyncManager.viseme;
    Object.values(VISEMES).forEach((viseme) => {
      lerpMorphTarget(viseme, viseme === currentViseme ? 1 : 0, 0.2);
    });
  });

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload("/models/Santa.glb");
