import { Canvas } from "@react-three/fiber";
import TerrainScene from "./components/TerrainScene/TerrainScene";
// import Atmosphere from "./components/Atmosphere/Atmosphere";
import "./App.css";
import { Stats } from "@react-three/drei";
import React from "react";

export default function App() {
  const mouse = { x: 0, y: 0 };
  return (
    <Canvas
      onPointerMove={(e) => {
        e.preventDefault();
        mouse.x = e.clientX - window.innerWidth / 2;
        mouse.y =
          Math.pow(window.innerHeight - e.clientY, 2) / window.innerHeight;
      }}
    >
      <Stats showPanel={0} className="stats" />
      <TerrainScene mouse={mouse} />
    </Canvas>
  );
}
