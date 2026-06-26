import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { CinematicParticles } from './CinematicParticles';
import { RotatingKnot } from './RotatingKnot';
import { FloatingOrb } from './FloatingOrb';

function AnimatedLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  useFrame((state) => {
    if (!lightRef.current) return;
    const t = state.clock.elapsedTime;
    lightRef.current.position.x = Math.sin(t * 0.5) * 5;
    lightRef.current.position.z = Math.cos(t * 0.5) * 5;
  });
  return <directionalLight ref={lightRef} intensity={2} color="#6366f1" />;
}

function CameraRig() {
  const { camera } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.05) * 0.3;
    camera.position.y = Math.cos(t * 0.04) * 0.2 + 0.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#07070a']} />
          <fog attach="fog" args={['#07070a', 8, 25]} />
          
          <ambientLight intensity={0.15} />
          <AnimatedLight />
          <pointLight position={[5, 5, 5]} intensity={0.5} color="#8b5cf6" />
          <pointLight position={[-5, -5, -5]} intensity={0.3} color="#6366f1" />
          
          <CinematicParticles count={1500} color="#6366f1" spread={30} />
          <CinematicParticles count={800} color="#8b5cf6" spread={20} />
          
          <RotatingKnot color="#6366f1" secondaryColor="#8b5cf6" scale={1.2} />
          
          <FloatingOrb color="#a78bfa" position={[4, 2, -3]} scale={0.8} />
          <FloatingOrb color="#22d3ee" position={[-3.5, -1.5, -2]} scale={0.6} />
          <FloatingOrb color="#f472b6" position={[2, -2.5, -4]} scale={0.5} />
          
          <Stars radius={20} depth={50} count={3000} factor={4} saturation={0} fade speed={1.5} />
          
          <CameraRig />
          
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.3}
            maxDistance={15}
            minDistance={3}
            maxPolarAngle={Math.PI * 0.8}
            minPolarAngle={Math.PI * 0.1}
            dampingFactor={0.05}
            enableDamping
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function CompactHeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <pointLight position={[3, 3, 3]} intensity={0.4} color="#6366f1" />
          
          <CinematicParticles count={600} color="#6366f1" spread={15} />
          <RotatingKnot color="#6366f1" secondaryColor="#8b5cf6" scale={0.8} />
          <FloatingOrb color="#a78bfa" position={[2, 1, -2]} scale={0.4} />
          
          <Stars radius={15} depth={30} count={1500} factor={3} saturation={0} fade speed={1} />
          
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
