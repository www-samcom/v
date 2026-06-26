import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NeuralNetwork3DProps {
  color?: string;
  nodeCount?: number;
}

export function NeuralNetwork3D({ color = '#06b6d4', nodeCount = 30 }: NeuralNetwork3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const nodes = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      positions.push(new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ));
    }
    return positions;
  }, [nodeCount]);

  const lineGeometry = useMemo(() => {
    const positions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 3.5) {
          positions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [nodes]);

  useFrame((state) => {
    if (!groupRef.current || !linesRef.current) return;
    const t = state.clock.elapsedTime;
    
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.2;
    
    nodes.forEach((node, i) => {
      node.y += Math.sin(t * 0.5 + i * 0.3) * 0.002;
      node.x += Math.cos(t * 0.3 + i * 0.2) * 0.001;
    });

    const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
    let idx = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].distanceTo(nodes[j]);
        if (dist < 3.5) {
          positions[idx++] = nodes[i].x;
          positions[idx++] = nodes[i].y;
          positions[idx++] = nodes[i].z;
          positions[idx++] = nodes[j].x;
          positions[idx++] = nodes[j].y;
          positions[idx++] = nodes[j].z;
        }
      }
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.15} />
      </lineSegments>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}
