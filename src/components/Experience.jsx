import { Environment, OrbitControls } from "@react-three/drei";
import { Character } from "./Character";

export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Character />
      <Environment preset="sunset" />
    </>
  );
};
