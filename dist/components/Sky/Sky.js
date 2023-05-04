import { useLoader } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';

function Sky(props) {
  const ref = useRef(null);
  const map = useLoader(TextureLoader, "textures/skyGreen.jpeg");
  map.wrapS = map.wrapT = THREE.MirroredRepeatWrapping;
  map.repeat.set(2, 2);
  return /* @__PURE__ */ React.createElement("mesh", { ...props, ref }, /* @__PURE__ */ React.createElement("planeGeometry", { args: [2e3, 2e3] }), /* @__PURE__ */ React.createElement("meshBasicMaterial", { map, side: THREE.BackSide, fog: true }));
}

export { Sky as default };
