import { Canvas } from "@react-three/fiber";
import TerrainScene from "./components/TerrainScene/TerrainScene";
// import Atmosphere from "./components/Atmosphere/Atmosphere";

export default function App() {
  const mouse = { x: 0, y: 0 };
  return (
    <Canvas
      onPointerMove={(e) => {
        mouse.x = e.clientX - window.innerWidth / 2;
        mouse.y =
          Math.pow(window.innerHeight - e.clientY, 2) / window.innerHeight;
      }}
    >
      <TerrainScene mouse={mouse} />
    </Canvas>
  );
}
