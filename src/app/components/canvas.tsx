'use client'

import { Canvas as R3FCanvas } from '@react-three/fiber'

import { Scene } from './scene'

export const Canvas = () => {
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
      <ambientLight color="#FFF" intensity={0.5} />
      <directionalLight color="#FFF" intensity={1} position={[4, 5, -2]} />

      <Scene />
    </R3FCanvas>
  )
}
