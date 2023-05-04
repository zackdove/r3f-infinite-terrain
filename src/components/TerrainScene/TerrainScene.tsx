import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

import { PerspectiveCamera } from "@react-three/drei";
import Sky from "../Sky/Sky";
import Terrain from "../Terrain/Terrain";

function Box(props: JSX.IntrinsicElements["mesh"]) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<THREE.Mesh>(null!);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame(() => (ref.current.rotation.x += 0.01));

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function TerrainScene({
  mouse,
}: {
  mouse: { x: number; y: number };
}) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);
  const smoothMouse = { x: 0.5, y: 0.5 };
  const center = new THREE.Vector3(205, 135, 0);

  const smooth = 0.02;
  const look = new THREE.Vector3();
  const across = new THREE.Vector3();

  useFrame(({ clock }) => {
    smoothMouse.x += smooth * (mouse.x - smoothMouse.x);
    smoothMouse.y += smooth * (mouse.y - smoothMouse.y);

    cameraRef.current.position.x =
      450 * Math.cos(clock.elapsedTime / 6) + center.x;
    cameraRef.current.position.y =
      250 * Math.sin(clock.elapsedTime / 8) + center.y + 500;
    cameraRef.current.position.z = Math.min(smoothMouse.y / 2 + 5, 500);
    cameraRef.current.up.set(0, 0, 1);
    cameraRef.current.lookAt(center);
    //camera.position.z = 30 + 260 * Math.pow( Math.sin( time ), 4 );

    // Look left right
    look.copy(center);
    look.sub(cameraRef.current.position);
    look.normalize();
    look.multiplyScalar(50);
    across.crossVectors(look, cameraRef.current.up);
    across.multiplyScalar(smoothMouse.x / 333);
    cameraRef.current.position.add(across);
    cameraRef.current.up.add(across.multiplyScalar(-0.005));
    cameraRef.current.lookAt(center);
  });
  const scene = useThree((state) => state.scene);
  scene.fog = new THREE.Fog(0x000000, 200, 1000);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[250, 250, 80]}
        args={[70, 1, 1, 5000]}
        up={new THREE.Vector3(0, 0, 1)}
      />
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Sky position={[0, 0, 250]} />
      <Terrain
        worldWidth={1024}
        levels={4}
        tileResolution={64}
        cameraRef={cameraRef}
      />
      {/* <Atmosphere /> */}
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </>
  );
}
