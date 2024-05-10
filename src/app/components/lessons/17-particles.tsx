'use client'

import { Canvas as R3FCanvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useTexture } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const COUNT = 5000

const Scene = () => {
  const particlesGeometryRef = useRef<THREE.BufferGeometry>(null)
  const particleTexture = useTexture('/textures/particles/8.png')
  
  const points = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    positions.forEach((_, i) => {
      positions[i] = (Math.random() - 0.5) * 10
    })
    return new THREE.BufferAttribute(positions, 3)
  }, [COUNT])

  const colors = useMemo(() => {
    const colors = new Float32Array(COUNT * 3)
    colors.forEach((_, i) => {
      colors[i] = Math.random()
    })
    return new THREE.BufferAttribute(colors, 3)
  }, [])

  // This is very bad for performance. only use this animation approach in small arrays (50 elements for example)
  useFrame((state) => {
    if(!particlesGeometryRef.current || !particlesGeometryRef.current.attributes.position) return

    const elapsedTime = state.clock.getElapsedTime()

    const positions = particlesGeometryRef.current.attributes.position.array as Float32Array
    positions.forEach((_, i) => {
      const i3 = i * 3
      const x = positions[i3]!
      positions[i3 + 1] = Math.sin(elapsedTime + x)
    })

    particlesGeometryRef.current.attributes.position.needsUpdate = true

  })

  return (
    <points>
      <bufferGeometry ref={particlesGeometryRef}>
        <bufferAttribute attach="attributes-color" {...colors} />
        <bufferAttribute attach="attributes-position" {...points} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        alphaMap={particleTexture}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
        transparent
      />
    </points>
  )
}

export const Lesson17ParticlesCanvas = () => {
  return (
    <R3FCanvas
      style={{ height: '100vh', width: '100vw' }}
      camera={{
        position: [4, 2, 5],
        fov: 75,
        near: 0.1,
        far: 100
      }}
    >
      <ambientLight color="#b9d5ff" intensity={0.13} castShadow />
      <OrbitControls />

      <Scene />
    </R3FCanvas>
  )
}
