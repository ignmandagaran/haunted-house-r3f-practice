import { Box, Plane } from '@react-three/drei'

export const Scene = () => {
  return (
    <>
      <group name="house">
        <Box args={[1, 1, 1]} position={[0, 1.25, 0]}>
          <meshStandardMaterial color="#ac8e82" />
        </Box>
      </group>
      <Floor />
    </>
  )
}

const Floor = () => {
  return (
    <Plane
      args={[20, 20]}
      rotation={[-Math.PI * 0.5, 0, 0]}
      position={[0, 0, 0]}
    >
      <meshStandardMaterial color="#a9c388" />
    </Plane>
  )
}
