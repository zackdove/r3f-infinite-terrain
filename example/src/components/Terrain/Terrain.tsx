import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Fragment } from "./fragment";
import { Vertex } from "./vertex";
import noise from "./noise";

export default function Terrain({
  worldWidth = 1024,
  levels = 4,
  tileResolution = 64,
  offset,
}: {
  worldWidth: number;
  levels: number;
  tileResolution: number;
  offset: THREE.Vector3;
}) {
  const Edge = {
    NONE: 0,
    TOP: 1,
    LEFT: 2,
    BOTTOM: 4,
    RIGHT: 8,
  };

  const noiseMap = noise();
  console.log(noiseMap);
  function TileMaterial({
    globalOffset,
    offset,
    scale,
    // tileResolution,
    edgeMorph,
  }: {
    globalOffset: THREE.Vector3;
    offset: THREE.Vector2;
    scale: number;
    tileResolution: number;
    edgeMorph: number;
  }) {
    const rockMap = useLoader(TextureLoader, "textures/rock.jpeg");
    rockMap.wrapS = rockMap.wrapT = THREE.RepeatWrapping;
    const uniforms = {
      uEdgeMorph: { type: "i", value: edgeMorph },
      uGlobalOffset: { type: "v3", value: globalOffset },
      //uGrass: { type: "t", value: texture.grass },
      uHeightData: { type: "sampler2d", value: null },
      //uSnow: { type: "t", value: texture.snow },
      uTileOffset: { type: "v2", value: offset },
      uScale: { type: "f", value: scale },
    };
    return (
      <shaderMaterial
        extensions={{
          derivatives: true,
          fragDepth: false,
          drawBuffers: false,
          shaderTextureLOD: false,
        }}
        transparent={true}
        fragmentShader={Fragment}
        vertexShader={Vertex}
        uniforms={uniforms}
      />
    );
  }

  function Tile({
    x,
    y,
    scale,
    edgeMorph,
  }: {
    x: number;
    y: number;
    scale: number;
    edgeMorph: number;
  }) {
    const meshRef = useRef<THREE.Mesh>(null!);
    useEffect(() => {
      if (meshRef.current) {
        var m = new THREE.Matrix4();
        m.makeTranslation(0.5, 0.5, 0);
        meshRef.current.geometry.applyMatrix4(m);
        meshRef.current.position.set(0, 0, 0);
        meshRef.current.rotation.set(0, 0, 0);
        meshRef.current.scale.set(1, 1, 1);
        meshRef.current.updateMatrix();
        console.log(meshRef.current);
        const material = meshRef.current.material as THREE.ShaderMaterial;
        material.uniforms.uHeightData.value = noiseMap;
        material.needsUpdate = true;
      }
    }, [meshRef]);
    return (
      <mesh ref={meshRef}>
        <TileMaterial
          globalOffset={offset}
          offset={new THREE.Vector2(x, y)}
          scale={scale}
          tileResolution={tileResolution}
          edgeMorph={edgeMorph}
        />
        <planeGeometry args={[1, 1, tileResolution, tileResolution]} />
      </mesh>
    );
  }

  var initialScale = worldWidth / Math.pow(2, levels);

  function getOuterTiles() {
    const result = [];
    for (var scale = initialScale; scale < worldWidth; scale *= 2) {
      result.push(
        <group key={scale}>
          <Tile
            x={-2 * scale}
            y={-2 * scale}
            scale={scale}
            edgeMorph={Edge.BOTTOM | Edge.LEFT}
          />
          <Tile x={-2 * scale} y={-scale} scale={scale} edgeMorph={Edge.LEFT} />
          <Tile x={-2 * scale} y={0} scale={scale} edgeMorph={Edge.LEFT} />
          <Tile
            x={-2 * scale}
            y={scale}
            scale={scale}
            edgeMorph={Edge.TOP | Edge.LEFT}
          />

          <Tile
            x={-scale}
            y={-2 * scale}
            scale={scale}
            edgeMorph={Edge.BOTTOM}
          />
          <Tile x={-scale} y={scale} scale={scale} edgeMorph={Edge.TOP} />

          <Tile x={0} y={-2 * scale} scale={scale} edgeMorph={Edge.BOTTOM} />
          <Tile x={0} y={scale} scale={scale} edgeMorph={Edge.TOP} />

          <Tile
            x={scale}
            y={-2 * scale}
            scale={scale}
            edgeMorph={Edge.BOTTOM | Edge.RIGHT}
          />
          <Tile x={scale} y={-scale} scale={scale} edgeMorph={Edge.RIGHT} />
          <Tile x={scale} y={0} scale={scale} edgeMorph={Edge.RIGHT} />
          <Tile
            x={scale}
            y={scale}
            scale={scale}
            edgeMorph={Edge.TOP | Edge.RIGHT}
          />
        </group>
      );
    }
    return <>{result}</>;
  }

  return (
    <mesh>
      <Tile
        x={-initialScale}
        y={-initialScale}
        scale={initialScale}
        edgeMorph={Edge.NONE}
      />
      <Tile
        x={-initialScale}
        y={0}
        scale={initialScale}
        edgeMorph={Edge.NONE}
      />
      <Tile x={0} y={0} scale={initialScale} edgeMorph={Edge.NONE} />
      <Tile
        x={0}
        y={-initialScale}
        scale={initialScale}
        edgeMorph={Edge.NONE}
      />
      {getOuterTiles()}
    </mesh>
  );
}
