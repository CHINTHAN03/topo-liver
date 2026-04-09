'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

const LiverModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const steatosis = useStore((state) => state.steatosis);
  const inflammation = useStore((state) => state.inflammation);
  const fibrosis = useStore((state) => state.fibrosis);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSteatosis: { value: 0 },
      uInflammation: { value: 0 },
      uFibrosis: { value: 0 },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smooth interpolation
      materialRef.current.uniforms.uSteatosis.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uSteatosis.value,
        steatosis,
        0.1
      );
      materialRef.current.uniforms.uInflammation.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uInflammation.value,
        inflammation,
        0.1
      );
      materialRef.current.uniforms.uFibrosis.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uFibrosis.value,
        fibrosis,
        0.1
      );
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const vertexShader = `
    uniform float uTime;
    uniform float uSteatosis;
    uniform float uFibrosis;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;

      // Base liver shape deformation (Advanced organic math representation)
      // 1. Flatten the sphere on the Z axis and Y axis slightly
      pos.z *= 0.65;
      pos.y *= 0.85;

      // 2. Taper towards the left lobe (negative x)
      float taper = smoothstep(-2.0, 2.0, pos.x);
      pos.y *= mix(0.4, 1.2, taper);
      pos.z *= mix(0.5, 1.2, taper);

      // 3. Curve backwards to fit abdominal cavity
      pos.z -= pos.x * pos.x * 0.15;

      // 4. Create the falciform ligament indent (middle line)
      float ligament = exp(-pow(pos.x + 0.3, 2.0) * 12.0);
      pos.z += ligament * 0.35;
      pos.y -= ligament * 0.15;
      
      // Bumpiness based on fibrosis (macronodular cirrhosis) instead of random steatosis noise
      float scarLines = max(sin(pos.x * 40.0 + pos.y * 40.0), sin(pos.x * -20.0 + pos.y * 20.0));
      float scarNodules = scarLines * uFibrosis;
      // Shrink the liver based on severe fibrosis
      pos *= mix(1.0, 0.85, uFibrosis);
      pos += normal * (scarNodules * 0.15); // Displace outwards for nodules

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform float uSteatosis;
    uniform float uInflammation;
    uniform float uFibrosis;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Base biological liver color (Healthy: Dark reddish-brown)
      vec3 baseColor = vec3(0.5, 0.15, 0.1); 

      // 1. Add Steatosis (Fatty Liver) -> Paler, more yellow-tan hue directly shifting the base organ color
      vec3 fatColor = vec3(0.8, 0.7, 0.4);
      // Smooth interpolation for global fattiness
      vec3 liverColor = mix(baseColor, fatColor, uSteatosis * 0.7);

      // 2. Add Inflammation (Hyperemia) -> Mottled darker crimson patches
      vec3 inflamedColor = vec3(0.6, 0.0, 0.0);
      float inflammationMottling = (sin(vUv.x * 50.0) * cos(vUv.y * 50.0)) * uInflammation;
      liverColor = mix(liverColor, inflamedColor, clamp(inflammationMottling, 0.0, 1.0));

      // 3. Add Fibrosis (Necrotic/Fibrous bands) -> Pale, grayish bands in the scar trenches
      vec3 fibrousColor = vec3(0.7, 0.65, 0.6);
      float scarLines = max(sin(vUv.x * 40.0 + vUv.y * 40.0), sin(vUv.x * -20.0 + vUv.y * 20.0));
      // In the trenches (where the vertex shader displaced less), add fibrous tissue
      float scarIntensity = smoothstep(0.6, 1.0, scarLines) * uFibrosis;
      liverColor = mix(liverColor, fibrousColor, scarIntensity);

      // Simple lighting (Lambert / diffuse)
      vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
      float diff = max(dot(normal, lightDir), 0.2); // Core diffuse illumination
      
      // Specular highlights (to make it look like a wet organ)
      vec3 reflectDir = reflect(-lightDir, normal);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      float specularStrength = mix(0.5, 0.1, uFibrosis); // Cirrhosis is drier, less shiny

      // Compile final lighting
      vec3 finalColor = (liverColor * diff) + (vec3(1.0) * spec * specularStrength);

      gl_FragColor = vec4(finalColor, 1.0); // Solid object, no alpha transparency needed for physical representation
    }
  `;

  return (
    <mesh ref={meshRef} scale={[-1.2, 0.8, 1.0]} rotation={[0, Math.PI / 4, 0]}>
      <sphereGeometry args={[2, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const LiverSimulationCanvas = () => {
  return (
    <div className="w-full h-full bg-slate-100">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <LiverModel />
        <OrbitControls enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default LiverSimulationCanvas;