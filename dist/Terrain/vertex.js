const Vertex = `uniform vec3 uGlobalOffset;
uniform sampler2D uHeightData;
uniform vec2 uTileOffset;
uniform float uScale;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vMorphFactor;

#define TILE_RESOLUTION 64.0

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

vec3 getNormal() {
  // Get 2 vectors perpendicular to the unperturbed normal, and create at point at each (relative to position)
  //float delta = 1024.0 / 4.0;
  float delta = (vMorphFactor + 1.0) * uScale / TILE_RESOLUTION;
  vec3 dA = delta * normalize(cross(normal.yzx, normal));
  vec3 dB = delta * normalize(cross(dA, normal));
  vec3 p = vPosition;
  vec3 pA = vPosition + dA;
  vec3 pB = vPosition + dB;

  // Now get the height at those points
  float h = getHeight(vPosition);
  float hA = getHeight(pA);
  float hB = getHeight(pB);

  // Update the points with their correct heights and calculate true normal
  p += normal * h;
  pA += normal * hA;
  pB += normal * hB;
  return normalize(cross(pB - p, pA - p));
}

uniform int uEdgeMorph;

#define EGDE_MORPH_TOP 1
#define EGDE_MORPH_LEFT 2
#define EGDE_MORPH_BOTTOM 4
#define EGDE_MORPH_RIGHT 8

// Poor man's bitwise &
bool edgePresent(int edge) {
  int e = uEdgeMorph / edge;
  return 2 * ( e / 2 ) != e;
}

#define MORPH_REGION 0.3

// At the edges of tiles morph the vertices, if they are joining onto a higher layer
float calculateMorph(vec3 p) {
  float morphFactor = 0.0;
  if( edgePresent(EGDE_MORPH_TOP) && p.y >= 1.0 - MORPH_REGION ) {
    float m = 1.0 - clamp((1.0 - p.y) / MORPH_REGION, 0.0, 1.0);
    morphFactor = max(m, morphFactor);
  }
  if( edgePresent(EGDE_MORPH_LEFT) && p.x <= MORPH_REGION ) {
    float m = 1.0 - clamp(p.x / MORPH_REGION, 0.0, 1.0);
    morphFactor = max(m, morphFactor);
  }
  if( edgePresent(EGDE_MORPH_BOTTOM) && p.y <= MORPH_REGION ) {
    float m = 1.0 - clamp(p.y / MORPH_REGION, 0.0, 1.0);
    morphFactor = max(m, morphFactor);
  }
  if( edgePresent(EGDE_MORPH_RIGHT) && p.x >= 1.0 - MORPH_REGION ) {
    float m = 1.0 - clamp((1.0 - p.x) / MORPH_REGION, 0.0, 1.0);
    morphFactor = max(m, morphFactor);
  }

  return morphFactor;
}

void main() {
  vMorphFactor = calculateMorph(position);
  // THIS ISNT GETTING UPDATED !! IT LOOKS LIKE ITS WORKING BUT ITS NOT
  vec3 uGlobalXY = vec3(uGlobalOffset.x, uGlobalOffset.y, 0.);
  vPosition = uScale * position + vec3(uTileOffset, 0.0) + uGlobalXY;

  float grid = uScale / TILE_RESOLUTION;
  vPosition = floor(vPosition / grid) * grid;
  if( vMorphFactor > 0.0 ) {
    // Get position that we would have if we were on higher level grid
    grid = 2.0 * grid;
    vec3 position2 = floor(vPosition / grid) * grid;

    // Linearly interpolate the two, depending on morph factor
    vPosition = mix(vPosition, position2, vMorphFactor);
  }

  // Get height and calculate normal
  vPosition = vPosition + normal * getHeight(vPosition);
  vNormal = getNormal();
  //vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
}`;

export { Vertex };
