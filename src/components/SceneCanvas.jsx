import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { HypercarModel } from './HypercarModel';

function CameraRig({ targetCamera, targetLookAt }) {
  useFrame((state, delta) => {
    state.camera.position.lerp(targetCamera.current, delta * 3.2);
    const currentTarget = new THREE.Vector3();
    state.camera.getWorldDirection(currentTarget);
    
    state.camera.lookAt(
      THREE.MathUtils.lerp(currentTarget.x, targetLookAt.current.x, delta * 3.2),
      THREE.MathUtils.lerp(currentTarget.y, targetLookAt.current.y, delta * 3.2),
      THREE.MathUtils.lerp(currentTarget.z, targetLookAt.current.z, delta * 3.2)
    );
  });

  return null;
}

export function SceneCanvas({ carColor, carFinish, activeSection, scrollProgress, targetCamera, targetLookAt }) {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        shadows
        camera={{ position: [5.2, 1.8, 5.6], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        {/* Clean, high-end warm stone/editorial studio environment */}
        <color attach="background" args={['#e8e7e3']} />
        <fog attach="fog" args={['#e8e7e3', 12, 28]} />

        {/* Natural balanced ambient daylight */}
        <ambientLight intensity={0.9} color="#ffffff" />
        
        {/* Soft overhead photographic key sun */}
        <directionalLight 
          position={[6, 14, 8]} 
          intensity={1.8} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          color="#fffdf8"
        />
        
        {/* Neutral fill light to soften shadows */}
        <directionalLight position={[-8, 6, -6]} intensity={0.9} color="#e2e8f0" />
        <directionalLight position={[0, -2, 6]} intensity={0.4} color="#f8fafc" />

        {/* Soft, clean, realistic studio floor shadow */}
        <ContactShadows
          position={[0, -0.2, 0]}
          opacity={0.35}
          scale={16}
          blur={2.4}
          far={3.5}
          resolution={1024}
          color="#334155"
        />

        {/* Studio HDR Reflections with architectural softboxes */}
        <Environment preset="studio" environmentIntensity={0.85}>
          <Lightformer form="rect" intensity={2} position={[0, 8, 0]} scale={[14, 4, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1} position={[-8, 4, 4]} scale={[8, 3, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={1} position={[8, 4, -4]} scale={[8, 3, 1]} rotation-y={-Math.PI / 2} />
        </Environment>

        <Suspense fallback={null}>
          <HypercarModel 
            color={carColor} 
            finish={carFinish} 
            activeSection={activeSection}
            scrollProgress={scrollProgress}
          />
        </Suspense>

        <CameraRig targetCamera={targetCamera} targetLookAt={targetLookAt} />
      </Canvas>
    </div>
  );
}
