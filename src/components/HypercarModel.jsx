import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';

/**
 * Official High-Definition Ferrari 458 Italia Hypercar Asset
 * Features precision PBR materials: Body_Color, Carbon_Fiber, metal_chrome,
 * authentic Tires, and crystal Taillight/Projector Glass.
 */
export function HypercarModel({ color = '#d90429', finish = 'gloss', activeSection = 0, scrollProgress = 0 }) {
  const groupRef = useRef();
  
  // Official Three.js high-poly Ferrari 458 Italia asset
  const { scene } = useGLTF('/models/ferrari.glb');
  
  const copiedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    const roughness = finish === 'matte' ? 0.35 : (finish === 'satin' ? 0.18 : 0.05);
    const metalness = finish === 'matte' ? 0.35 : 0.75;
    const clearcoat = finish === 'gloss' ? 1.0 : (finish === 'satin' ? 0.45 : 0.0);
    const clearcoatRoughness = finish === 'matte' ? 0.3 : 0.03;

    copiedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const matName = child.material?.name || '';
        const meshName = child.name || '';

        // Main Exterior Body Paint
        if (matName === 'Body_Color' || meshName === 'body') {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(color),
            metalness: metalness,
            roughness: roughness,
            clearcoat: clearcoat,
            clearcoatRoughness: clearcoatRoughness,
            reflectivity: 0.9,
            envMapIntensity: 1.3,
          });
        }

        // Carbon fiber diffusers & aerodynamic splitters
        if (matName.includes('Carbon') || meshName.includes('carbon')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#17171a'),
            roughness: 0.4,
            metalness: 0.6,
            envMapIntensity: 1.2,
          });
        }

        // Alloy rims and chrome badges
        if (matName.includes('chrome') || matName.includes('metal') || meshName.includes('rim')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#cbd5e1'),
            metalness: 0.95,
            roughness: 0.12,
            envMapIntensity: 1.5,
          });
        }

        // Tires
        if (matName.includes('Tires') || meshName.includes('tire')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#22252a'),
            roughness: 0.85,
            metalness: 0.05,
          });
        }

        // Glass canopy and projector lenses
        if (matName.includes('Glass') || meshName.includes('glass')) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#ffffff'),
            transmission: 0.92,
            opacity: 1,
            transparent: true,
            roughness: 0.02,
            ior: 1.5,
            thickness: 0.25,
            envMapIntensity: 1.4,
          });
        }
      }
    });
  }, [copiedScene, color, finish]);

  // Subtle breathing idle float
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.012;
  });

  return (
    <group ref={groupRef}>
      <Center top position={[0, -0.15, 0]}>
        <primitive object={copiedScene} scale={1.15} />
      </Center>
    </group>
  );
}

useGLTF.preload('/models/ferrari.glb');
