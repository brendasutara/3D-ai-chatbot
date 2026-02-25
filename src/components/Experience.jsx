import { useGLTF } from "@react-three/drei";
import { CameraManager } from "./CameraManager";
import { Character } from "./Character";
import { degToRad } from "three/src/math/MathUtils.js";
import { useRef } from "react";
import { AppearanceMode, VFXEmitter, VFXParticles } from "wawa-vfx";

const SceneModel = ({ position }) => {
  const group = useRef();
  const { scene } = useGLTF("/models/stylized_hand_painted_scene.glb");

  return <primitive ref={group} object={scene} position={position} />;
};

export const Experience = () => {
  const characterTransform = {
    x: 0,
    y: -1.1,
    z: 0,
    scale: 8,
    rotationX: 0,
    rotationY: 10,
    rotationZ: 0,
  };
  const sceneTransform = {
    x: 48,
    y: -18.5,
    z: 48,
    scale: 1,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
  };

  return (
    <>
      <CameraManager />
      <Character
        rotation={[
          degToRad(characterTransform.rotationX),
          degToRad(characterTransform.rotationY),
          degToRad(characterTransform.rotationZ),
        ]}
        scale={characterTransform.scale}
        position={[
          characterTransform.x,
          characterTransform.y,
          characterTransform.z,
        ]}
      />

      <ambientLight intensity={0.7} color="#ffd6a1" />
      <directionalLight
        position={[-3, 3, 10]}
        intensity={2.2}
        color={"#ffe3b0"}
        castShadow
        shadow-bias={0.005}
        shadow-mapSize-width={128}
        shadow-mapSize-height={128}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-camera-top={25}
        shadow-camera-right={15}
        shadow-camera-bottom={-25}
        shadow-camera-left={-15}
      />
      <directionalLight
        position={[3, 3, 10]}
        intensity={1.0}
        color={"#ffb27d"}
      />
      <directionalLight
        position={[0, 0, -10]}
        intensity={7.5}
        color={"#ff8a4c"}
      />

      <mesh
        position-z={-5}
        position-y={0.05}
        receiveShadow
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[10, 10]} />
        <shadowMaterial color="#21282a" opacity={0.6} />
      </mesh>
      <group
        rotation={[
          degToRad(sceneTransform.rotationX),
          degToRad(sceneTransform.rotationY),
          degToRad(sceneTransform.rotationZ),
        ]}
        position={[sceneTransform.x, sceneTransform.y, sceneTransform.z]}
        scale={[
          sceneTransform.scale,
          sceneTransform.scale,
          sceneTransform.scale,
        ]}
      >
        <mesh
          position-z={-5}
          position-y={0.05}
          receiveShadow
          rotation-x={-Math.PI / 2}
        >
          <planeGeometry args={[10, 10]} />
          <shadowMaterial color="#21282a" opacity={0.6} />
        </mesh>
        <SceneModel position={[0, 0, 0]} />
      </group>
    </>
  );
};
