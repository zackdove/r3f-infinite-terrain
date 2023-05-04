import { useFrame, useThree } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { PerspectiveCamera } from '@react-three/drei';
import Sky from '../Sky/Sky.js';
import Terrain from '../Terrain/Terrain.js';

function Box(props) {
  const ref = useRef(null);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  useFrame(() => ref.current.rotation.x += 0.01);
  return /* @__PURE__ */ React.createElement(
    "mesh",
    {
      ...props,
      ref,
      scale: clicked ? 1.5 : 1,
      onClick: () => click(!clicked),
      onPointerOver: () => hover(true),
      onPointerOut: () => hover(false)
    },
    /* @__PURE__ */ React.createElement("boxGeometry", { args: [1, 1, 1] }),
    /* @__PURE__ */ React.createElement("meshStandardMaterial", { color: hovered ? "hotpink" : "orange" })
  );
}
function TerrainScene({ mouse }) {
  const cameraRef = useRef(null);
  const smoothMouse = { x: 0.5, y: 0.5 };
  const center = new THREE.Vector3(205, 135, 0);
  const smooth = 0.02;
  const look = new THREE.Vector3();
  const across = new THREE.Vector3();
  useFrame(({ clock }) => {
    smoothMouse.x += smooth * (mouse.x - smoothMouse.x);
    smoothMouse.y += smooth * (mouse.y - smoothMouse.y);
    cameraRef.current.position.x = 450 * Math.cos(clock.elapsedTime / 6) + center.x;
    cameraRef.current.position.y = 250 * Math.sin(clock.elapsedTime / 8) + center.y + 500;
    cameraRef.current.position.z = Math.min(smoothMouse.y / 2 + 5, 500);
    cameraRef.current.up.set(0, 0, 1);
    cameraRef.current.lookAt(center);
    look.copy(center);
    look.sub(cameraRef.current.position);
    look.normalize();
    look.multiplyScalar(50);
    across.crossVectors(look, cameraRef.current.up);
    across.multiplyScalar(smoothMouse.x / 333);
    cameraRef.current.position.add(across);
    cameraRef.current.up.add(across.multiplyScalar(-5e-3));
    cameraRef.current.lookAt(center);
  });
  const scene = useThree((state) => state.scene);
  scene.fog = new THREE.Fog(0, 200, 1e3);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    PerspectiveCamera,
    {
      ref: cameraRef,
      makeDefault: true,
      position: [250, 250, 80],
      args: [70, 1, 1, 5e3],
      up: new THREE.Vector3(0, 0, 1)
    }
  ), /* @__PURE__ */ React.createElement("ambientLight", { intensity: 0.5 }), /* @__PURE__ */ React.createElement("spotLight", { position: [10, 10, 10], angle: 0.15, penumbra: 1 }), /* @__PURE__ */ React.createElement("pointLight", { position: [-10, -10, -10] }), /* @__PURE__ */ React.createElement(Sky, { position: [0, 0, 0] }), /* @__PURE__ */ React.createElement(
    Terrain,
    {
      worldWidth: 1024,
      levels: 4,
      tileResolution: 64,
      cameraRef
    }
  ), /* @__PURE__ */ React.createElement(Box, { position: [-1.2, 0, 0] }), /* @__PURE__ */ React.createElement(Box, { position: [1.2, 0, 0] }));
}

export { TerrainScene };
