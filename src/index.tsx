/**
 * @class R3FTerrain
 */

import { Canvas } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import TerrainScene from "./components/TerrainScene/TerrainScene";
import * as React from "react";

export type Props = { text: string };

export default class R3FTerrain extends React.Component<Props> {
  render() {
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
}
