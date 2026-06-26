import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingOrbProps {
  color?: string;
  position?: [number, number, number];
  scale?: number;
}

export function FloatingOrb({ color = '#6366f1', position = [0, 0, 0], scale = 1 }: FloatingOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current || !ringRef.current || !innerRef.current) return;
    const t = state.clock.elapsedTime;
    
    meshRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.3;
    meshRef.current.position.x = position[0] + Math.cos(t * 0.3 + position[1]) * 0.1;
    
    ringRef.current.rotation.x = t * 0.4;
    ringRef.current.rotation.y = t * 0.6;
    
    innerRef.current.rotation.x = -t * 0.8;
    innerRef.current.rotation.z = t * 0.5;
  });

  return (
    <group position={position} scale={scale}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.0, 0.02, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh ref={innerRef}>
        <torusGeometry args={[0.75, 0.015, 16, 80]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
