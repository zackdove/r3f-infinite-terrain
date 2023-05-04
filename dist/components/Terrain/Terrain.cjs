'use strict';

var React = require('react');
var THREE = require('three');
var fiber = require('@react-three/fiber');
var TextureLoader_js = require('three/src/loaders/TextureLoader.js');
var fragment_js = require('./fragment.js');
var vertex_js = require('./vertex.js');
var noise = require('./noise.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var React__default = /*#__PURE__*/_interopDefault(React);
var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);
var noise__default = /*#__PURE__*/_interopDefault(noise);

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
  const noiseMap = noise__default.default();
  function TileMaterial({
    offset,
    scale,
    // tileResolution,
    edgeMorph
  }) {
    const rockMap = fiber.useLoader(TextureLoader_js.TextureLoader, "textures/rock.jpeg");
    rockMap.wrapS = rockMap.wrapT = THREE__namespace.RepeatWrapping;
    const uniforms = {
      uEdgeMorph: { type: "i", value: edgeMorph },
      uGlobalOffset: { type: "v3", value: null },
      //uGrass: { type: "t", value: texture.grass },
      uHeightData: { type: "sampler2d", value: null },
      //uSnow: { type: "t", value: texture.snow },
      uTileOffset: { type: "v2", value: offset },
      uScale: { type: "f", value: scale }
    };
    return /* @__PURE__ */ React__default.default.createElement(
      "shaderMaterial",
      {
        extensions: {
          derivatives: true,
          fragDepth: false,
          drawBuffers: false,
          shaderTextureLOD: true
        },
        transparent: false,
        fragmentShader: fragment_js.Fragment,
        vertexShader: vertex_js.Vertex,
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
    const meshRef = React.useRef(null);
    React.useEffect(() => {
      if (meshRef.current) {
        var m = new THREE__namespace.Matrix4();
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
    return /* @__PURE__ */ React__default.default.createElement("mesh", { ref: meshRef }, /* @__PURE__ */ React__default.default.createElement(
      TileMaterial,
      {
        offset: new THREE__namespace.Vector2(x, y),
        scale,
        tileResolution,
        edgeMorph
      }
    ), /* @__PURE__ */ React__default.default.createElement("planeGeometry", { args: [1, 1, tileResolution, tileResolution] }));
  }
  var initialScale = worldWidth / Math.pow(2, levels);
  function getOuterTiles() {
    const result = [];
    for (var scale = initialScale; scale < worldWidth; scale *= 2) {
      result.push(
        /* @__PURE__ */ React__default.default.createElement("group", { key: scale }, /* @__PURE__ */ React__default.default.createElement(
          Tile,
          {
            x: -2 * scale,
            y: -2 * scale,
            scale,
            edgeMorph: Edge.BOTTOM | Edge.LEFT
          }
        ), /* @__PURE__ */ React__default.default.createElement(Tile, { x: -2 * scale, y: -scale, scale, edgeMorph: Edge.LEFT }), /* @__PURE__ */ React__default.default.createElement(Tile, { x: -2 * scale, y: 0, scale, edgeMorph: Edge.LEFT }), /* @__PURE__ */ React__default.default.createElement(
          Tile,
          {
            x: -2 * scale,
            y: scale,
            scale,
            edgeMorph: Edge.TOP | Edge.LEFT
          }
        ), /* @__PURE__ */ React__default.default.createElement(
          Tile,
          {
            x: -scale,
            y: -2 * scale,
            scale,
            edgeMorph: Edge.BOTTOM
          }
        ), /* @__PURE__ */ React__default.default.createElement(Tile, { x: -scale, y: scale, scale, edgeMorph: Edge.TOP }), /* @__PURE__ */ React__default.default.createElement(Tile, { x: 0, y: -2 * scale, scale, edgeMorph: Edge.BOTTOM }), /* @__PURE__ */ React__default.default.createElement(Tile, { x: 0, y: scale, scale, edgeMorph: Edge.TOP }), /* @__PURE__ */ React__default.default.createElement(
          Tile,
          {
            x: scale,
            y: -2 * scale,
            scale,
            edgeMorph: Edge.BOTTOM | Edge.RIGHT
          }
        ), /* @__PURE__ */ React__default.default.createElement(Tile, { x: scale, y: -scale, scale, edgeMorph: Edge.RIGHT }), /* @__PURE__ */ React__default.default.createElement(Tile, { x: scale, y: 0, scale, edgeMorph: Edge.RIGHT }), /* @__PURE__ */ React__default.default.createElement(
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
    return /* @__PURE__ */ React__default.default.createElement(React__default.default.Fragment, null, result);
  }
  return /* @__PURE__ */ React__default.default.createElement("mesh", null, /* @__PURE__ */ React__default.default.createElement("fog", { attach: "fog", color: "hotpink", near: 200, far: 1e3 }), /* @__PURE__ */ React__default.default.createElement(
    Tile,
    {
      x: -initialScale,
      y: -initialScale,
      scale: initialScale,
      edgeMorph: Edge.NONE
    }
  ), /* @__PURE__ */ React__default.default.createElement(
    Tile,
    {
      x: -initialScale,
      y: 0,
      scale: initialScale,
      edgeMorph: Edge.NONE
    }
  ), /* @__PURE__ */ React__default.default.createElement(Tile, { x: 0, y: 0, scale: initialScale, edgeMorph: Edge.NONE }), /* @__PURE__ */ React__default.default.createElement(
    Tile,
    {
      x: 0,
      y: -initialScale,
      scale: initialScale,
      edgeMorph: Edge.NONE
    }
  ), getOuterTiles());
}

module.exports = Terrain;
