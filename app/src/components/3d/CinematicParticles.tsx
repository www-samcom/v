import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color?: string;
  spread?: number;
}

export function CinematicParticles({ count = 2000, color = '#6366f1', spread = 50 }: ParticleSystemProps) {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const [positions, velocities, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;
      
      vel[i * 3] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
      
      siz[i] = Math.random() * 2 + 0.5;
    }
    
    return [pos, vel, siz];
  }, [count, spread]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uViewport: { value: new THREE.Vector2(viewport.width, viewport.height) },
  }), [color, viewport]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  const vertexShader = `
    uniform float uTime;
    uniform float uPixelRatio;
    attribute float aSize;
    attribute vec3 aVelocity;
    varying float vAlpha;
    
    void main() {
      vec3 pos = position;
      pos.x += sin(uTime * 0.5 + position.y * 0.1) * 0.5;
      pos.y += cos(uTime * 0.3 + position.x * 0.1) * 0.3;
      pos.z += sin(uTime * 0.4 + position.z * 0.1) * 0.2;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = aSize * uPixelRatio * (15.0 / -mvPosition.z);
      
      vAlpha = 0.5 + 0.5 * sin(uTime + position.x * 0.5);
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    varying float vAlpha;
    
    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;
      
      float glow = 1.0 - dist * 2.0;
      glow = pow(glow, 1.5);
      
      gl_FragColor = vec4(uColor, glow * vAlpha * 0.8);
    }
  `;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('aVelocity', new THREE.Float32BufferAttribute(velocities, 3));
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
    return geo;
  }, [positions, velocities, sizes]);

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
