import { Box, Cone, Plane, Sphere, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const HOUSE_HEIGHT = 2.5
const HOUSE_WIDTH = 4
const GHOSTS = [
  {
    color: '#ff00ff',
    intensity: 2,
    distance: 3
  },
  {
    color: '#00ffff',
    intensity: 2,
    distance: 3
  },
  {
    color: '#ff0000',
    intensity: 2,
    distance: 3
  }
]

export const Scene = () => {
  const doorRef = useRef<THREE.Mesh>(null)
  const ghostsRefs = useRef<THREE.PointLight[]>([])
  const [
    doorMap,
    doorAlphaMap,
    doorNormalMap,
    doorAoMap,
    doorHeightMap,
    doorMetalnessMap,
    doorRoughnessMap
  ] = useTexture([
    '/textures/door/color.jpg',
    '/textures/door/alpha.jpg',
    '/textures/door/normal.jpg',
    '/textures/door/ambientOcclusion.jpg',
    '/textures/door/height.jpg',
    '/textures/door/metalness.jpg',
    '/textures/door/roughness.jpg'
  ])
  const [brickMap, brickNormalMap, brickAoMap, brickRoughnessMap] = useTexture([
    '/textures/bricks/color.jpg',
    '/textures/bricks/normal.jpg',
    '/textures/bricks/ambientOcclusion.jpg',
    '/textures/bricks/roughness.jpg'
  ])

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime()
    const ghost1Angle = elapsedTime * 0.5
    const ghost2Angle = -elapsedTime * 0.32
    const ghost3Angle = -elapsedTime * 0.18

    ghostsRefs.current.forEach((ghost, idx) => {
      if (idx === 0) {
        ghost.position.x = Math.cos(ghost1Angle) * 4
        ghost.position.z = Math.sin(ghost1Angle) * 4
        ghost.position.y = Math.sin(elapsedTime * 3)
      }
      if (idx === 1) {
        ghost.position.x = Math.sin(ghost2Angle) * 5
        ghost.position.z = Math.cos(ghost2Angle) * 5
        ghost.position.y =
          Math.sin(elapsedTime * 4) * Math.sin(elapsedTime * 2.5)
      }

      if (idx === 2) {
        ghost.position.x =
          Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32))
        ghost.position.z =
          Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5))
        ghost.position.y = Math.sin(elapsedTime * 5) * Math.sin(elapsedTime * 2)
      }
    })
  })

  return (
    <>
      <group name="house">
        {/* Roof */}
        <Cone
          args={[3.5, 1, 4]}
          rotation={[0, Math.PI / 4, 0]}
          position={[0, HOUSE_HEIGHT + 0.5, 0]}
        >
          <meshStandardMaterial color="#b35f45" />
        </Cone>
        {/* Door */}
        <Box
          ref={doorRef}
          args={[2, 2, 0.005, 100, 100]}
          position={[0, 1, HOUSE_WIDTH / 2]}
        >
          <meshStandardMaterial
            transparent
            map={doorMap}
            alphaMap={doorAlphaMap}
            aoMap={doorAoMap}
            displacementMap={doorHeightMap}
            displacementScale={0.1}
            normalMap={doorNormalMap}
            metalnessMap={doorMetalnessMap}
            roughnessMap={doorRoughnessMap}
          />
        </Box>
        {/* Door light */}
        <pointLight
          position={[0, 2.2, 2.7]}
          intensity={0.8}
          distance={7}
          color="#ff7d46"
          
        />
        {/* Walls */}
        <Box
          args={[HOUSE_WIDTH, HOUSE_HEIGHT, HOUSE_WIDTH]}
          position={[0, HOUSE_HEIGHT / 2, 0]}
          castShadow
        >
          <meshStandardMaterial
            transparent
            map={brickMap}
            aoMap={brickAoMap}
            normalMap={brickNormalMap}
            roughnessMap={brickRoughnessMap}
          />
        </Box>
      </group>

      <group name="environment">
        {/* Bushes */}
        <Sphere args={[1, 16, 16]} position={[3, 0.5, 3]}>
          <meshStandardMaterial color="#a9c388" />
        </Sphere>
        {/* Graves */}
        {Array.from({ length: 50 }).map((_, i) => {
          const angle = Math.random() * Math.PI * 2
          const radius = 4 + Math.random() * 5
          const posX = Math.sin(angle) * radius
          const posZ = Math.cos(angle) * radius
          const rotY = (Math.random() - 0.5) * 0.4
          const rotZ = (Math.random() - 0.5) * 0.4

          return (
            <Box
              key={i}
              args={[0.6, 0.8, 0.2]}
              position={[posX, 0.3, posZ]}
              rotation={[0, rotY, rotZ]}
              castShadow
            >
              <meshStandardMaterial color="#b2b6b1" />
            </Box>
          )
        })}
        {/* Ghosts */}
        {GHOSTS.map((ghost, idx) => {
          return (
            <pointLight
              key={idx}
              ref={(ref) => {
                ghostsRefs.current.push(ref!)
              }}
              {...ghost}
              castShadow
            />
          )
        })}
      </group>

      <fog attach="fog" color="#262837" near={0} far={15} />
      <Floor />
    </>
  )
}

const Floor = () => {
  const [grassMap, grassNormalMap, grassAoMap, grassRoughnessMap] = useTexture(
    [
      '/textures/grass/color.jpg',
      '/textures/grass/normal.jpg',
      '/textures/grass/ambientOcclusion.jpg',
      '/textures/grass/roughness.jpg'
    ],
    (textures) => {
      textures.forEach((texture) => {
        texture.repeat.set(8, 8)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
      })
    }
  )

  return (
    <Plane
      args={[20, 20]}
      rotation={[-Math.PI * 0.5, 0, 0]}
      position={[0, 0, 0]}
      receiveShadow
    >
      <meshStandardMaterial
        map={grassMap}
        normalMap={grassNormalMap}
        aoMap={grassAoMap}
        roughnessMap={grassRoughnessMap}
      />
    </Plane>
  )
}
