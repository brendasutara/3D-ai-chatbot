import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
  return (
    <>
      <UI />
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
