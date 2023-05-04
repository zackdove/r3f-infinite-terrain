'use strict';

var fiber = require('@react-three/fiber');
var TerrainScene = require('./components/TerrainScene/TerrainScene');
require('./App.css');
var drei = require('@react-three/drei');
var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var TerrainScene__default = /*#__PURE__*/_interopDefault(TerrainScene);
var React__default = /*#__PURE__*/_interopDefault(React);

function App() {
  const mouse = { x: 0, y: 0 };
  return /* @__PURE__ */ React__default.default.createElement(
    fiber.Canvas,
    {
      onPointerMove: (e) => {
        e.preventDefault();
        mouse.x = e.clientX - window.innerWidth / 2;
        mouse.y = Math.pow(window.innerHeight - e.clientY, 2) / window.innerHeight;
      }
    },
    /* @__PURE__ */ React__default.default.createElement(drei.Stats, { showPanel: 0, className: "stats" }),
    /* @__PURE__ */ React__default.default.createElement(TerrainScene__default.default, { mouse })
  );
}

module.exports = App;
