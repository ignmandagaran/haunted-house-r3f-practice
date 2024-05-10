'use client'

import { Canvas as R3FCanvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useControls } from 'leva'

const Scene = () => {
  const pointsRef = useRef<THREE.Points>(null)
  const pointsGeometryRef = useRef<THREE.InstancedBufferGeometry>(null)
  const pointsMaterialRef = useRef<THREE.PointsMaterial>(null)
  const {
    count,
    size,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor
  } = useControls({
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 8,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff3c00',
    outsideColor: '#1d00e5'
  })

  useEffect(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const colorInside = new THREE.Color(insideColor)
    const colorOutside = new THREE.Color(outsideColor)

    positions.forEach((_, i) => {
      const i3 = i * 3
      const radii = Math.random() * radius
      const branchAngle = ((i % branches) / branches) * Math.PI * 2
      const spinAngle = radii * spin

      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() > 0.5 ? 1 : -1)
      const randomY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() > 0.5 ? 1 : -1)
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() > 0.5 ? 1 : -1)

      positions[i3] = Math.cos(branchAngle + spinAngle) * radii + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radii + randomZ

      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radii / radius)

      // Colors 
      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    })
    const points = new THREE.BufferAttribute(positions, 3)

    // apply points to geometry
    if (pointsGeometryRef.current) {
      pointsGeometryRef.current.setAttribute('position', points)
      pointsGeometryRef.current.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      if (pointsGeometryRef.current.attributes.position)
        pointsGeometryRef.current.attributes.position.needsUpdate = true
    }
  }, [count, size, radius, branches, spin, randomness, randomnessPower])

  useFrame(() => {
    if(!pointsRef.current) return
    pointsRef.current.rotation.y += 0.001
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={pointsGeometryRef}>
        <bufferAttribute attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial
        ref={pointsMaterialRef}
        size={size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
      />
    </points>
  )
}

export const Lesson18GalaxyGeneratorCanvas = () => {
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
