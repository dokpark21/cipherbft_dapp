'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useGameStore } from '@/store/gameStore'

export function Character() {
  const meshRef = useRef<THREE.Group>(null)
  const { playerPosition, isMoving, jumpProgress } = useGameStore()

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = playerPosition.x
      meshRef.current.position.z = playerPosition.z

      // 점프 애니메이션 - 포물선 궤적
      if (isMoving) {
        // sin(0 to PI) = 0 -> 1 -> 0 포물선
        const jumpHeight = Math.sin(jumpProgress * Math.PI) * 0.5
        meshRef.current.position.y = 0.3 + jumpHeight
      } else {
        meshRef.current.position.y = 0.3
      }
    }
  })

  return (
    <group ref={meshRef} position={[0, 0.3, 0]}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.35]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.4, 0.05]} castShadow>
        <boxGeometry args={[0.35, 0.25, 0.3]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.08, 0.45, 0.18]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.08, 0.45, 0.18]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Beak */}
      <mesh position={[0, 0.38, 0.22]}>
        <boxGeometry args={[0.12, 0.08, 0.1]} />
        <meshStandardMaterial color="#FF6B00" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, -0.05, 0]} castShadow>
        <boxGeometry args={[0.08, 0.15, 0.08]} />
        <meshStandardMaterial color="#FF6B00" />
      </mesh>
      <mesh position={[0.1, -0.05, 0]} castShadow>
        <boxGeometry args={[0.08, 0.15, 0.08]} />
        <meshStandardMaterial color="#FF6B00" />
      </mesh>
    </group>
  )
}
