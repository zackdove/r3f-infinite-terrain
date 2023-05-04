'use strict';

var fiber = require('@react-three/fiber');
var React = require('react');
var THREE = require('three');
var drei = require('@react-three/drei');
var Sky = require('../Sky/Sky.js');
var Terrain = require('../Terrain/Terrain.js');

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
var Sky__default = /*#__PURE__*/_interopDefault(Sky);
var Terrain__default = /*#__PURE__*/_interopDefault(Terrain);

function Box(props) {
  const ref = React.useRef(null);
  const [hovered, hover] = React.useState(false);
  const [clicked, click] = React.useState(false);
  fiber.useFrame(() => ref.current.rotation.x += 0.01);
  return /* @__PURE__ */ React__default.default.createElement(
    "mesh",
    {
      ...props,
      ref,
      scale: clicked ? 1.5 : 1,
      onClick: () => click(!clicked),
      onPointerOver: () => hover(true),
      onPointerOut: () => hover(false)
    },
    /* @__PURE__ */ React__default.default.createElement("boxGeometry", { args: [1, 1, 1] }),
    /* @__PURE__ */ React__default.default.createElement("meshStandardMaterial", { color: hovered ? "hotpink" : "orange" })
  );
}
function TerrainScene({ mouse }) {
  const cameraRef = React.useRef(null);
  const smoothMouse = { x: 0.5, y: 0.5 };
  const center = new THREE__namespace.Vector3(205, 135, 0);
  const smooth = 0.02;
  const look = new THREE__namespace.Vector3();
  const across = new THREE__namespace.Vector3();
  fiber.useFrame(({ clock }) => {
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
  const scene = fiber.useThree((state) => state.scene);
  scene.fog = new THREE__namespace.Fog(0, 200, 1e3);
  return /* @__PURE__ */ React__default.default.createElement(React__default.default.Fragment, null, /* @__PURE__ */ React__default.default.createElement(
    drei.PerspectiveCamera,
    {
      ref: cameraRef,
      makeDefault: true,
      position: [250, 250, 80],
      args: [70, 1, 1, 5e3],
      up: new THREE__namespace.Vector3(0, 0, 1)
    }
  ), /* @__PURE__ */ React__default.default.createElement("ambientLight", { intensity: 0.5 }), /* @__PURE__ */ React__default.default.createElement("spotLight", { position: [10, 10, 10], angle: 0.15, penumbra: 1 }), /* @__PURE__ */ React__default.default.createElement("pointLight", { position: [-10, -10, -10] }), /* @__PURE__ */ React__default.default.createElement(Sky__default.default, { position: [0, 0, 0] }), /* @__PURE__ */ React__default.default.createElement(
    Terrain__default.default,
    {
      worldWidth: 1024,
      levels: 4,
      tileResolution: 64,
      cameraRef
    }
  ), /* @__PURE__ */ React__default.default.createElement(Box, { position: [-1.2, 0, 0] }), /* @__PURE__ */ React__default.default.createElement(Box, { position: [1.2, 0, 0] }));
}

exports.TerrainScene = TerrainScene;
