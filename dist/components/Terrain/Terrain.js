import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader.js';
import { Fragment } from './fragment.js';
import { Vertex } from './vertex.js';
import noise from './noise.js';

function Terrain({
  worldWidth = 1024,
  levels = 4,
  tileResolution = 64,
  cameraRef
}) {
  const Edge = {
    NONE: 0,
    TOP: 1,
    LEFT: 2,
    BOTTOM: 4,
    RIGHT: 8
  };
  const noiseMap = noise();
  function TileMaterial({
    offset,
    scale,
    // tileResolution,
    edgeMorph
  }) {
    const rockMap = useLoader(TextureLoader, "textures/rock.jpeg");
    rockMap.wrapS = rockMap.wrapT = THREE.RepeatWrapping;
    const uniforms = {
      uEdgeMorph: { type: "i", value: edgeMorph },
      uGlobalOffset: { type: "v3", value: null },
      //uGrass: { type: "t", value: texture.grass },
      uHeightData: { type: "sampler2d", value: null },
      //uSnow: { type: "t", value: texture.snow },
      uTileOffset: { type: "v2", value: offset },
      uScale: { type: "f", value: scale }
    };
    return /* @__PURE__ */ React.createElement(
      "shaderMaterial",
      {
        extensions: {
          derivatives: true,
          fragDepth: false,
          drawBuffers: false,
          shaderTextureLOD: true
        },
        transparent: false,
        fragmentShader: Fragment,
        vertexShader: Vertex,
        uniforms
      }
    );
  }
  function Tile({
    x,
    y,
    scale,
    edgeMorph
  }) {
    const meshRef = useRef(null);
    useEffect(() => {
      if (meshRef.current) {
        var m = new THREE.Matrix4();
        m.makeTranslation(0.5, 0.5, 0);
        meshRef.current.geometry.applyMatrix4(m);
        meshRef.current.position.set(0, 0, 0);
        meshRef.current.rotation.set(0, 0, 0);
        meshRef.current.scale.set(1, 1, 1);
        meshRef.current.updateMatrix();
        const material = meshRef.current.material;
        material.uniforms.uGlobalOffset.value = cameraRef.current.position;
        material.uniforms.uHeightData.value = noiseMap;
        material.needsUpdate = true;
      }
    }, [meshRef]);
    return /* @__PURE__ */ React.createElement("mesh", { ref: meshRef }, /* @__PURE__ */ React.createElement(
      TileMaterial,
      {
        offset: new THREE.Vector2(x, y),
        scale,
        tileResolution,
        edgeMorph
      }
    ), /* @__PURE__ */ React.createElement("planeGeometry", { args: [1, 1, tileResolution, tileResolution] }));
  }
  var initialScale = worldWidth / Math.pow(2, levels);
  function getOuterTiles() {
    const result = [];
    for (var scale = initialScale; scale < worldWidth; scale *= 2) {
      result.push(
        /* @__PURE__ */ React.createElement("group", { key: scale }, /* @__PURE__ */ React.createElement(
          Tile,
          {
            x: -2 * scale,
            y: -2 * scale,
            scale,
            edgeMorph: Edge.BOTTOM | Edge.LEFT
          }
        ), /* @__PURE__ */ React.createElement(Tile, { x: -2 * scale, y: -scale, scale, edgeMorph: Edge.LEFT }), /* @__PURE__ */ React.createElement(Tile, { x: -2 * scale, y: 0, scale, edgeMorph: Edge.LEFT }), /* @__PURE__ */ React.createElement(
          Tile,
          {
            x: -2 * scale,
            y: scale,
            scale,
            edgeMorph: Edge.TOP | Edge.LEFT
          }
        ), /* @__PURE__ */ React.createElement(
          Tile,
          {
            x: -scale,
            y: -2 * scale,
            scale,
            edgeMorph: Edge.BOTTOM
          }
        ), /* @__PURE__ */ React.createElement(Tile, { x: -scale, y: scale, scale, edgeMorph: Edge.TOP }), /* @__PURE__ */ React.createElement(Tile, { x: 0, y: -2 * scale, scale, edgeMorph: Edge.BOTTOM }), /* @__PURE__ */ React.createElement(Tile, { x: 0, y: scale, scale, edgeMorph: Edge.TOP }), /* @__PURE__ */ React.createElement(
          Tile,
          {
            x: scale,
            y: -2 * scale,
            scale,
            edgeMorph: Edge.BOTTOM | Edge.RIGHT
          }
        ), /* @__PURE__ */ React.createElement(Tile, { x: scale, y: -scale, scale, edgeMorph: Edge.RIGHT }), /* @__PURE__ */ React.createElement(Tile, { x: scale, y: 0, scale, edgeMorph: Edge.RIGHT }), /* @__PURE__ */ React.createElement(
          Tile,
          {
            x: scale,
            y: scale,
            scale,
            edgeMorph: Edge.TOP | Edge.RIGHT
          }
        ))
      );
    }
    return /* @__PURE__ */ React.createElement(React.Fragment, null, result);
  }
  return /* @__PURE__ */ React.createElement("mesh", null, /* @__PURE__ */ React.createElement("fog", { attach: "fog", color: "hotpink", near: 200, far: 1e3 }), /* @__PURE__ */ React.createElement(
    Tile,
    {
      x: -initialScale,
      y: -initialScale,
      scale: initialScale,
      edgeMorph: Edge.NONE
    }
  ), /* @__PURE__ */ React.createElement(
    Tile,
    {
      x: -initialScale,
      y: 0,
      scale: initialScale,
      edgeMorph: Edge.NONE
    }
  ), /* @__PURE__ */ React.createElement(Tile, { x: 0, y: 0, scale: initialScale, edgeMorph: Edge.NONE }), /* @__PURE__ */ React.createElement(
    Tile,
    {
      x: 0,
      y: -initialScale,
      scale: initialScale,
      edgeMorph: Edge.NONE
    }
  ), getOuterTiles());
}

export { Terrain as default };
