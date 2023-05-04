'use strict';

var fiber = require('@react-three/fiber');
var React = require('react');
var THREE = require('three');
var TextureLoader_js = require('three/src/loaders/TextureLoader.js');

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

function Sky(props) {
  const ref = React.useRef(null);
  const map = fiber.useLoader(TextureLoader_js.TextureLoader, "textures/skyGreen.jpeg");
  map.wrapS = map.wrapT = THREE__namespace.MirroredRepeatWrapping;
  map.repeat.set(2, 2);
  return /* @__PURE__ */ React__default.default.createElement("mesh", { ...props, ref }, /* @__PURE__ */ React__default.default.createElement("planeGeometry", { args: [2e3, 2e3] }), /* @__PURE__ */ React__default.default.createElement("meshBasicMaterial", { map, side: THREE__namespace.BackSide, fog: true }));
}

module.exports = Sky;
