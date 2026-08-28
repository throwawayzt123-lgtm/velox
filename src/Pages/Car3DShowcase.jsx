import React, { useState, useRef, useEffect, Suspense, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls, useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { Link, useParams } from 'react-router-dom';
import carsData from '../carsData';
import CarCard, { Reveal, SectionLabel } from '../Components/CarCard';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const ArrowLeft = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const ArrowRight = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const Star = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const Play = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const Pause = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </svg>
);

const Drag = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l-3 3 3 3m8-6l3 3-3 3M12 3v18" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  3D scene                                                           */
/* ------------------------------------------------------------------ */

const Car3DModel = ({ modelPath, autoRotate }) => {
  const { scene } = useGLTF(modelPath);
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

    const g = groupRef.current;
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (maxDim > 0) {
      const isMobile = viewport.width < 6;
      const baseScale = isMobile ? 3.0 : 4.5;
      const scale = Math.min(7.0, baseScale / maxDim);
      g.scale.setScalar(scale);
    }

    const center = box.getCenter(new THREE.Vector3());
    g.position.x += -center.x;
    g.position.y += -center.y;
    g.position.z += -center.z;
  };

  useEffect(() => {
    fitModelToViewport();
  }, [scene, clonedScene, viewport.width, modelPath]);

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
    camera.position.z = isMobile ? 2.5 : 1.2;
    camera.fov = isMobile ? 20 : 12;
    camera.updateProjectionMatrix();
  }, [size.width, camera]);

  return null;
};

/* Overlay loader — lives in the DOM above the canvas, not inside it, so it
   covers the stage from first paint and can hold on for one frame after the
   GLB parses (useProgress flips to done before the model actually renders). */
const StageLoader = ({ onDone }) => {
  const { progress, active } = useProgress();
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (active || progress < 100) return undefined;

    // Let the renderer paint the model before we fade the cover away. Every
    // handle is tracked so nothing fires after unmount.
    let fadeTimer;
    let doneTimer;

    const raf = requestAnimationFrame(() => {
      fadeTimer = setTimeout(() => {
        setHiding(true);
        doneTimer = setTimeout(() => {
          setGone(true);
          onDone?.();
        }, 700);
      }, 250);
    });

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [active, progress, onDone]);

  if (gone) return null;

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-[#0a0a0b] transition-opacity duration-700 ${
        hiding ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Warm pool of light under the loader */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgb(var(--primary-500)_/_0.09),transparent_60%)] pointer-events-none" />

      <div className="relative flex flex-col items-center w-64 px-6">
        {/* Rotating ring */}
        <div className="relative w-16 h-16 mb-10">
          <span className="absolute inset-0 rounded-full border border-white/10" />
          <span className="absolute inset-0 rounded-full border border-transparent border-t-amber-400 animate-spin [animation-duration:1.1s]" />
          <span className="absolute inset-[30%] rounded-full bg-amber-400/70 animate-pulse" />
        </div>

        <div className="font-mono text-[10px] tracking-[0.3em] text-amber-400/80 mb-5 whitespace-nowrap">
          PREPARING MODEL
        </div>

        {/* Progress hairline */}
        <div className="w-full h-px bg-white/10 overflow-hidden">
          <div
            style={{ width: `${progress}%` }}
            className="h-full bg-amber-400 transition-all duration-300 ease-out"
          />
        </div>

        <div className="mt-5 font-mono text-xs text-white/45 tabular-nums">
          {String(Math.round(progress)).padStart(3, '0')}%
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const HERO_STAT_KEYS = ['Power', '0-60 mph', 'Top Speed', 'Engine'];

const Car3DShowcase = () => {
  const { id } = useParams();
  const [autoRotate, setAutoRotate] = useState(true);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [mounted, setMounted] = useState(false);

  const car = useMemo(() => carsData.find((c) => c.id === parseInt(id, 10)), [id]);

  const carouselImages = useMemo(
    () => car?.carouselImages || car?.images || [car?.image].filter(Boolean),
    [car]
  );

  const specs = useMemo(() => car?.specifications || [], [car]);

  const heroStats = useMemo(() => {
    const picked = HERO_STAT_KEYS.map((k) => specs.find((s) => s.label === k)).filter(Boolean);
    return (picked.length ? picked : specs).slice(0, 3);
  }, [specs]);

  const otherModels = useMemo(
    () => carsData.filter((c) => c.model3D && c.id !== car?.id).slice(0, 3),
    [car]
  );

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    setActiveImage(0);
  }, [id]);

  const nextImage = useCallback(
    () => setActiveImage((p) => (p + 1) % carouselImages.length),
    [carouselImages.length]
  );

  const prevImage = useCallback(
    () => setActiveImage((p) => (p - 1 + carouselImages.length) % carouselImages.length),
    [carouselImages.length]
  );

  /* Missing car, or a car with no 3D model — both need an exit, not a broken canvas */
  if (!car || !car.model3D) {
    const missingModel = Boolean(car) && !car.model3D;
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-mono text-xs tracking-[0.3em] text-amber-500/70 mb-6">
            {missingModel ? 'NO 3D MODEL' : 'ERROR / 404'}
          </div>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight mb-6">
            {missingModel ? (
              <>
                Not available in <span className="italic font-serif text-amber-200/90">3D</span>
              </>
            ) : (
              <>
                Vehicle not <span className="italic font-serif text-amber-200/90">found</span>
              </>
            )}
          </h1>
          <p className="text-white/45 text-sm mb-10 leading-relaxed">
            {missingModel
              ? `The ${car.name} doesn't have an interactive model yet — but the full details are ready for you.`
              : 'This model is no longer part of the collection, or the link has expired.'}
          </p>
          <Link
            to={missingModel ? `/car/${car.id}` : '/our-fleet'}
            className="group inline-flex items-center gap-3 border border-white/20 hover:border-amber-400/60 px-8 py-4 text-xs uppercase tracking-[0.25em] transition-colors duration-500"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1" />
            {missingModel ? 'View the details' : 'View the fleet'}
          </Link>
        </div>
      </div>
    );
  }

  const rating = car.rating || 4.8;

  return (
    <div className="bg-[#0a0a0b] text-white selection:bg-amber-400/25 overflow-x-clip">
      {/* ============================================================ */}
      {/*  STAGE — the 3D model is the hero                            */}
      {/* ============================================================ */}
      <section className="relative w-full h-[100svh] min-h-[620px] overflow-hidden bg-[#0a0a0b]">
        {/* Studio floor + warm key light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgb(var(--primary-500)_/_0.13),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0a0a0b] to-transparent pointer-events-none z-10" />

        {/* Giant ghost wordmark behind the car */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none select-none">
          <span className="text-[19vw] leading-none font-black tracking-tighter text-white/[0.04] whitespace-nowrap uppercase">
            {car.brand}
          </span>
        </div>

        {/* Canvas */}
        <div className="absolute inset-0">
          <Canvas
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0.3, 4.5], fov: 26 }}
            style={{ width: '100%', height: '100%' }}
            dpr={[1, 2]}
          >
            <CameraController />

            <ambientLight intensity={0.5} />
            <directionalLight position={[6, 8, 5]} intensity={1.4} />
            <directionalLight position={[-5, 5, -5]} intensity={0.8} />

            <Suspense fallback={null}>
              <Car3DModel modelPath={car.model3D} autoRotate={autoRotate && !isUserInteracting} />
            </Suspense>

            <Environment preset="sunset" background={false} />

            <OrbitControls
              enablePan={false}
              enableZoom={false}
              rotateSpeed={0.5}
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
        </div>

        {/* Loading overlay — covers the stage until the model is on screen */}
      <StageLoader />

      {/* Top rail — breadcrumb + rating */}
        <div className="absolute inset-x-0 top-0 z-20 pointer-events-none">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 pt-28 sm:pt-32 flex items-start justify-between gap-6">
            <Link
              to={`/car/${car.id}`}
              className={`group pointer-events-auto inline-flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 hover:text-amber-300 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              }`}
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1.5" />
              Details
            </Link>

            <div
              className={`inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.2em] text-white/60 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              }`}
            >
              <Star className="w-3 h-3 text-amber-400" />
              {rating.toFixed(1)}
            </div>
          </div>
        </div>

        {/* Bottom rail — identity, controls, price */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 pb-10 sm:pb-14">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div
                className={`transition-all duration-[1200ms] delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-5">
                  <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-amber-400/90">
                    INTERACTIVE / {car.brand?.toUpperCase()}
                  </span>
                  <span className="w-10 h-px bg-amber-400/40" />
                </div>

                <h1 className="text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.88] font-light tracking-[-0.03em]">
                  {car.name}
                </h1>
                <p className="mt-3 text-base sm:text-xl font-serif italic text-amber-100/70 tracking-wide">
                  {car.model}
                </p>
              </div>

              {/* Controls + price */}
              <div
                className={`flex flex-wrap items-end gap-x-8 gap-y-5 transition-all duration-1000 delay-500 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/35">
                  <Drag className="w-4 h-4" />
                  Drag to rotate
                </div>

                <button
                  type="button"
                  onClick={() => setAutoRotate(!autoRotate)}
                  aria-pressed={autoRotate}
                  className="group inline-flex items-center gap-3 border border-white/15 hover:border-amber-400/60 px-6 py-3.5 text-[10px] uppercase tracking-[0.25em] text-white/70 hover:text-amber-200 transition-colors duration-500"
                >
                  {autoRotate ? <Pause /> : <Play />}
                  {autoRotate ? 'Pause' : 'Rotate'}
                </button>

                <div className="lg:text-right">
                  <div className="text-[9px] uppercase tracking-[0.28em] text-amber-400/70 mb-2">
                    From
                  </div>
                  <div className="text-2xl sm:text-3xl font-light tracking-tight text-amber-200">
                    ${car.pricePerDay}
                    <span className="text-xs sm:text-sm text-white/40 ml-1.5">/ day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OVERVIEW                                                    */}
      {/* ============================================================ */}
      <section className="relative border-t border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="01" className="mb-8 sm:mb-12">
                  Overview
                </SectionLabel>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal delay={120}>
                <p className="text-xl sm:text-3xl lg:text-[2.1rem] font-light leading-[1.45] tracking-tight text-white/85">
                  {car.description}
                </p>
              </Reveal>

              {heroStats.length > 0 && (
                <Reveal delay={260}>
                  <div className="mt-14 flex flex-wrap gap-x-16 gap-y-8">
                    {heroStats.map((s) => (
                      <div key={s.label}>
                        <div className="text-[9px] uppercase tracking-[0.28em] text-white/40 mb-2">
                          {s.label}
                        </div>
                        <div className="text-2xl sm:text-3xl font-light tracking-tight">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  GALLERY                                                     */}
      {/* ============================================================ */}
      {carouselImages.length > 1 && (
        <section className="relative border-t border-white/[0.07]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
            <Reveal>
              <SectionLabel index="02" className="mb-8 sm:mb-12">
                Gallery
              </SectionLabel>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/8] overflow-hidden bg-[#111113] group">
                {carouselImages.map((img, i) => (
                  <img
                    key={img + i}
                    src={img}
                    alt={`${car.name} — view ${i + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      i === activeImage ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                    }`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 pointer-events-none" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />

                <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 font-mono text-xs sm:text-sm text-white/80 tracking-widest">
                  {String(activeImage + 1).padStart(2, '0')}
                  <span className="text-white/30"> / {String(carouselImages.length).padStart(2, '0')}</span>
                </div>

                <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 flex items-center gap-3">
                  <button
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="group/b w-11 h-11 flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-sm hover:border-amber-400/60 text-white/70 hover:text-amber-300 transition-colors duration-500"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover/b:-translate-x-0.5" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Next image"
                    className="group/b w-11 h-11 flex items-center justify-center border border-white/20 bg-black/30 backdrop-blur-sm hover:border-amber-400/60 text-white/70 hover:text-amber-300 transition-colors duration-500"
                  >
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/b:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-4 flex gap-3 sm:gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {carouselImages.map((img, i) => (
                  <button
                    key={img + i}
                    type="button"
                    onMouseEnter={() => setActiveImage(i)}
                    onFocus={() => setActiveImage(i)}
                    onClick={() => setActiveImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative shrink-0 w-28 sm:w-40 aspect-[16/10] overflow-hidden transition-all duration-500 ${
                      i === activeImage ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-amber-400 transition-all duration-700 ${
                        i === activeImage ? 'w-full' : 'w-0'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  SPECIFICATION                                               */}
      {/* ============================================================ */}
      {specs.length > 0 && (
        <section className="relative border-t border-white/[0.07]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4">
                <Reveal>
                  <SectionLabel index="03" className="mb-8">
                    Specification
                  </SectionLabel>
                  <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                    Every figure verified at delivery. Presented in factory specification unless
                    otherwise noted.
                  </p>
                </Reveal>
              </div>

              <div className="lg:col-span-8">
                <div className="border-t border-white/[0.09]">
                  {specs.map((spec, i) => (
                    <Reveal key={spec.label + i} delay={i * 45}>
                      <div className="group flex items-baseline justify-between gap-6 py-5 sm:py-6 border-b border-white/[0.09] hover:border-amber-400/30 transition-colors duration-500">
                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.24em] text-white/40 group-hover:text-amber-300/70 transition-colors duration-500">
                          {spec.label}
                        </span>
                        <span className="text-base sm:text-xl font-light text-white/90 text-right tracking-tight">
                          {spec.value}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  APPOINTMENTS                                                */}
      {/* ============================================================ */}
      {car.features?.length > 0 && (
        <section className="relative border-t border-white/[0.07]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
            <Reveal>
              <SectionLabel index="04" className="mb-8 sm:mb-12">
                Appointments
              </SectionLabel>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-1">
              {car.features.map((feature, i) => (
                <Reveal key={feature + i} delay={i * 55}>
                  <div className="group flex items-center gap-5 py-5 border-b border-white/[0.07]">
                    <span className="font-mono text-[10px] text-amber-500/50 group-hover:text-amber-400 transition-colors duration-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm sm:text-base font-light text-white/75 group-hover:text-white transition-colors duration-500">
                      {feature}
                    </span>
                    <span className="ml-auto w-0 group-hover:w-6 h-px bg-amber-400/60 transition-all duration-500" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================ */}
      {/*  RATES                                                       */}
      {/* ============================================================ */}
      <section className="relative border-t border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <Reveal>
            <SectionLabel index="05" className="mb-8 sm:mb-12">
              Rates
            </SectionLabel>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/[0.09]">
            {[
              { label: 'Daily', value: car.pricePerDay, unit: '24 hours' },
              {
                label: 'Weekly',
                value: car.pricePerWeek,
                unit: '7 days',
                note: 'Most requested',
                featured: true,
              },
              { label: 'Monthly', value: car.pricePerMonth, unit: '30 days' },
            ].map((tier, i) => (
              <Reveal key={tier.label} delay={i * 110}>
                <div
                  className={`group relative h-full border-r border-b border-white/[0.09] p-8 sm:p-10 transition-colors duration-700 ${
                    tier.featured ? 'bg-amber-400/[0.045]' : 'hover:bg-white/[0.025]'
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  )}
                  <div className="flex items-baseline justify-between mb-8">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-white/45">
                      {tier.label}
                    </span>
                    {tier.note && (
                      <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/90">
                        {tier.note}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-light text-white/40">$</span>
                    <span className="text-4xl sm:text-5xl font-light tracking-tighter text-white group-hover:text-amber-100 transition-colors duration-700">
                      {typeof tier.value === 'number' ? tier.value.toLocaleString() : tier.value}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-white/35 tracking-wide">{tier.unit}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  RESERVATION CTA                                             */}
      {/* ============================================================ */}
      <section className="relative border-t border-white/[0.07] overflow-hidden">
        {carouselImages[0] && (
          <div className="absolute inset-0">
            <img
              src={carouselImages[0]}
              alt=""
              className="w-full h-full object-cover opacity-[0.13]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/85 to-[#0a0a0b]" />
          </div>
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.11),transparent_70%)] pointer-events-none" />

        <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-36 text-center">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/70 mb-8">
              RESERVATION
            </div>
            <h2 className="text-[clamp(2rem,6.5vw,5rem)] leading-[0.95] font-light tracking-[-0.03em] max-w-4xl mx-auto">
              Ready to experience the{' '}
              <span className="font-serif italic text-amber-200/90">{car.name}</span>?
            </h2>
            <p className="mt-8 text-sm sm:text-base text-white/45 max-w-lg mx-auto leading-relaxed">
              Delivered to your door within two hours. Fully insured, fuelled and detailed — a
              specialist walks you through every control before you drive away.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact-us#form"
                className="group relative w-full sm:w-auto overflow-hidden bg-amber-400 text-black px-12 py-5 text-xs uppercase tracking-[0.28em] font-medium"
              >
                <span className="relative z-10 inline-flex items-center gap-3">
                  Reserve now
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </Link>

              <Link
                to={`/car/${car.id}`}
                className="w-full sm:w-auto border border-white/20 hover:border-white/50 px-12 py-5 text-xs uppercase tracking-[0.28em] text-white/80 hover:text-white transition-colors duration-500"
              >
                Full details
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MORE INTERACTIVE MODELS                                     */}
      {/* ============================================================ */}
      {otherModels.length > 0 && (
        <section className="relative border-t border-white/[0.07]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
            <Reveal>
              <SectionLabel index="06" className="mb-12 sm:mb-16">
                More in 3D
              </SectionLabel>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {otherModels.map((oc, i) => (
                <Reveal key={oc.id} delay={i * 120}>
                  <div className="flex flex-col h-full">
                    <CarCard car={oc} />
                    <Link
                      to={`/car-3d/${oc.id}`}
                      className="mt-5 inline-flex items-center justify-center gap-3 border border-white/15 hover:border-amber-400/60 py-4 text-[10px] uppercase tracking-[0.28em] text-white/70 hover:text-amber-200 transition-colors duration-500"
                    >
                      Explore in 3D
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Car3DShowcase;
