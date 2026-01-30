'use client'

import { useMemo, Suspense } from 'react'
import { Text } from '@react-three/drei'
import { useGameStore, Lane as LaneType } from '@/store/gameStore'
import { Car, Truck, Log, Tree } from './Obstacles'

// Highway-style billboard sign
function Billboard({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Support poles - sleek metal */}
      <mesh position={[-1.4, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3, 12]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.4, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 3, 12]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main sign board - gradient blue */}
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[3.2, 1.2, 0.12]} />
        <meshStandardMaterial color="#0f3460" metalness={0.1} roughness={0.8} />
      </mesh>

      {/* Inner panel - darker blue */}
      <mesh position={[0, 3.2, -0.061]}>
        <boxGeometry args={[3.0, 1.0, 0.01]} />
        <meshStandardMaterial color="#16213e" />
      </mesh>

      {/* Accent border - subtle glow */}
      <mesh position={[0, 3.2, -0.062]}>
        <boxGeometry args={[3.1, 1.1, 0.005]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.15} />
      </mesh>

      {/* Text - facing player (looking toward -z) */}
      <Suspense fallback={null}>
        <Text
          position={[0, 3.4, -0.09]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
          outlineWidth={0.015}
          outlineColor="#1a5276"
        >
          DE-FERENCE
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.4}
          />
        </Text>
        <Text
          position={[0, 2.95, -0.09]}
          rotation={[0, Math.PI, 0]}
          fontSize={0.2}
          color="#ffd700"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          outlineWidth={0.01}
          outlineColor="#b8860b"
        >
          2026
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffd700"
            emissiveIntensity={0.4}
            metalness={0.5}
            roughness={0.3}
          />
        </Text>
      </Suspense>

      {/* LED accent strips */}
      <mesh position={[0, 3.85, -0.06]}>
        <boxGeometry args={[3.0, 0.04, 0.02]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 2.55, -0.06]}>
        <boxGeometry args={[3.0, 0.04, 0.02]} />
        <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

// City building component - gray concrete style
function Building({ x, z, seed }: { x: number; z: number; seed: number }) {
  const height = 5 + (seed % 12) * 1.5
  const width = 2 + (seed % 3) * 0.5
  const depth = 2 + ((seed * 7) % 3) * 0.5

  // Gray building colors
  const colors = ['#6c7a89', '#7f8c8d', '#95a5a6', '#808e9b', '#84817a']
  const color = colors[seed % colors.length]

  const windowRows = Math.floor(height / 0.8)
  const windowCols = 3

  return (
    <group position={[x, 0, z]}>
      {/* Main building body */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Windows - front face (+z) */}
      {Array.from({ length: windowRows }).map((_, floor) => (
        Array.from({ length: windowCols }).map((_, col) => (
          <mesh
            key={`front-${floor}-${col}`}
            position={[
              (col - 1) * (width * 0.28),
              0.4 + floor * 0.8,
              depth / 2 + 0.01
            ]}
          >
            <planeGeometry args={[width * 0.2, 0.5]} />
            <meshStandardMaterial color="#4a9eb8" metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )).flat()}

      {/* Windows - back face (-z) */}
      {Array.from({ length: windowRows }).map((_, floor) => (
        Array.from({ length: windowCols }).map((_, col) => (
          <mesh
            key={`back-${floor}-${col}`}
            position={[
              (col - 1) * (width * 0.28),
              0.4 + floor * 0.8,
              -depth / 2 - 0.01
            ]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[width * 0.2, 0.5]} />
            <meshStandardMaterial color="#4a9eb8" metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )).flat()}

      {/* Windows - left face (-x) */}
      {Array.from({ length: windowRows }).map((_, floor) => (
        Array.from({ length: 2 }).map((_, col) => (
          <mesh
            key={`left-${floor}-${col}`}
            position={[
              -width / 2 - 0.01,
              0.4 + floor * 0.8,
              (col - 0.5) * (depth * 0.4)
            ]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[depth * 0.25, 0.5]} />
            <meshStandardMaterial color="#4a9eb8" metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )).flat()}

      {/* Windows - right face (+x) */}
      {Array.from({ length: windowRows }).map((_, floor) => (
        Array.from({ length: 2 }).map((_, col) => (
          <mesh
            key={`right-${floor}-${col}`}
            position={[
              width / 2 + 0.01,
              0.4 + floor * 0.8,
              (col - 0.5) * (depth * 0.4)
            ]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[depth * 0.25, 0.5]} />
            <meshStandardMaterial color="#4a9eb8" metalness={0.7} roughness={0.3} />
          </mesh>
        ))
      )).flat()}

      {/* Rooftop edge */}
      <mesh position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width + 0.1, 0.1, depth + 0.1]} />
        <meshStandardMaterial color="#5d6d7e" />
      </mesh>
    </group>
  )
}

// Streetlight component
function Streetlight({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      {/* Pole */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3, 8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Light fixture */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.15]} />
        <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" emissiveIntensity={0.8} />
      </mesh>
      {/* Light glow */}
      <pointLight position={[0, 2.8, 0]} intensity={0.5} distance={4} color="#f1c40f" />
    </group>
  )
}

function Lane({ lane, z }: { lane: LaneType; z: number }) {
  const color = useMemo(() => {
    switch (lane.type) {
      case 'grass':
        return '#5d6d7e' // Dark sidewalk gray (보도블록)
      case 'road':
        return '#2c3e50' // Asphalt
      case 'river':
        return '#4a4a4a' // Train track gray
      default:
        return '#5d6d7e'
    }
  }, [lane.type])

  return (
    <group position={[0, 0, z]}>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[24, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>


      {/* Road markings - more realistic */}
      {lane.type === 'road' && (
        <>
          {/* Center line dashes */}
          {[-6, -3, 0, 3, 6].map((x, i) => (
            <mesh key={`center-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
              <planeGeometry args={[1, 0.1]} />
              <meshStandardMaterial color="#f1c40f" />
            </mesh>
          ))}
          {/* Edge lines */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, 0.01, 0]}>
            <planeGeometry args={[0.1, 1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[8, 0.01, 0]}>
            <planeGeometry args={[0.1, 1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </>
      )}

      {/* Train track markings */}
      {lane.type === 'river' && (
        <>
          {/* Railroad ties (침목) */}
          {[-8, -6, -4, -2, 0, 2, 4, 6, 8].map((x, i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
              <planeGeometry args={[0.3, 0.9]} />
              <meshStandardMaterial color="#5d4037" />
            </mesh>
          ))}
          {/* Rails */}
          <mesh position={[0, 0.03, 0.25]}>
            <boxGeometry args={[20, 0.04, 0.06]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.03, -0.25]}>
            <boxGeometry args={[20, 0.04, 0.06]} />
            <meshStandardMaterial color="#7f8c8d" metalness={0.8} />
          </mesh>
        </>
      )}

      {/* Obstacles */}
      {lane.obstacles.map((obstacle) => {
        switch (obstacle.type) {
          case 'car':
            return <Car key={obstacle.id} obstacle={obstacle} z={0} direction={lane.direction} />
          case 'truck':
            return <Truck key={obstacle.id} obstacle={obstacle} z={0} direction={lane.direction} />
          case 'log':
            return <Log key={obstacle.id} obstacle={obstacle} z={0} />
          case 'tree':
            return <Tree key={obstacle.id} obstacle={obstacle} z={0} />
          default:
            return null
        }
      })}
    </group>
  )
}

export function World() {
  const { lanes, playerPosition } = useGameStore()

  // Only render lanes within view distance
  const visibleLanes = useMemo(() => {
    const minZ = Math.max(0, Math.floor(playerPosition.z) - 5)
    const maxZ = Math.floor(playerPosition.z) + 25
    return lanes.slice(minZ, maxZ).map((lane, i) => ({
      lane,
      z: minZ + i
    }))
  }, [lanes, playerPosition.z])

  // Generate building positions
  const buildings = useMemo(() => {
    const result = []
    for (let z = -5; z < 100; z += 2) {
      // Left side buildings
      result.push({ x: -11 - Math.random() * 2, z, seed: z * 17 })
      if (z % 4 === 0) {
        result.push({ x: -14 - Math.random(), z, seed: z * 23 })
      }
      // Right side buildings
      result.push({ x: 11 + Math.random() * 2, z, seed: z * 31 })
      if (z % 4 === 2) {
        result.push({ x: 14 + Math.random(), z, seed: z * 37 })
      }
    }
    return result
  }, [])

  return (
    <group>
      {/* Starting area - sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -2]} receiveShadow>
        <planeGeometry args={[24, 5]} />
        <meshStandardMaterial color="#5d6d7e" />
      </mesh>

      {/* Lanes */}
      {visibleLanes.map(({ lane, z }) => (
        <Lane key={lane.id} lane={lane} z={z} />
      ))}

      {/* City buildings on both sides */}
      {buildings
        .filter(b => b.z > playerPosition.z - 10 && b.z < playerPosition.z + 30)
        .map((b, i) => (
          <Building key={i} x={b.x} z={b.z} seed={b.seed} />
        ))}

      {/* Streetlights */}
      {visibleLanes
        .filter((_, i) => i % 3 === 0)
        .map(({ z }, i) => (
          <group key={i}>
            <Streetlight x={-9} z={z} />
            <Streetlight x={9} z={z} />
          </group>
        ))}

      {/* DE-FERENCE Billboard at start */}
      {playerPosition.z < 15 && <Billboard x={0} z={5} />}
    </group>
  )
}
