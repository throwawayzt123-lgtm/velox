import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, useProgress, Environment } from '@react-three/drei';
import * as THREE from 'three';
import carsData from '../carsData';

useGLTF.preload('/models/gwagon.glb');

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const ArrowRight = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const Drag = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l-3 3 3 3m8-6l3 3-3 3M12 3v18" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */

const CarModel = ({ modelPath, autoRotate }) => {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef();
  const { viewport } = useThree();
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  useFrame((state, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.7;
    }
  });

  const fitModelToViewport = () => {
    if (!groupRef.current) return;

    const g = groupRef.current;
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      const isMobile = viewport.width < 6;
      const baseScale = isMobile ? 3.0 : 4.0;
      const scale = Math.min(6.0, baseScale / maxDim);
      g.scale.setScalar(scale);
    }

    const center = box.getCenter(new THREE.Vector3());
    g.position.x += -center.x;
    g.position.y += -center.y;
    g.position.z += -center.z;
  };

  useEffect(() => {
    fitModelToViewport();
  }, [scene, modelPath, clonedScene, viewport.width]);

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
    camera.position.z = isMobile ? 3.5 : 1;
    camera.fov = isMobile ? 9 : 14;
    camera.updateProjectionMatrix();
  }, [size.width, camera]);

  return null;
};

/* DOM overlay loader — sits above the canvas so the stage is never bare */
const StageLoader = () => {
  const { progress, active } = useProgress();
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (active || progress < 100) return undefined;

    let fadeTimer;
    let doneTimer;
    const raf = requestAnimationFrame(() => {
      fadeTimer = setTimeout(() => {
        setHiding(true);
        doneTimer = setTimeout(() => setGone(true), 700);
      }, 200);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [active, progress]);

  if (gone) return null;

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-[#0a0a0b] transition-opacity duration-700 ${
        hiding ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center w-52 px-6">
        <div className="relative w-12 h-12 mb-8">
          <span className="absolute inset-0 rounded-full border border-white/10" />
          <span className="absolute inset-0 rounded-full border border-transparent border-t-amber-400 animate-spin [animation-duration:1.1s]" />
        </div>
        <div className="font-mono text-[10px] tracking-[0.3em] text-amber-400/80 mb-4 whitespace-nowrap">
          PREPARING MODEL
        </div>
        <div className="w-full h-px bg-white/10 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-amber-400 transition-all duration-300 ease-out"
          />
        </div>
        <div className="mt-4 font-mono text-xs text-white/45 tabular-nums">
          {String(Math.round(progress)).padStart(3, '0')}%
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

/* The car this showcase renders — kept in sync with the fleet data */
const SHOWCASE_ID = 5;

const InteractiveCar3D = () => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  /* Rotation is opt-in on touch devices so a swipe scrolls the page
     instead of being swallowed by OrbitControls. */
  const [touchRotateEnabled, setTouchRotateEnabled] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const car = useMemo(
    () => carsData.find((c) => c.id === SHOWCASE_ID) || carsData[0],
    []
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  const specs = useMemo(() => (car?.specifications || []).slice(0, 3), [car]);

  /* Pointer rotation is always on for mouse users; gated on touch. */
  const rotateEnabled = !isTouch || touchRotateEnabled;

  return (
    <section className="relative w-full bg-[#0a0a0b] text-white border-y border-white/[0.07] overflow-hidden">
      {/* Warm floor light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgb(var(--primary-500)_/_0.10),transparent_65%)] pointer-events-none" />

      {/* Ghost wordmark */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span className="text-[18vw] leading-none font-black tracking-tighter text-white/[0.035] whitespace-nowrap uppercase">
          {car.brand}
        </span>
      </div>

      <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 py-14 sm:py-20">
        {/* Heading */}
        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-amber-500/70">
            ✦
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/45">
            Luxury in motion
          </span>
          <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
        </div>

        <div className="relative">
          {/* ---------------- STAGE ---------------- */}
          <div>
            <div className="relative h-[38vh] min-h-[240px] sm:h-[52vh] lg:h-[72vh] lg:min-h-[560px]">
              <Canvas
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                camera={{ position: [0, 0, 3.5], fov: 24 }}
                style={{
                  width: '100%',
                  height: '100%',
                  /* Let vertical swipes scroll the page unless the viewer
                     has explicitly enabled rotation on touch. */
                  touchAction: rotateEnabled && isTouch ? 'none' : 'pan-y',
                }}
                dpr={[1, 1.5]}
              >
                <CameraController />

                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 7]} intensity={2.2} color="#ffffff" />
                <directionalLight position={[-5, 5, -5]} intensity={1.2} color="#404040" />
                <pointLight position={[0, 8, 5]} intensity={1.6} color="#ffd28a" distance={15} />

                <Environment preset="sunset" background={false} />

                <Suspense fallback={null}>
                  <CarModel
                    modelPath={car.model3D || '/models/gwagon.glb'}
                    autoRotate={autoRotate && !isUserInteracting}
                  />
                </Suspense>

                <OrbitControls
                  enablePan={false}
                  enableZoom={false}
                  enableRotate={rotateEnabled}
                  autoRotate={false}
                  rotateSpeed={0.5}
                  minDistance={1}
                  maxDistance={5}
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

              <StageLoader />

              {/* Interaction hint / touch toggle */}
              {/* Right-aligned on desktop so it clears the overlaid copy */}
              <div className="absolute bottom-0 left-0 lg:left-auto lg:right-0 z-20">
                {isTouch ? (
                  <button
                    type="button"
                    onClick={() => setTouchRotateEnabled((v) => !v)}
                    aria-pressed={touchRotateEnabled}
                    className={`inline-flex items-center gap-2.5 border px-4 py-2.5 text-[9px] uppercase tracking-[0.22em] transition-colors duration-500 ${
                      touchRotateEnabled
                        ? 'border-amber-400/60 text-amber-200 bg-amber-400/10'
                        : 'border-white/15 text-white/50'
                    }`}
                  >
                    <Drag className="w-3.5 h-3.5" />
                    {touchRotateEnabled ? 'Rotating — tap to scroll' : 'Tap to rotate'}
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2.5 text-[9px] uppercase tracking-[0.22em] text-white/30">
                    <Drag className="w-3.5 h-3.5" />
                    Drag to rotate
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ---------------- COPY ----------------
              Stacks under the stage on mobile; overlays its lower-left
              on desktop so the model keeps the full width. */}
          <div className="mt-8 lg:mt-0 lg:absolute lg:left-0 lg:bottom-0 lg:z-20 lg:max-w-md lg:pointer-events-none [&_a]:pointer-events-auto">
            <div className="text-[9px] uppercase tracking-[0.28em] text-white/35 mb-3">
              {car.brand}
            </div>

            <h2 className="text-[clamp(1.75rem,5vw,3.25rem)] leading-[0.98] font-light tracking-[-0.03em]">
              {car.name}
            </h2>
            <p className="mt-2 text-base sm:text-lg font-serif italic text-amber-100/70">
              {car.model}
            </p>

            {specs.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/[0.09] pt-6">
                {specs.map((s) => (
                  <div key={s.label} className="min-w-0">
                    <div className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1.5 truncate">
                      {s.label}
                    </div>
                    <div className="text-sm sm:text-base font-light text-white/80 truncate">
                      {s.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-light text-amber-200">
                ${car.pricePerDay}
              </span>
              <span className="text-xs text-white/35 uppercase tracking-[0.2em]">/ day</span>
            </div>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                to={car.model3D ? `/car-3d/${car.id}` : `/car/${car.id}`}
                className="group relative overflow-hidden bg-amber-400 text-black px-8 py-4 text-[10px] uppercase tracking-[0.26em] font-medium text-center"
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-3">
                  Explore in 3D
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </Link>

              <Link
                to={`/car/${car.id}`}
                className="border border-white/20 hover:border-white/50 px-8 py-4 text-[10px] uppercase tracking-[0.26em] text-white/80 hover:text-white transition-colors duration-500 text-center"
              >
                Full details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveCar3D;
