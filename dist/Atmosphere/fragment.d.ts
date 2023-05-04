declare const Fragment = "uniform vec3 uHorizonColor;\nuniform vec3 uSkyColor;\n\nvarying float vDistance;\n\nvoid main() {\n  // Not the best gradient effect....\n  float blend = smoothstep( 500.0, 1500.0, gl_FragCoord.y );\n  vec3 color = mix( uHorizonColor, uSkyColor, blend );\n  gl_FragColor = vec4( color, 1.0 );\n}";

export { Fragment };
