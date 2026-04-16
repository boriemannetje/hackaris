"use client";

import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./LineArtGlobe.module.css";
import { COLOR_THEMES, cycleTheme, getCurrentThemeIndex } from "../lib/theme";

// Custom shader for depth-based opacity
export const depthVertexShader = `
  varying float vDepth;
  
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z; // Negative because camera looks down -Z
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const depthFragmentShader = `
  uniform vec3 uColor;
  uniform float uNear;
  uniform float uFar;
  uniform float uMinOpacity;
  uniform float uMaxOpacity;
  
  varying float vDepth;
  
  void main() {
    // Map depth to opacity: near = max opacity, far = min opacity
    float normalizedDepth = (vDepth - uNear) / (uFar - uNear);
    normalizedDepth = clamp(normalizedDepth, 0.0, 1.0);
    
    // Invert so closer = higher opacity
    float opacity = mix(uMaxOpacity, uMinOpacity, normalizedDepth);
    
    gl_FragColor = vec4(uColor, opacity);
  }
`;

// Convert lat/lon to 3D position on sphere
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

export interface GlobeProps {
  color: string;
  rotationRef: React.MutableRefObject<{ x: number; y: number }>;
  velocityRef: React.MutableRefObject<{ x: number; y: number }>;
  isDragging: boolean;
}

export function Globe({ color, rotationRef, velocityRef, isDragging }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetColorRef = useRef(new THREE.Color(color));
  const [currentColor] = useState(() => new THREE.Color(color));

  // Create the depth-based shader material - recreate when color changes
  const depthMaterial = useMemo(() => {
    const material = new THREE.ShaderMaterial({
      vertexShader: depthVertexShader,
      fragmentShader: depthFragmentShader,
      uniforms: {
        uColor: { value: currentColor },
        uNear: { value: 1.5 },  // Camera is at z=2.5, sphere radius is 1
        uFar: { value: 3.5 },
        uMinOpacity: { value: 0.2 },
        uMaxOpacity: { value: 1.0 },
      },
      transparent: true,
      depthWrite: false,
    });
    return material;
  }, [currentColor]);

  useEffect(() => {
    targetColorRef.current.set(color);
  }, [color]);

  useEffect(() => {
    return () => {
      depthMaterial.dispose();
    };
  }, [depthMaterial]);

  // Animation loop
  useFrame(() => {
    if (!groupRef.current) return;
    
    if (!isDragging) {
      // Apply momentum with friction
      rotationRef.current.x += velocityRef.current.y;
      rotationRef.current.y += velocityRef.current.x;
      
      velocityRef.current.x *= 0.95;
      velocityRef.current.y *= 0.95;
      
      // Auto-rotate slowly when velocity is low
      if (Math.abs(velocityRef.current.x) < 0.0005 && Math.abs(velocityRef.current.y) < 0.0005) {
        rotationRef.current.y += 0.002;
      }
    }
    
    groupRef.current.rotation.x = rotationRef.current.x;
    groupRef.current.rotation.y = rotationRef.current.y;

    // Smooth color transition toward the target
    currentColor.lerp(targetColorRef.current, 0.08);
    depthMaterial.uniforms.uColor.value.copy(currentColor);
  });

  // Create geometry data
  const { latLinePoints, lonLinePoints } = useMemo(() => {
    const radius = 1;
    
    const latPts: THREE.Vector3[][] = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = [];
      for (let lon = 0; lon <= 360; lon += 5) {
        points.push(latLonToVector3(lat, lon, radius));
      }
      latPts.push(points);
    }
    
    const lonPts: THREE.Vector3[][] = [];
    for (let lon = 0; lon < 360; lon += 30) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLonToVector3(lat, lon, radius));
      }
      lonPts.push(points);
    }
    
    return { latLinePoints: latPts, lonLinePoints: lonPts };
  }, []);

  return (
    <group ref={groupRef}>
      {latLinePoints.map((points, i) => {
        const array = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
        return (
          <line key={`lat-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[array, 3]}
              />
            </bufferGeometry>
            <primitive object={depthMaterial} attach="material" />
          </line>
        );
      })}
      {lonLinePoints.map((points, i) => {
        const array = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]));
        return (
          <line key={`lon-${i}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[array, 3]}
              />
            </bufferGeometry>
            <primitive object={depthMaterial} attach="material" />
          </line>
        );
      })}
    </group>
  );
}

export default function LineArtGlobe() {
  const [isDragging, setIsDragging] = useState(false);
  const [themeColor, setThemeColor] = useState(() => {
    if (typeof window === "undefined") return COLOR_THEMES[0].fg;
    const fg = getComputedStyle(document.documentElement).getPropertyValue("--fg").trim();
    return fg || COLOR_THEMES[getCurrentThemeIndex()].fg;
  });
  
  const rotationRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const clickStartRef = useRef({ x: 0, y: 0, time: 0 });

  // Cycle to next theme on click
  const cycleThemeHandler = useCallback(() => {
    const nextIndex = cycleTheme();
    const theme = COLOR_THEMES[nextIndex];
    setThemeColor(theme.fg);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
    clickStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    velocityRef.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const deltaX = (e.clientX - lastMouseRef.current.x) * 0.01;
    const deltaY = (e.clientY - lastMouseRef.current.y) * 0.01;
    
    rotationRef.current.y += deltaX;
    rotationRef.current.x += deltaY;
    
    velocityRef.current = { x: deltaX, y: deltaY };
    lastMouseRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    
    // Detect click: short duration and minimal movement
    const duration = Date.now() - clickStartRef.current.time;
    const distX = Math.abs(e.clientX - clickStartRef.current.x);
    const distY = Math.abs(e.clientY - clickStartRef.current.y);
    
    if (duration < 300 && distX < 5 && distY < 5) {
      cycleThemeHandler();
    }
  }, [cycleThemeHandler]);

  return (
    <div 
      className={styles.container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => setIsDragging(false)}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Globe 
          color={themeColor} 
          rotationRef={rotationRef}
          velocityRef={velocityRef}
          isDragging={isDragging}
        />
      </Canvas>
    </div>
  );
}
