export const Fragment = `
uniform float uScale;
uniform sampler2D uHeightData;

varying float vMorphFactor;
varying vec3 vNormal;
varying vec3 vPosition;

// float getHeight(vec3 p) {
//   // Assume a 1024x1024 world
//   vec2 st = p.xy / 1024.0;

//   // Sample multiple times to get more detail out of map
//   // float h = 1024.0 * texture2D(uHeightData, st).a;
//   // h += 64.0 * texture2D(uHeightData, 16.0 * st).a;
//   // h += 4.0 * texture2D(uHeightData, 256.0 * st).a;

//   // Square the height, leads to more rocky looking terrain
//   return h * h / 2000.0;
// }

float getB(vec3 p){
  vec2 st = p.xy / 1024.0;
  float b = texture(uHeightData, st).r ;
  return b;
}


void main() {
  vec3 color = vec3(0., 0., getB(vPosition));
  gl_FragColor = vec4(color, 1.0);
}`;
