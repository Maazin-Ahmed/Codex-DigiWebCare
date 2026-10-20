import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import SignalFallback from './SignalFallback.jsx'

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(window.WebGL2RenderingContext && canvas.getContext('webgl2'))
  } catch {
    return false
  }
}

class WebGLBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    return this.state.hasError ? <SignalFallback /> : this.props.children
  }
}

function SignalCore() {
  const core = useRef(null)
  const ringPrimary = useRef(null)
  const ringSecondary = useRef(null)
  const nodes = useMemo(() => {
    const positions = new Float32Array(42 * 3)

    for (let index = 0; index < 42; index += 1) {
      const y = 1 - (index / 41) * 2
      const radius = Math.sqrt(1 - y * y)
      const angle = GOLDEN_ANGLE * index
      const offset = index * 3

      positions[offset] = Math.cos(angle) * radius * 1.62
      positions[offset + 1] = y * 1.62
      positions[offset + 2] = Math.sin(angle) * radius * 1.62
    }

    return positions
  }, [])

  useFrame((state, delta) => {
    if (!core.current || !ringPrimary.current || !ringSecondary.current) return

    const targetX = state.pointer.y * 0.12
    const targetY = state.pointer.x * 0.18

    core.current.rotation.x += (targetX - core.current.rotation.x) * delta * 2
    core.current.rotation.y += delta * 0.16 + (targetY - core.current.rotation.y) * delta * 2
    core.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.045
    ringPrimary.current.rotation.z += delta * 0.18
    ringPrimary.current.rotation.y -= delta * 0.08
    ringSecondary.current.rotation.x -= delta * 0.14
    ringSecondary.current.rotation.z += delta * 0.06
  })

  return (
    <group ref={core} rotation={[0.1, -0.4, 0]}>
      <pointLight color="#70e0d5" intensity={2.2} distance={5} />
      <pointLight color="#7774e8" intensity={1.3} distance={4} position={[2, -1, 1]} />

      <mesh>
        <icosahedronGeometry args={[1.18, 2]} />
        <meshPhysicalMaterial
          color="#70e0d5"
          emissive="#124d51"
          emissiveIntensity={0.65}
          metalness={0.72}
          roughness={0.2}
          clearcoat={0.8}
          clearcoatRoughness={0.16}
          transmission={0.12}
          transparent
          opacity={0.92}
        />
      </mesh>

      <mesh scale={1.012}>
        <icosahedronGeometry args={[1.18, 2]} />
        <meshBasicMaterial color="#d8fffa" transparent opacity={0.23} wireframe />
      </mesh>

      <mesh ref={ringPrimary} rotation={[0.8, 0.2, 0.35]}>
        <torusGeometry args={[1.78, 0.012, 8, 96]} />
        <meshBasicMaterial color="#70e0d5" transparent opacity={0.75} />
      </mesh>

      <mesh ref={ringSecondary} rotation={[0.15, 0.85, -0.2]}>
        <torusGeometry args={[1.48, 0.008, 8, 96]} />
        <meshBasicMaterial color="#7774e8" transparent opacity={0.7} />
      </mesh>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[nodes, 3]}
            count={nodes.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#d8fffa" size={0.035} sizeAttenuation transparent opacity={0.86} />
      </points>
    </group>
  )
}

function Hero3D() {
  const [mode, setMode] = useState('loading')

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 900px)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateMode = () => {
      setMode(mobileQuery.matches || motionQuery.matches ? 'static' : supportsWebGL() ? 'canvas' : 'static')
    }

    updateMode()
    mobileQuery.addEventListener('change', updateMode)
    motionQuery.addEventListener('change', updateMode)

    return () => {
      mobileQuery.removeEventListener('change', updateMode)
      motionQuery.removeEventListener('change', updateMode)
    }
  }, [])

  if (mode !== 'canvas') return <SignalFallback />

  return (
    <WebGLBoundary>
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 38 }}
        dpr={[1, 1.35]}
        frameloop="always"
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.24} />
          <directionalLight color="#f1efe8" intensity={1.4} position={[2, 3, 4]} />
          <SignalCore />
        </Suspense>
      </Canvas>
    </WebGLBoundary>
  )
}

export default Hero3D
