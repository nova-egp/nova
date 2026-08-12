import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center, Bounds, useGLTF } from '@react-three/drei';

interface HeroViewer3DProps {
  glbUrl: string;
}

function Model({ glbUrl }: { glbUrl: string }) {
  const { scene } = useGLTF(glbUrl);
  return <primitive object={scene} />;
}

function Loader() {
  return (
    <mesh>
      <boxGeometry args={[0.01, 0.01, 0.01]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}

// The hero uses the same lighting/interaction language as the per-product
// STL viewer (ProductViewer3D) — rotate, zoom, studio environment — but
// loads a pre-authored GLB instead of a raw STL, since the hero asset
// already ships with its own materials (gold leaf inclusions etc.).
//
// Framing: rather than guessing a fixed camera distance/model scale (which
// only looks right for one particular GLB export), <Bounds> measures the
// model's actual bounding box after it loads and fits the camera to it —
// so the T-Head reliably fills the frame, stays fully in view, and reframes
// itself if the container is resized (desktop <-> mobile).
export function HeroViewer3D({ glbUrl }: HeroViewer3DProps) {
  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        camera={{ fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#141936']} />
        <ambientLight intensity={0.4} />
        <spotLight
          position={[4, 6, 4]}
          angle={0.35}
          penumbra={0.6}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight position={[-4, 3, -3]} angle={0.5} penumbra={1} intensity={0.6} color="#C6A15B" />
        <Suspense fallback={<Loader />}>
          <Bounds fit clip observe margin={1.1}>
            <Center>
              <Model glbUrl={glbUrl} />
            </Center>
          </Bounds>
          <Environment preset="studio" />
        </Suspense>
        <ContactShadows position={[0, -1.3, 0]} opacity={0.5} scale={10} blur={2.4} far={4} />
        <OrbitControls
          makeDefault
          enablePan={false}
          minDistance={0.5}
          maxDistance={20}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI - Math.PI / 4}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
}
