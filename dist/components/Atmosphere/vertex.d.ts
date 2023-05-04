declare const Vertex = "varying float vDistance;\n\nvoid main() {\n  vDistance = distance( cameraPosition, position );\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}";

export { Vertex };
