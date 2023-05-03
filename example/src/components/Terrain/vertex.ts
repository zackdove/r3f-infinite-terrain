export const Vertex = `uniform vec3 uGlobalOffset;
uniform sampler2D uHeightData;
uniform vec2 uTileOffset;
uniform float uScale;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vMorphFactor;
varying vec3 vUv; 

#define TILE_RESOLUTION 128.0

float getHeight(vec3 p) {
  // Assume a 1024x1024 world
  float lod = 0.0;//log2(uScale) - 6.0;
  vec2 st = p.xy / 1024.0;

  // Sample multiple times to get more detail out of map
  float h = 1024.0 * textureLod(uHeightData, st, lod).r;
  h += 64.0 * textureLod(uHeightData, 16.0 * st, lod).r;
  h += 4.0 * textureLod(uHeightData, 256.0 * st, lod).r;

  // Square the height, leads to more rocky looking terrain
  return h * h / 2000.0;
  //return h / 10.0;
}

void main() {
  vUv = position; 
  vPosition = uScale * position + vec3(uTileOffset, 0.0) + uGlobalOffset;
  vPosition = vPosition + normal * getHeight(vPosition);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}`;
