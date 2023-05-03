import { useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three/src/loaders/TextureLoader";

export default function Sky(props: JSX.IntrinsicElements["mesh"]) {
  const ref = useRef<THREE.Mesh>(null!);
  //   useFrame(() => (ref.current.rotation.x += 0.01));
  const map = useLoader(TextureLoader, "textures/sky.png");
  map.wrapS = map.wrapT = THREE.MirroredRepeatWrapping;
  map.repeat.set(2, 2);
  return (
    <mesh {...props} ref={ref}>
      <planeGeometry args={[1600, 1600]} />
      <meshBasicMaterial map={map} side={THREE.DoubleSide} />
    </mesh>
  );
}
