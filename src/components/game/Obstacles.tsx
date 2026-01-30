'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Obstacle } from '@/store/gameStore'

interface CarProps {
  obstacle: Obstacle
  z: number
  direction: 1 | -1
}

export function Car({ obstacle, z, direction }: CarProps) {
  const meshRef = useRef<THREE.Group>(null)
  const colors = [
    // Reds
    '#e74c3c', '#c0392b', '#ff6b6b', '#ee5a5a', '#d63031',
    // Blues
    '#3498db', '#2980b9', '#0984e3', '#74b9ff', '#a29bfe',
    // Greens
    '#2ecc71', '#27ae60', '#00b894', '#55efc4', '#00cec9',
    // Yellows/Oranges
    '#f1c40f', '#f39c12', '#e67e22', '#d35400', '#fdcb6e',
    // Purples/Pinks
    '#9b59b6', '#8e44ad', '#6c5ce7', '#fd79a8', '#e84393',
    // Whites/Grays/Blacks
    '#ecf0f1', '#bdc3c7', '#636e72', '#2d3436', '#dfe6e9',
    // Special colors
    '#00b5ad', '#21ba45', '#6435c9', '#a333c8', '#e03997',
    '#f2711c', '#fbbd08', '#b5cc18', '#00b5ad', '#2185d0'
  ]
  const color = colors[Math.abs(obstacle.id.charCodeAt(obstacle.id.length - 1) + obstacle.id.charCodeAt(0)) % colors.length]

  return (
    <group
      ref={meshRef}
      position={[obstacle.x, 0.25, z]}
      rotation={[0, direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
    >
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.35, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 0.22, -0.05]} castShadow>
        <boxGeometry args={[0.5, 0.2, 0.45]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Wheels */}
      <mesh position={[-0.32, -0.12, 0.2]}>
        <boxGeometry args={[0.08, 0.15, 0.15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.32, -0.12, 0.2]}>
        <boxGeometry args={[0.08, 0.15, 0.15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[-0.32, -0.12, -0.2]}>
        <boxGeometry args={[0.08, 0.15, 0.15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0.32, -0.12, -0.2]}>
        <boxGeometry args={[0.08, 0.15, 0.15]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Headlights */}
      <mesh position={[0.15, 0, 0.41]}>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFF00" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.15, 0, 0.41]}>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFF00" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export function Truck({ obstacle, z, direction }: CarProps) {
  return (
    <group
      position={[obstacle.x, 0.35, z]}
      rotation={[0, direction > 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
    >
      {/* Cabin */}
      <mesh position={[0, 0, 0.55]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.5]} />
        <meshStandardMaterial color="#2244AA" />
      </mesh>

      {/* Cargo */}
      <mesh position={[0, 0.05, -0.2]} castShadow>
        <boxGeometry args={[0.75, 0.6, 1.2]} />
        <meshStandardMaterial color="#AA8844" />
      </mesh>

      {/* Wheels */}
      {[-0.38, 0.38].map((x, i) => (
        <group key={i}>
          <mesh position={[x, -0.25, 0.55]}>
            <boxGeometry args={[0.1, 0.2, 0.2]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[x, -0.25, -0.3]}>
            <boxGeometry args={[0.1, 0.2, 0.2]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[x, -0.25, -0.7]}>
            <boxGeometry args={[0.1, 0.2, 0.2]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// KTX-style train
export function Log({ obstacle, z }: { obstacle: Obstacle; z: number }) {
  const carriages = Math.floor(obstacle.width / 1.2)

  return (
    <group position={[obstacle.x, 0, z]}>
      {/* Train carriages */}
      {Array.from({ length: carriages }).map((_, i) => (
        <group key={i} position={[(i - carriages / 2 + 0.5) * 1.1, 0.35, 0]}>
          {/* Main body - white */}
          <mesh castShadow>
            <boxGeometry args={[1, 0.5, 0.7]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>

          {/* Orange stripe (KTX style) */}
          <mesh position={[0, -0.05, 0.351]}>
            <planeGeometry args={[1, 0.12]} />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>
          <mesh position={[0, -0.05, -0.351]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1, 0.12]} />
            <meshStandardMaterial color="#e74c3c" />
          </mesh>

          {/* Blue line above orange */}
          <mesh position={[0, 0.05, 0.351]}>
            <planeGeometry args={[1, 0.06]} />
            <meshStandardMaterial color="#2980b9" />
          </mesh>
          <mesh position={[0, 0.05, -0.351]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1, 0.06]} />
            <meshStandardMaterial color="#2980b9" />
          </mesh>

          {/* Windows */}
          <mesh position={[-0.3, 0.12, 0.352]}>
            <planeGeometry args={[0.2, 0.18]} />
            <meshStandardMaterial color="#1a252f" />
          </mesh>
          <mesh position={[0, 0.12, 0.352]}>
            <planeGeometry args={[0.2, 0.18]} />
            <meshStandardMaterial color="#1a252f" />
          </mesh>
          <mesh position={[0.3, 0.12, 0.352]}>
            <planeGeometry args={[0.2, 0.18]} />
            <meshStandardMaterial color="#1a252f" />
          </mesh>

          {/* Front nose for first carriage */}
          {i === 0 && (
            <>
              <mesh position={[0.55, 0, 0]} castShadow>
                <boxGeometry args={[0.15, 0.4, 0.6]} />
                <meshStandardMaterial color="#f5f5f5" />
              </mesh>
              <mesh position={[0.55, -0.05, 0.301]}>
                <planeGeometry args={[0.15, 0.1]} />
                <meshStandardMaterial color="#e74c3c" />
              </mesh>
              {/* Headlight */}
              <mesh position={[0.63, 0.05, 0]}>
                <boxGeometry args={[0.02, 0.1, 0.2]} />
                <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={0.5} />
              </mesh>
            </>
          )}

          {/* Wheels */}
          <mesh position={[-0.3, -0.2, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          <mesh position={[0.3, -0.2, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          <mesh position={[-0.3, -0.2, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
          <mesh position={[0.3, -0.2, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
            <meshStandardMaterial color="#2c3e50" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// Small building (replaces tree) - acts as obstacle on sidewalk
export function Tree({ obstacle, z }: { obstacle: Obstacle; z: number }) {
  const seed = obstacle.id.charCodeAt(obstacle.id.length - 1)
  const height = 2 + (seed % 5) * 0.6
  const width = 0.7 + (seed % 3) * 0.15

  // Gray building colors
  const colors = ['#7f8c8d', '#95a5a6', '#6c7a89', '#808e9b', '#85929e']
  const color = colors[seed % colors.length]

  const windowRows = Math.floor(height / 0.5)

  return (
    <group position={[obstacle.x, 0, z]}>
      {/* Main building body */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, width]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Windows - all 4 faces */}
      {Array.from({ length: windowRows }).map((_, floor) => (
        <group key={`windows-${floor}`}>
          {/* Front (+z) */}
          <mesh
            position={[0, 0.3 + floor * 0.5, width / 2 + 0.01]}
          >
            <planeGeometry args={[width * 0.5, 0.3]} />
            <meshStandardMaterial color="#4a9eb8" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Back (-z) */}
          <mesh
            position={[0, 0.3 + floor * 0.5, -width / 2 - 0.01]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[width * 0.5, 0.3]} />
            <meshStandardMaterial color="#4a9eb8" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Left (-x) */}
          <mesh
            position={[-width / 2 - 0.01, 0.3 + floor * 0.5, 0]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[width * 0.5, 0.3]} />
            <meshStandardMaterial color="#4a9eb8" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Right (+x) */}
          <mesh
            position={[width / 2 + 0.01, 0.3 + floor * 0.5, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[width * 0.5, 0.3]} />
            <meshStandardMaterial color="#4a9eb8" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Rooftop edge */}
      <mesh position={[0, height + 0.03, 0]}>
        <boxGeometry args={[width + 0.05, 0.06, width + 0.05]} />
        <meshStandardMaterial color="#5d6d7e" />
      </mesh>
    </group>
  )
}
