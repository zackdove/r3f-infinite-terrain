import { Canvas } from "@react-three/fiber";
import "./App.css";
import { TerrainScene } from "r3f-lod-terrain";

function App() {
  return (
    <div id="canvas-container">
      <Canvas>
        <TerrainScene />
      </Canvas>
    </div>
  );
}

export default App;
