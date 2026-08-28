import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import carsData from '../carsData';
import { RemoveScroll } from 'react-remove-scroll';

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

const Close = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Star = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const Cube = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5-9 5m18 0v9l-9 5m9-14l-9 5m0 9l-9-5v-9m9 14v-9m-9-5l9 5" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll wrapper                                           */
/* ------------------------------------------------------------------ */

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-[2px]'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Small primitives                                                   */
/* ------------------------------------------------------------------ */

const SectionLabel = ({ index, children }) => (
  <div className="flex items-center gap-4 mb-8 sm:mb-12">
    <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-amber-500/70">{index}</span>
    <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/45">{children}</span>
    <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Derived spec helpers — car data is uneven, so degrade gracefully   */
/* ------------------------------------------------------------------ */

const FALLBACK_SPECS = [
  { label: 'Transmission', value: 'Automatic' },
  { label: 'Seating', value: '4 Passengers' },
  { label: 'Fuel Type', value: 'Premium' },
  { label: 'Year', value: '2024' },
];

const HERO_STAT_KEYS = ['Power', '0-60 mph', 'Top Speed', 'Engine'];

const CarDetail = () => {
  const { id } = useParams();
  const car = useMemo(() => carsData.find((c) => c.id === parseInt(id, 10)), [id]);

  const [activeImage, setActiveImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  const carImages = useMemo(
    () => (car?.images?.length ? car.images : [car?.image].filter(Boolean)),
    [car]
  );

  const specs = useMemo(
    () => (car?.specifications?.length ? car.specifications : FALLBACK_SPECS),
    [car]
  );

  const heroStats = useMemo(() => {
    const picked = HERO_STAT_KEYS.map((key) => specs.find((s) => s.label === key)).filter(Boolean);
    return (picked.length ? picked : specs).slice(0, 3);
  }, [specs]);

  const relatedCars = useMemo(() => {
    if (!car) return [];
    const sameBrand = carsData.filter((c) => c.id !== car.id && c.brand === car.brand);
    const others = carsData.filter((c) => c.id !== car.id && c.brand !== car.brand);
    return [...sameBrand, ...others].slice(0, 3);
  }, [car]);

  /* Parallax for the hero — rAF-throttled scroll listener */
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  /* Reset gallery when navigating between cars */
  useEffect(() => {
    setActiveImage(0);
    setIsModalOpen(false);
  }, [id]);

  const openModal = useCallback((index) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const nextModalImage = useCallback(
    () => setModalImageIndex((p) => (p + 1) % carImages.length),
    [carImages.length]
  );

  const prevModalImage = useCallback(
    () => setModalImageIndex((p) => (p - 1 + carImages.length) % carImages.length),
    [carImages.length]
  );

  /* Keyboard control for the lightbox */
  useEffect(() => {
    if (!isModalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') nextModalImage();
      if (e.key === 'ArrowLeft') prevModalImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isModalOpen, closeModal, nextModalImage, prevModalImage]);

  if (!car) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="font-mono text-xs tracking-[0.3em] text-amber-500/70 mb-6">ERROR / 404</div>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tight mb-6">
            Vehicle not <span className="italic font-serif text-amber-200/90">found</span>
          </h1>
          <p className="text-white/45 text-sm mb-10 leading-relaxed">
            This model is no longer part of the collection, or the link has expired.
          </p>
          <Link
            to="/our-fleet"
            className="group inline-flex items-center gap-3 border border-white/20 hover:border-amber-400/60 px-8 py-4 text-xs uppercase tracking-[0.25em] transition-colors duration-500"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1" />
            View the fleet
          </Link>
        </div>
      </div>
    );
  }

  const heroImage = carImages[0] || car.image;
  const rating = car.rating || 4.8;

  return (
    <RemoveScroll enabled={isModalOpen}>
      <div className="bg-[#0a0a0b] text-white selection:bg-amber-400/25 overflow-x-clip">
        {/* ============================================================ */}
        {/*  HERO — cinematic, full-bleed, parallax                      */}
        {/* ============================================================ */}
        <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(${1 + Math.min(scrollY, 800) * 0.00018})`,
            }}
          >
            {heroImage && (
              <img
                src={heroImage}
                alt={`${car.name} ${car.model}`}
                className={`w-full h-full object-cover transition-all duration-[2000ms] ease-out ${
                  mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
                fetchpriority="high"
              />
            )}
          </div>

          {/* Cinematic grading */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/45 to-[#0a0a0b]/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/85 via-transparent to-[#0a0a0b]/60" />
          <div className="absolute -bottom-1/3 left-1/2 -translate-x-1/2 w-[140%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.16),transparent_65%)] pointer-events-none" />

          {/* Giant ghost wordmark */}
          <div
            className="absolute inset-x-0 bottom-[16%] flex justify-center pointer-events-none select-none"
            style={{ transform: `translate3d(0, ${scrollY * -0.12}px, 0)` }}
          >
            <span className="text-[19vw] leading-none font-black tracking-tighter text-white/[0.045] whitespace-nowrap uppercase">
              {car.brand}
            </span>
          </div>

          <div className="relative h-full container mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-end pb-16 sm:pb-20">
            <div
              className={`mb-auto pt-28 sm:pt-32 transition-all duration-1000 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              }`}
            >
              <Link
                to="/our-fleet"
                className="group inline-flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 hover:text-amber-300 transition-colors duration-500"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1.5" />
                The Collection
              </Link>
            </div>

            <div className="max-w-4xl">
              <div
                className={`flex flex-wrap items-center gap-4 sm:gap-6 mb-6 transition-all duration-1000 delay-200 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-amber-400/90">
                  {String(car.id).padStart(2, '0')} / {car.brand?.toUpperCase()}
                </span>
                <span className="w-10 h-px bg-amber-400/40" />
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs tracking-[0.2em] text-white/60">
                  <Star className="w-3 h-3 text-amber-400" />
                  {rating.toFixed(1)}
                </span>
              </div>

              <h1
                className={`text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.86] font-light tracking-[-0.03em] transition-all duration-[1200ms] delay-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                {car.name}
              </h1>

              <p
                className={`mt-4 sm:mt-6 text-lg sm:text-2xl font-serif italic text-amber-100/70 tracking-wide transition-all duration-1000 delay-500 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {car.model}
              </p>

              <div
                className={`mt-10 sm:mt-14 flex flex-wrap items-end gap-x-10 sm:gap-x-16 gap-y-6 transition-all duration-1000 delay-[650ms] ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                {heroStats.map((s) => (
                  <div key={s.label}>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-white/40 mb-2">
                      {s.label}
                    </div>
                    <div className="text-xl sm:text-3xl font-light tracking-tight text-white">{s.value}</div>
                  </div>
                ))}
                <div className="sm:ml-auto">
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-amber-400/70 mb-2">
                    From
                  </div>
                  <div className="text-xl sm:text-3xl font-light tracking-tight text-amber-200">
                    ${car.pricePerDay}
                    <span className="text-xs sm:text-sm text-white/40 ml-1.5">/ day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
            <span className="relative w-px h-12 bg-white/15 overflow-hidden">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-amber-400/80 animate-scroll-cue" />
            </span>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  OVERVIEW — editorial split                                  */}
        {/* ============================================================ */}
        <section className="relative border-t border-white/[0.07]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4">
                <Reveal>
                  <SectionLabel index="01">Overview</SectionLabel>
                </Reveal>
              </div>
              <div className="lg:col-span-8">
                <Reveal delay={120}>
                  <p className="text-xl sm:text-3xl lg:text-[2.1rem] font-light leading-[1.45] tracking-tight text-white/85">
                    {car.description}
                  </p>
                </Reveal>
                <Reveal delay={260}>
                  <div className="mt-12 flex flex-wrap gap-3">
                    {(car.features || []).slice(0, 6).map((f) => (
                      <span
                        key={f}
                        className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-white/55 border border-white/10 rounded-full px-4 py-2 hover:border-amber-400/50 hover:text-amber-100 transition-colors duration-500"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  GALLERY                                                     */}
        {/* ============================================================ */}
        {carImages.length > 0 && (
          <section className="relative border-t border-white/[0.07]">
            <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
              <Reveal>
                <SectionLabel index="02">Gallery</SectionLabel>
              </Reveal>

              <Reveal delay={100}>
                <button
                  type="button"
                  onClick={() => openModal(activeImage)}
                  className="group relative w-full aspect-[16/10] sm:aspect-[16/8] overflow-hidden bg-[#111113] cursor-zoom-in"
                >
                  {carImages.map((img, i) => (
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-amber-400/40 transition-all duration-700" />

                  <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 flex items-center gap-4">
                    <span className="font-mono text-xs sm:text-sm text-white/80 tracking-widest">
                      {String(activeImage + 1).padStart(2, '0')}
                      <span className="text-white/30"> / {String(carImages.length).padStart(2, '0')}</span>
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.28em] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Click to expand
                    </span>
                  </div>
                </button>
              </Reveal>

              {carImages.length > 1 && (
                <Reveal delay={180}>
                  <div className="mt-4 flex gap-3 sm:gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {carImages.map((img, i) => (
                      <button
                        key={img + i}
                        type="button"
                        onMouseEnter={() => setActiveImage(i)}
                        onFocus={() => setActiveImage(i)}
                        onClick={() => {
                          setActiveImage(i);
                          openModal(i);
                        }}
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
              )}
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/*  SPECIFICATION — hairline table, no boxes                    */}
        {/* ============================================================ */}
        <section className="relative border-t border-white/[0.07]">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
              <div className="lg:col-span-4">
                <Reveal>
                  <SectionLabel index="03">Specification</SectionLabel>
                  <p className="text-sm text-white/40 leading-relaxed max-w-xs -mt-4">
                    Every figure verified at delivery. Vehicles are presented in factory
                    specification unless otherwise noted.
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

        {/* ============================================================ */}
        {/*  APPOINTMENTS / FEATURES                                     */}
        {/* ============================================================ */}
        {car.features?.length > 0 && (
          <section className="relative border-t border-white/[0.07]">
            <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
              <Reveal>
                <SectionLabel index="04">Appointments</SectionLabel>
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
              <SectionLabel index="05">Rates</SectionLabel>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/[0.09]">
              {[
                { label: 'Daily', value: car.pricePerDay, unit: '24 hours' },
                { label: 'Weekly', value: car.pricePerWeek, unit: '7 days', note: 'Most requested', featured: true },
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
                      <span className="text-[10px] uppercase tracking-[0.28em] text-white/45">{tier.label}</span>
                      {tier.note && (
                        <span className="text-[9px] uppercase tracking-[0.2em] text-amber-400/90">{tier.note}</span>
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
          {heroImage && (
            <div className="absolute inset-0">
              <img src={heroImage} alt="" className="w-full h-full object-cover opacity-[0.13]" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/85 to-[#0a0a0b]" />
            </div>
          )}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.11),transparent_70%)] pointer-events-none" />

          <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-36 text-center">
            <Reveal>
              <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/70 mb-8">RESERVATION</div>
              <h2 className="text-[clamp(2rem,6.5vw,5rem)] leading-[0.95] font-light tracking-[-0.03em] max-w-4xl mx-auto">
                Take the <span className="font-serif italic text-amber-200/90">{car.name}</span>
                <br className="hidden sm:block" /> for yourself.
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
                  to="/contact-us#form"
                  className="w-full sm:w-auto border border-white/20 hover:border-white/50 px-12 py-5 text-xs uppercase tracking-[0.28em] text-white/80 hover:text-white transition-colors duration-500"
                >
                  Speak to a specialist
                </Link>

                {car.model3D && (
                  <Link
                    to={`/car-3d/${car.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 text-xs uppercase tracking-[0.28em] text-amber-200/80 hover:text-amber-200 transition-colors duration-500"
                  >
                    <Cube className="w-4 h-4" />
                    View in 3D
                  </Link>
                )}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============================================================ */}
        {/*  ALSO IN THE COLLECTION                                      */}
        {/* ============================================================ */}
        {relatedCars.length > 0 && (
          <section className="relative border-t border-white/[0.07]">
            <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
              <Reveal>
                <SectionLabel index="06">Also in the collection</SectionLabel>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {relatedCars.map((rc, i) => (
                  <Reveal key={rc.id} delay={i * 120}>
                    <Link to={`/car/${rc.id}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden bg-[#111113]">
                        <img
                          src={rc.previewImage || rc.image}
                          alt={`${rc.name} ${rc.model}`}
                          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-amber-400/40 transition-all duration-700" />
                      </div>
                      <div className="mt-5 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[9px] uppercase tracking-[0.28em] text-white/35 mb-2">{rc.brand}</div>
                          <div className="text-lg font-light tracking-tight text-white group-hover:text-amber-100 transition-colors duration-500">
                            {rc.name}
                          </div>
                          <div className="text-xs text-white/40 mt-1 font-serif italic">{rc.model}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-base font-light text-amber-200/90">${rc.pricePerDay}</div>
                          <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-1">/ day</div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ============================================================== */}
      {/*  LIGHTBOX                                                      */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[60] bg-[#0a0a0b]/95 backdrop-blur-xl flex flex-col animate-fade-in"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex items-center justify-between px-6 sm:px-10 py-6 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-white/35 mb-1">{car.brand}</div>
              <div className="text-sm font-light tracking-tight text-white/85">
                {car.name} <span className="text-white/35">— {car.model}</span>
              </div>
            </div>
            <button
              onClick={closeModal}
              aria-label="Close gallery"
              className="w-11 h-11 flex items-center justify-center border border-white/15 hover:border-amber-400/60 text-white/70 hover:text-amber-300 transition-colors duration-500"
            >
              <Close />
            </button>
          </div>

          <div
            className="flex-1 min-h-0 flex items-center justify-center px-4 sm:px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              key={modalImageIndex}
              src={carImages[modalImageIndex]}
              alt={`${car.name} view ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain animate-fade-in"
            />
          </div>

          <div
            className="flex items-center justify-center gap-8 px-6 py-8 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {carImages.length > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  aria-label="Previous image"
                  className="group w-11 h-11 flex items-center justify-center border border-white/15 hover:border-amber-400/60 text-white/70 hover:text-amber-300 transition-colors duration-500"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-0.5" />
                </button>
                <span className="font-mono text-xs tracking-[0.25em] text-white/50 tabular-nums">
                  {String(modalImageIndex + 1).padStart(2, '0')}
                  <span className="text-white/25"> / {String(carImages.length).padStart(2, '0')}</span>
                </span>
                <button
                  onClick={nextModalImage}
                  aria-label="Next image"
                  className="group w-11 h-11 flex items-center justify-center border border-white/15 hover:border-amber-400/60 text-white/70 hover:text-amber-300 transition-colors duration-500"
                >
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </RemoveScroll>
  );
};

export default CarDetail;
