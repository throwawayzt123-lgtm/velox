import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Html, useProgress, Environment } from '@react-three/drei';
import * as THREE from 'three';

//error showing white screen when loading the model, this is a custom loader component that can be used to show a loading screen while the model is being loaded. You can customize the appearance of the loader as needed.

useGLTF.preload('/models/gwagon.glb')
// Car Model Component with responsive auto-fit
const CarModel = ({ modelPath, autoRotate }) => {
  const { scene } = useGLTF(modelPath)
  const groupRef = useRef()
  const { viewport } = useThree()
  const clonedScene = useMemo(() => scene.clone(), [scene])

  // Auto rotate
  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.7
    }
  })

  // Responsive fit function
  const fitModelToViewport = () => {
    if (!groupRef.current) return
    
    const g = groupRef.current
    const box = new THREE.Box3().setFromObject(g)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    
    if (maxDim > 0) {
      // Adjust scale based on viewport width (mobile vs desktop)
      const isMobile = viewport.width < 6 // viewport units, roughly corresponds to mobile
      const baseScale = isMobile ? 3.0 : 4.0 
      const scale = Math.min(6.0, baseScale / maxDim)
      g.scale.setScalar(scale)
    }
    
    const center = box.getCenter(new THREE.Vector3())
    g.position.x += -center.x
    g.position.y += -center.y
    g.position.z += -center.z
  }

  useEffect(() => {
    fitModelToViewport()
  }, [scene, modelPath, clonedScene, viewport.width])

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Camera controller for responsive adjustments
const CameraController = () => {
  const { camera, size } = useThree()
  
  useEffect(() => {
    // Adjust camera position based on screen size
    const isMobile = size.width < 768
    camera.position.z = isMobile ? 3.5 : 1
    camera.fov = isMobile ? 9 : 14
    camera.updateProjectionMatrix()
  }, [size.width, camera])
  
  return null
}

// const fitModelToViewport = () => {
//   if (!groupRef.current) return

//   const g = groupRef.current

//   const box = new THREE.Box3().setFromObject(g)
//   if (box.isEmpty()) return // ✅ prevent invalid scaling

//   const size = box.getSize(new THREE.Vector3())
//   const maxDim = Math.max(size.x, size.y, size.z)

//   if (maxDim === 0) return // ✅ critical guard

//   const isMobile = viewport.width < 6
//   const baseScale = isMobile ? 3.0 : 4.0
//   const scale = Math.min(6.0, baseScale / maxDim)

//   g.scale.setScalar(scale)

//   const center = box.getCenter(new THREE.Vector3())
//   g.position.set(-center.x, -center.y, -center.z)
// }

// useEffect(() => {
//   const timeout = setTimeout(() => {
//     fitModelToViewport()
//   }, 100) // small delay fixes race condition

//   return () => clearTimeout(timeout)
// }, [clonedScene, viewport.width])

const CustomLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-black/80 via-gray-900/80 to-amber-500/60 backdrop-blur-xl rounded-3xl text-white border border-amber-400/30 shadow-2xl">
        <div className="mb-4 relative">
          <div className="w-16 h-16 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-orange-400 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
        </div>
        <p className="text-sm sm:text-base font-bold text-amber-300 mb-2">Loading 3D Model...</p>
        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div 
            style={{ width: `${progress}%` }} 
            className="h-full bg-gradient-to-r from-amber-400 via-amber-400 to-amber-300 rounded-full transition-all duration-300"
          />
        </div>
        <p className="text-xs sm:text-sm text-gray-300">{progress.toFixed(1)}% loaded</p>
      </div>
    </Html>
  );
};

const InteractiveCar3D = () => {
  const [currentCar, setCurrentCar] = useState('/models/gwagon.glb')
  const [autoRotate, setAutoRotate] = useState(true) 
  const [interactionEnabled, setInteractionEnabled] = useState(true)
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  const cars = [
    { model: '/models/gwagon.glb', name: 'G-Wagon' },

   
  ]

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-orange-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-amber-400 rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/2 w-2.5 h-2.5 bg-orange-300 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-gold-400 rounded-full opacity-70 animate-ping" style={{animationDelay: '3s'}}></div>
      </div>
      {/* Responsive Canvas Container */}
      <div className="w-full h-[80vh] z-10">
        <Canvas
          gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
          camera={{ position: [0, 0, 3.5], fov: 24 }}
          style={{ 
            width: '100%', 
            height: '100%', 
            touchAction: 'none',
             background: "red"
          }}
          
          dpr={[1, .9]} // Limit DPR for better performance on mobile
          performance={{ min: 1, max: 1.2 }}
        >
          <CameraController />
          
          {/* Luxurious multi-colored lighting setup */}
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 10, 7]}
            intensity={2.2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight
            position={[-5, 5, -5]}
            intensity={1.5}
            color="#000"
          />
          <directionalLight
            position={[0, -5, -10]}
            intensity={0.8}
            color="#000"
          />
          <pointLight
            position={[0, 8, 5]}
            intensity={2.0}
            color="#ffeb3b"
            distance={15}
          />
          <pointLight
            position={[-8, 3, 0]}
            intensity={1.2}
            color="#ff6b6b"
            distance={12}
          />
          
          <Environment preset="sunset" background={false} />
          
          {/* Car Model */}
          <Suspense fallback={<CustomLoader />}>
            <CarModel modelPath={currentCar} autoRotate={autoRotate && !isUserInteracting} />
          </Suspense>

          {/* Responsive OrbitControls */}
          <OrbitControls
            enablePan={false} // Disable panning on mobile for better UX
            enableZoom={false}
            enableRotate={interactionEnabled}
            autoRotate={false}
            // Mobile-specific settings
            rotateSpeed={0.5} // Slower rotation on mobile
            minDistance={1}
            maxDistance={5}
            onStart={() => {
              setIsUserInteracting(true)
              setAutoRotate(false)
            }}
            onEnd={() => {
              setIsUserInteracting(false)
              // Delay auto-rotate resume on mobile for better UX
              setTimeout(() => setAutoRotate(true), 2000)
            }}
          />
        </Canvas>
      </div>
     
      {/* Responsive Overlay Text */}
      <div className="pointer-events-none z-30 absolute inset-0">
        {/* Top-left - Hidden on very small screens */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 max-w-[200px] xs:max-w-xs sm:max-w-md">
          <div className="text-white drop-shadow-2xl bg-gradient-to-br from-black/50 via-gray-900/60 to-amber-500/40 backdrop-blur-xl rounded-2xl px-4 py-3 border border-amber-400/30 shadow-2xl shadow-amber-400/10">
            <h3 className="text-xs xs:text-sm sm:text-base font-bold uppercase tracking-widest text-amber-300 mb-1">
              ✨ Premium Fleet
            </h3>
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-tight bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">
              Luxury In Motion
            </h2>
          </div>
        </div>

        {/* Bottom-right - Adjusted for mobile */}
        <div className="absolute right-4 bottom-4 sm:right-6 sm:bottom-6 text-right max-w-[180px] xs:max-w-xs sm:max-w-sm">
          <div className="text-white drop-shadow-2xl bg-gradient-to-br from-black/50 via-gray-900/60 to-amber-500/40 backdrop-blur-xl rounded-2xl px-4 py-3 border border-amber-400/30 shadow-2xl shadow-amber-400/10">
            <h3 className="text-xs xs:text-sm sm:text-base font-bold uppercase tracking-widest text-amber-300 mb-1">
              🚗 Seamless Booking
            </h3>
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-black leading-tight bg-gradient-to-r from-white via-amber-100 to-amber-200 bg-clip-text text-transparent">
              Drive The Dream
            </h2>
          </div>
        </div>
      </div>

      {/* Responsive Car Selector & Controls */}
      <div className="relative z-20 bottom-4 flex flex-col items-center gap-2 px-4">
        <div className="flex flex-wrap justify-center gap-2 bg-black/40 rounded-full px-3 py-2 backdrop-blur-xl border border-amber-400/30">
          {cars.map((car, index) => (
            <button
              key={index}
              onClick={() => setCurrentCar(car.model)}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 text-xs sm:text-sm ${
                currentCar === car.model
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg scale-105'
                  : 'text-gray-300 hover:text-amber-300 bg-gray-800/40 hover:bg-amber-500/20 border border-amber-400/20'
              }`}
            >
              {car.name}
            </button>
          ))}
        </div>
        {/* <button
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-300 text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-lg hover:scale-105 border border-amber-400 ${autoRotate ? 'animate-pulse' : 'opacity-75'}`}
        >
          {autoRotate ? '⏸️ Pause' : '▶️ Play'}
        </button> */}
      </div>
    </section>
  )
}

export default InteractiveCar3D

