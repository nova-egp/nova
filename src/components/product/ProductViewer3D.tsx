import React, { Suspense, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';

interface ProductViewer3DProps {
  stlUrl: string;
  /** hex color for the resin material tint */
  color?: string;
  /** 0 = fully transparent/clear resin look, 1 = opaque */
  opacity?: number;
}

function Model({ stlUrl, color = '#e8e2d4', opacity = 0.55 }: Required<Omit<ProductViewer3DProps, 'stlUrl'>> & { stlUrl: string }) {
  const geometry = useLoader(STLLoader, stlUrl);

  const normalizedGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.center();
    geo.computeVertexNormals();
    // Scale to a consistent, comfortable viewing size regardless of the
    // source model's native units.
    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const target = 3.4;
    geo.scale(target / maxDim, target / maxDim, target / maxDim);
    return geo;
  }, [geometry]);

  return (
    <mesh geometry={normalizedGeometry} castShadow receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
      <meshPhysicalMaterial
        color={color}
        transmission={Math.max(0, 1 - opacity)}
        thickness={1.2}
        roughness={0.15}
        metalness={0.05}
        clearcoat={1}
        clearcoatRoughness={0.1}
        ior={1.5}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.01, 0.01, 0.01]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

export function ProductViewer3D({ stlUrl, color = '#e8e2d4', opacity = 0.55 }: ProductViewer3DProps) {
  return (
    <div className="relative w-full aspect-square md:aspect-[4/3] bg-navy-800 overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 1.6, 4.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#0E1330']} />
        <ambientLight intensity={0.35} />
        <spotLight
          position={[4, 6, 4]}
          angle={0.35}
          penumbra={0.6}
          intensity={1.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight position={[-4, 3, -3]} angle={0.5} penumbra={1} intensity={0.5} color="#C6A15B" />
        <Suspense fallback={<Loader />}>
          <Center>
            <Model stlUrl={stlUrl} color={color} opacity={opacity} />
          </Center>
          <Environment preset="studio" />
        </Suspense>
        <ContactShadows position={[0, -1.3, 0]} opacity={0.5} scale={10} blur={2.4} far={4} />
        <OrbitControls
          enablePan={false}
          minDistance={2.4}
          maxDistance={7}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
          autoRotate
          autoRotateSpeed={1.1}
        />
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest2 text-cream-200/50">
        Drag to rotate · Scroll to zoom
      </div>
    </div>
  );
}
