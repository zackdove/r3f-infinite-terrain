import { useFrame } from '@react-three/fiber';
import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Fragment } from './fragment';
import { Vertex } from './vertex';

function Atmosphere(props) {
  const ref = useRef(null);
  useFrame(() => ref.current.rotation.x += 0.01);
  const uniforms = useMemo(
    () => ({
      uHorizonColor: { type: "c", value: new THREE.Color(16773592) },
      //uSkyColor: { type: "c", value: new THREE.Color( 0xd1e3f1 ) }
      uSkyColor: { type: "c", value: new THREE.Color(16382463) }
    }),
    []
  );
  return /* @__PURE__ */ React.createElement("mesh", { ...props, ref }, /* @__PURE__ */ React.createElement("sphereGeometry", { args: [3e3, 64, 64] }), /* @__PURE__ */ React.createElement(
    "shaderMaterial",
    {
      side: THREE.DoubleSide,
      fragmentShader: Fragment,
      vertexShader: Vertex,
      uniforms
    }
  ));
}

export { Atmosphere as default };
