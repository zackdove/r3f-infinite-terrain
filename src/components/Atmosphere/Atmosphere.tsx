import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { Fragment } from "./fragment";
import { Vertex } from "./vertex";
import React from "react";

export default function Atmosphere(props: JSX.IntrinsicElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => (ref.current.rotation.x += 0.01));
  const uniforms = useMemo(
    () => ({
      uHorizonColor: { type: "c", value: new THREE.Color(0xfff1d8) },
      //uSkyColor: { type: "c", value: new THREE.Color( 0xd1e3f1 ) }
      uSkyColor: { type: "c", value: new THREE.Color(0xf9f9ff) },
    }),
    []
  );
  return (
    <mesh {...props} ref={ref}>
      <sphereGeometry args={[3000, 64, 64]} />
      <shaderMaterial
        side={THREE.DoubleSide}
        fragmentShader={Fragment}
        vertexShader={Vertex}
        uniforms={uniforms}
      />
    </mesh>
  );
}
