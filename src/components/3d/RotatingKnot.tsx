import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RotatingKnotProps {
  color?: string;
  secondaryColor?: string;
  scale?: number;
}

export function RotatingKnot({ color = '#6366f1', secondaryColor = '#8b5cf6', scale = 1.5 }: RotatingKnotProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const material = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      emissive: new THREE.Color(color),
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      wireframe: false,
    });
  }, [color]);

  useFrame((state) => {
    if (!meshRef.current || !glowRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.3;
    meshRef.current.rotation.y = t * 0.3;
    meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;
    
    glowRef.current.rotation.x = meshRef.current.rotation.x;
    glowRef.current.rotation.y = meshRef.current.rotation.y;
    glowRef.current.rotation.z = meshRef.current.rotation.z;
    
    const scalePulse = scale + Math.sin(t * 0.8) * 0.02;
    meshRef.current.scale.setScalar(scalePulse);
    glowRef.current.scale.setScalar(scalePulse * 1.15);
  });

  return (
    <group>
      <mesh ref={meshRef} material={material}>
        <torusKnotGeometry args={[1.2, 0.35, 150, 20, 2, 3]} />
      </mesh>
      <mesh ref={glowRef}>
        <torusKnotGeometry args={[1.2, 0.35, 100, 16, 2, 3]} />
        <meshBasicMaterial
          color={secondaryColor}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
