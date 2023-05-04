import { Canvas } from '@react-three/fiber';
import TerrainScene from './components/TerrainScene/TerrainScene';
import './App.css';
import { Stats } from '@react-three/drei';
import React from 'react';

function App() {
  const mouse = { x: 0, y: 0 };
  return /* @__PURE__ */ React.createElement(
    Canvas,
    {
      onPointerMove: (e) => {
        e.preventDefault();
        mouse.x = e.clientX - window.innerWidth / 2;
        mouse.y = Math.pow(window.innerHeight - e.clientY, 2) / window.innerHeight;
      }
    },
    /* @__PURE__ */ React.createElement(Stats, { showPanel: 0, className: "stats" }),
    /* @__PURE__ */ React.createElement(TerrainScene, { mouse })
  );
}

export { App as default };
