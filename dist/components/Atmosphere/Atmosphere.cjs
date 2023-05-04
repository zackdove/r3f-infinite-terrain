'use strict';

var fiber = require('@react-three/fiber');
var React = require('react');
var THREE = require('three');
var fragment = require('./fragment');
var vertex = require('./vertex');

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

function Atmosphere(props) {
  const ref = React.useRef(null);
  fiber.useFrame(() => ref.current.rotation.x += 0.01);
  const uniforms = React.useMemo(
    () => ({
      uHorizonColor: { type: "c", value: new THREE__namespace.Color(16773592) },
      //uSkyColor: { type: "c", value: new THREE.Color( 0xd1e3f1 ) }
      uSkyColor: { type: "c", value: new THREE__namespace.Color(16382463) }
    }),
    []
  );
  return /* @__PURE__ */ React__default.default.createElement("mesh", { ...props, ref }, /* @__PURE__ */ React__default.default.createElement("sphereGeometry", { args: [3e3, 64, 64] }), /* @__PURE__ */ React__default.default.createElement(
    "shaderMaterial",
    {
      side: THREE__namespace.DoubleSide,
      fragmentShader: fragment.Fragment,
      vertexShader: vertex.Vertex,
      uniforms
    }
  ));
}

module.exports = Atmosphere;
