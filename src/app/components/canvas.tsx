'use client'

import { Canvas as R3FCanvas } from '@react-three/fiber'

import { Scene } from './scene'
import { OrbitControls } from '@react-three/drei'

export const Canvas = () => {
  return (
    <R3FCanvas
      style={{ height: '100vh', width: '100vw' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#262837')
        gl.shadowMap.enabled = true
      }}
      camera={{
        position: [4, 2, 5],
        fov: 75,
        near: 0.1,
        far: 100
      }}
    >
      <ambientLight color="#b9d5ff" intensity={0.13} castShadow />
      <directionalLight color="#FFF" intensity={0.13} position={[4, 5, -2]} castShadow />
      <OrbitControls />

      <Scene />
    </R3FCanvas>
  )
}
