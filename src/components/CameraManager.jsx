import { CameraControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { degToRad } from "three/src/math/MathUtils.js";

export const CameraManager = () => {
  const controlsRef = useRef(null);

  const POSITION = { x: 30, y: 30, z: 85 };
  const TARGET = { x: 15, y: 20, z: 40 };

  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.setLookAt(
      POSITION.x,
      POSITION.y,
      POSITION.z,
      TARGET.x,
      TARGET.y,
      TARGET.z,
      false,
    );
  }, []);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      maxAzimuthAngle={degToRad(30)}
      minAzimuthAngle={degToRad(-30)}
      minPolarAngle={degToRad(10)}
      maxPolarAngle={degToRad(90)}
      maxDistance={85}
      minDistance={5}
    />
  );
};
