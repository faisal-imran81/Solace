"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from "@react-three/drei"
import { Bloom, EffectComposer } from "@react-three/postprocessing"

export default function BrainOrb() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} style={{ width: "100%", height: "100%", background: "transparent" }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#8b5cf6" />
      <pointLight position={[-5, -2, 3]} intensity={1} color="#06b6d4" />

      <Float floatIntensity={2} speed={2}>
        <Sphere args={[1.4, 64, 64]}>
          <MeshDistortMaterial
            color="#7c3aed"
            distort={0.5}
            speed={2}
            roughness={0}
            emissive="#4f46e5"
            emissiveIntensity={0.4}
            metalness={0.6}
          />
        </Sphere>
      </Float>

      <Float floatIntensity={1.5} speed={2.5}>
        <Sphere args={[0.3, 32, 32]} position={[2.5, 1, -1]}>
          <MeshDistortMaterial
            color="#06b6d4"
            distort={0.4}
            speed={2}
            roughness={0}
            emissive="#0e7490"
            emissiveIntensity={0.6}
            metalness={0.5}
          />
        </Sphere>
      </Float>

      <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.3} mipmapBlur />
      </EffectComposer>

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.8}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </Canvas>
  )
}
