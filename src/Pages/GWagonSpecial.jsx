import React, { useState, useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, Html, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

// SVG Icons
const Star = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const Check = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

// 3D Car Model Component
const GWagonModel = ({ autoRotate }) => {
  const { scene } = useGLTF('/models/gwagon.glb');
  const groupRef = useRef();
  const { viewport } = useThree();
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

 const fitModelToViewport = () => {
  if (!groupRef.current) return;

  const box = new THREE.Box3().setFromObject(groupRef.current);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Center the model perfectly
  groupRef.current.position.set(-center.x, -center.y, -center.z);

  const maxDim = Math.max(size.x, size.y, size.z);

  if (maxDim > 0) {
    const isMobile = viewport.width < 6;

    // Bigger landscape presentation
    const scale = isMobile
      ? 3.8 / maxDim
      : 5.5 / maxDim;

    groupRef.current.scale.setScalar(scale);
  }
 };


  useEffect(() => {
    fitModelToViewport();
  }, [scene, clonedScene, viewport.width]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
};

const CameraController = () => {
  const { camera, size } = useThree();

  useEffect(() => {
    const isMobile = size.width < 768;

    camera.position.set(0, 0.3, isMobile ? 6 : 5);
    camera.fov = isMobile ? 40 : 28;
    camera.updateProjectionMatrix();
  }, [size.width, camera]);

  return null;
};


const ModelLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-4 bg-black/60 rounded-lg text-white backdrop-blur-sm">
        <div className="mb-2 font-semibold">Loading 3D Model</div>
        <div className="w-48 h-2 bg-gray-700 rounded overflow-hidden">
          <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-amber-400 to-amber-500" />
        </div>
        <div className="mt-2 text-sm text-gray-300">{Math.round(progress)}%</div>
      </div>
    </Html>
  );
};

const GWagonSpecial = () => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);

  useEffect(() => {
    // small entrance delay for aesthetic effect
    const t = setTimeout(() => setDetailsVisible(true), 260);
    return () => clearTimeout(t);
  }, []);

  const gwagonData = {
    name: "Mercedes-Benz G-Wagon",
    model: "G-Class (G63 AMG)",
    pricePerDay: 100,
    pricePerWeek: 1600,
    pricePerMonth: 4400,
    description: "Experience unparalleled luxury and capability with the iconic Mercedes-Benz G-Wagon. This legendary SUV combines timeless design, commanding presence, and off-road prowess with cutting-edge technology and premium comfort.",
    rating: 4.9,
    reviews: 847,
    features: [
      "4.0L V8 Twin-Turbo Engine",
      "4x4 Intelligent Drive System",
      "Adaptive Air Suspension",
      "Panoramic Sunroof",
      "Burmester Sound System",
      "Premium Leather Interior",
      "Heated Seats & Steering Wheel",
      "Advanced Driver Assistance",
      "360° Camera System",
      "Ambient Lighting"
    ],
    specifications: [
      { label: "Engine", value: "4.0L V8 Twin-Turbo" },
      { label: "Power", value: "585 HP" },
      { label: "Transmission", value: "9-Speed Automatic" },
      { label: "0-60 mph", value: "4.5 seconds" },
      { label: "Top Speed", value: "130 mph" },
      { label: "Seating", value: "5 Passengers" },
      { label: "Wheels", value: "21-inch Sport Alloys" },
      { label: "Year", value: "2024" }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-amber-500 text-white overflow-x-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-amber-400 rounded-full opacity-40 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-orange-400 rounded-full opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-50 animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-1/4 right-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1.5s'}}></div>
      </div>
      {/* Navigation Bar Spacer */}
      <div className="h-20 md:h-24"></div>

      {/* Hero Section with Full-Width 3D Model */}
      <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw]">
        {/* Full-bleed landscape 3D canvas */}

        <div className="relative w-screen h-[60vh] md:h-[70vh] lg:h-[85vh] xl:h-screen">
          <Canvas
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, 4], fov: 35 }}
            style={{ width: '100%', height: '100%' }}
            dpr={[1, 2]}
          >
            <CameraController />
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 7]} intensity={2.0} color="#ffffff" />
            <directionalLight position={[-5, 5, -5]} intensity={1.2} color="#ff6b35" />
            <pointLight position={[0, 5, 5]} intensity={1.5} color="#ffd700" />

            <Suspense fallback={<ModelLoader />}>
              <GWagonModel autoRotate={autoRotate && !isUserInteracting} />
            </Suspense>

            <Environment preset="sunset" background={false} />

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              enableRotate={true}
              autoRotate={false}
              rotateSpeed={0.6}
              minDistance={0.8}
              maxDistance={6}
              onStart={() => {
                setIsUserInteracting(true);
                setAutoRotate(false);
              }}
              onEnd={() => {
                setIsUserInteracting(false);
                setTimeout(() => setAutoRotate(true), 2000);
              }}
            />
          </Canvas>

          {/* Rating badge - top left */}
          <div className="absolute top-6 left-6 bg-gradient-to-r from-amber-400 to-amber-500 text-black px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2 shadow-lg z-10 border-2 border-amber-300">
            <Star />
            {gwagonData.rating}
          </div>

          {/* Animated centered bottom details panel */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-8 w-11/12 md:w-full max-w-4xl pointer-events-auto z-20 px-4">
            <div className={`mx-auto bg-black/75 backdrop-blur-lg border border-slate-700/50 rounded-3xl p-6 md:p-8 text-white shadow-2xl transition-all duration-700 ease-out ${detailsVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Title & Description */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold mb-1">{gwagonData.name}</h1>
                  <h2 className="text-lg md:text-xl text-amber-400 font-semibold mb-3">{gwagonData.model}</h2>
                  <p className="text-gray-300 text-xs md:text-sm leading-relaxed">{gwagonData.description}</p>
                </div>

                {/* Right: Pricing & CTA */}
                <div className="flex flex-col gap-4">
                  {/* Pricing Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-lg text-center border border-amber-400/30 hover:border-amber-400/60 transition-all">
                      <div className="text-amber-400 font-bold text-sm md:text-base">${gwagonData.pricePerDay}</div>
                      <div className="text-gray-300 text-xs">Per Day</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-lg text-center border border-amber-400/30 hover:border-amber-400/60 transition-all">
                      <div className="text-amber-400 font-bold text-sm md:text-base">${gwagonData.pricePerWeek}</div>
                      <div className="text-gray-300 text-xs">Per Week</div>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-lg text-center border border-amber-400/30 hover:border-amber-400/60 transition-all">
                      <div className="text-amber-400 font-bold text-sm md:text-base">${gwagonData.pricePerMonth}</div>
                      <div className="text-gray-300 text-xs">Per Month</div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-black py-2 md:py-3 rounded-lg font-bold text-sm md:text-base shadow hover:scale-105 transition-transform border border-amber-400">
                      Book Now
                    </button>
                    <button className="flex-1 bg-gray-800/50 text-white py-2 md:py-3 rounded-lg border border-gray-600 font-semibold text-sm md:text-base hover:bg-gray-700/50 hover:border-amber-400/50 transition-all">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Specifications */}
      <section className="py-16 md:py-20 px-4 md:px-8 lg:px-12 container mx-auto">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-12 md:mb-16 text-center">
            Technical <span className="bg-gradient-to-r from-amber-400 to-amber-400 bg-clip-text text-transparent">Specifications</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {gwagonData.specifications.map((spec, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-amber-500/40 backdrop-blur border border-amber-400/30 rounded-xl p-4 md:p-6 text-center hover:border-amber-400/60 hover:shadow-lg hover:shadow-amber-400/20 transition-all duration-300 group"
              >
                <div className="text-amber-400 font-bold text-xl md:text-2xl mb-2 group-hover:text-amber-300 transition-colors">{spec.value}</div>
                <div className="text-gray-300 text-xs md:text-sm font-medium group-hover:text-white transition-colors">{spec.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 md:py-20 px-4 md:px-8 lg:px-12 container mx-auto">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/60 via-gray-900/60 to-amber-500/40 backdrop-blur border border-amber-400/30 rounded-3xl p-8 md:p-12 text-center shadow-2xl shadow-amber-400/10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 md:mb-8">
            The Ultimate <span className="bg-gradient-to-r from-amber-400 to-amber-400 bg-clip-text text-transparent">Luxury Experience</span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-8 md:mb-10 leading-relaxed">
            Drive the iconic G-Wagon and experience luxury redefined. From its commanding presence on the road to its premium interiors and cutting-edge technology, every moment is an indulgence. Perfect for those who demand the best.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center">
            <button className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-500 text-black py-3 md:py-4 px-8 md:px-12 rounded-xl font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-amber-400/50 hover:scale-105">
              Reserve Your G-Wagon
            </button>
            <Link
              to="/our-fleet"
              className="bg-gray-700/50 hover:bg-gray-600/50 text-white py-3 md:py-4 px-8 md:px-12 rounded-xl font-bold text-base md:text-lg transition-all border border-gray-600 hover:border-amber-400/50 inline-block hover:scale-105"
            >
              Explore Other Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-8 md:h-12"></div>
    </div>
  );
};

export default GWagonSpecial;
