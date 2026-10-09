import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Float, Lightformer, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/*
 * The hero's 3D "AI core": a liquid-metal mind wrapped in a federated
 * network cage. It leans toward the cursor and spins up as you scroll.
 */

function uniqueVertices(geometry) {
  const pos = geometry.attributes.position
  const seen = new Map()
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i)
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`
    if (!seen.has(key)) seen.set(key, v)
  }
  return [...seen.values()]
}

function useGlowTexture() {
  return useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,150,70,0.9)')
    g.addColorStop(0.35, 'rgba(255,90,20,0.35)')
    g.addColorStop(1, 'rgba(255,60,10,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
}

function Core({ pointer, progress }) {
  const { viewport } = useThree()
  const root = useRef()
  const cage = useRef()
  const outer = useRef()
  const ring = useRef()
  const packet = useRef()
  const nodes = useRef()

  const cageGeo = useMemo(() => new THREE.IcosahedronGeometry(1.7, 1), [])
  const cageEdges = useMemo(() => new THREE.EdgesGeometry(cageGeo), [cageGeo])
  const outerEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(2.35, 0)), [])
  const vertices = useMemo(() => uniqueVertices(cageGeo), [cageGeo])
  const glow = useGlowTexture()

  useEffect(() => {
    const m = new THREE.Matrix4()
    vertices.forEach((v, i) => {
      m.makeTranslation(v.x, v.y, v.z)
      nodes.current.setMatrixAt(i, m)
    })
    nodes.current.instanceMatrix.needsUpdate = true
  }, [vertices])

  // responsive placement: right-of-centre on desktop, lower & centred on portrait screens
  const portrait = viewport.aspect < 1
  const scale = portrait ? Math.min(0.78, viewport.width / 5.4) : Math.min(0.82, viewport.height / 6)
  const x = portrait ? 0 : viewport.width * 0.08
  const y = portrait ? -viewport.height * 0.2 : -viewport.height * 0.06

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const p = progress.current
    const r = root.current
    r.rotation.y = THREE.MathUtils.damp(r.rotation.y, pointer.current.x * 0.55 + p * Math.PI * 1.4, 3, dt)
    r.rotation.x = THREE.MathUtils.damp(r.rotation.x, -pointer.current.y * 0.35, 3, dt)
    cage.current.rotation.y += dt * 0.18
    cage.current.rotation.z += dt * 0.05
    outer.current.rotation.y -= dt * 0.1
    outer.current.rotation.x += dt * 0.04
    const a = t * 0.9
    packet.current.position.set(Math.cos(a) * 2.75, 0, Math.sin(a) * 2.75)
    ring.current.rotation.z = Math.sin(t * 0.3) * 0.15
  })

  return (
    <group position={[x, y, 0]} scale={scale}>
      <mesh position={[0, 0, -1.6]}>
        <planeGeometry args={[7.5, 7.5]} />
        <meshBasicMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <group ref={root}>
        <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.7}>
          <mesh>
            <sphereGeometry args={[1.05, 128, 128]} />
            <MeshDistortMaterial
              color="#2b0c05"
              metalness={0.7}
              roughness={0.32}
              clearcoat={1}
              clearcoatRoughness={0.22}
              distort={0.36}
              speed={1.6}
              envMapIntensity={1.8}
            />
          </mesh>

          <group ref={cage}>
            <lineSegments geometry={cageEdges}>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.32} />
            </lineSegments>
            <instancedMesh ref={nodes} args={[undefined, undefined, vertices.length]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial color="#fff2e8" />
            </instancedMesh>
          </group>

          <lineSegments ref={outer} geometry={outerEdges}>
            <lineBasicMaterial color="#ffb07a" transparent opacity={0.16} />
          </lineSegments>

          <group ref={ring} rotation={[Math.PI / 2.3, 0, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[2.75, 0.006, 8, 160]} />
              <meshBasicMaterial color="#ffd0b0" transparent opacity={0.45} />
            </mesh>
            <mesh ref={packet}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </Float>
      </group>
      <Sparkles count={70} scale={[7, 6, 4]} size={2.2} speed={0.35} color="#ffd8bd" opacity={0.7} />
    </group>
  )
}

export default function HeroScene({ progress, active = true }) {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8], fov: 35 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      resize={{ scroll: false, offsetSize: true }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.25} />
      <pointLight position={[3.5, 2.5, 3]} intensity={60} color="#ff7a1a" />
      <pointLight position={[-3.5, -1.5, 2.5]} intensity={40} color="#ff2a10" />
      <directionalLight position={[0, 4, -4]} intensity={2.2} color="#ffffff" />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#160604']} />
        <Lightformer form="circle" intensity={4} color="#ff8a3d" position={[0, 5, -1]} rotation={[Math.PI / 2, 0, 0]} scale={8} />
        <Lightformer form="circle" intensity={3} color="#ff3b1a" position={[-5, 0, 1]} rotation={[0, Math.PI / 2, 0]} scale={6} />
        <Lightformer form="circle" intensity={2.5} color="#ff6a1a" position={[5, -1, 1]} rotation={[0, -Math.PI / 2, 0]} scale={6} />
        <Lightformer form="circle" intensity={6} color="#ffffff" position={[3, 2, 5]} scale={1.2} />
        <Lightformer form="circle" intensity={1.5} color="#ffd2a8" position={[0, -5, 1]} rotation={[-Math.PI / 2, 0, 0]} scale={8} />
      </Environment>
      <Core pointer={pointer} progress={progress} />
    </Canvas>
  )
}
