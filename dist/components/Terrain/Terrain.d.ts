import * as THREE from 'three';
import React from 'react';

declare function Terrain({ worldWidth, levels, tileResolution, cameraRef, }: {
    worldWidth: number;
    levels: number;
    tileResolution: number;
    cameraRef: React.MutableRefObject<THREE.PerspectiveCamera>;
}): JSX.Element;

export { Terrain as default };
