import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const ArrowRight = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const Cube = ({ className = 'w-3.5 h-3.5' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5-9 5m18 0v9l-9 5m9-14l-9 5m0 9l-9-5v-9m9 14v-9m-9-5l9 5" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Reveal-on-scroll wrapper (shared with CarDetail's treatment)       */
/* ------------------------------------------------------------------ */

export const Reveal = ({ children, delay = 0, className = '' }) => {
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
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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
/*  Section heading, matching the detail page's numbered rules         */
/* ------------------------------------------------------------------ */

export const SectionLabel = ({ index, children, className = '' }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    {index && (
      <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] text-amber-500/70">{index}</span>
    )}
    <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/45">{children}</span>
    <span className="flex-1 h-px bg-gradient-to-r from-white/15 to-transparent" />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Spec pickers — data is uneven across cars, so degrade gracefully   */
/* ------------------------------------------------------------------ */

const PREFERRED_SPECS = ['Power', '0-60 mph', 'Top Speed'];

/* Fall back to the first meaningful words of a feature when a car has
   no `specifications` array (only two cars in the data set do). */
const deriveSpecs = (car) => {
  if (car.specifications?.length) {
    const picked = PREFERRED_SPECS.map((label) =>
      car.specifications.find((s) => s.label === label)
    ).filter(Boolean);
    if (picked.length) return picked.slice(0, 3);
    return car.specifications.slice(0, 3);
  }
  return null;
};

const formatPrice = (value) => (typeof value === 'number' ? value.toLocaleString() : value);

/* ------------------------------------------------------------------ */
/*  CarCard                                                            */
/* ------------------------------------------------------------------ */

const CarCard = ({ car, priority = false }) => {
  const specs = deriveSpecs(car);
  const image = car.previewImage || car.image;

  return (
    <Link to={`/car/${car.id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111113]">
        {image && (
          <img
            src={image}
            alt={`${car.name} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
            loading={priority ? 'eager' : 'lazy'}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-amber-400/40 transition-all duration-700" />

        {/* 3D availability badge */}
        {car.model3D && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-black/50 backdrop-blur-md border border-amber-400/30 px-3 py-1.5">
            <Cube className="w-3 h-3 text-amber-400" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-amber-100">3D</span>
          </div>
        )}
      </div>

      {/* Identity + headline rate */}
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[9px] uppercase tracking-[0.28em] text-white/35 mb-2">{car.brand}</div>
          <div className="text-lg font-light tracking-tight text-white group-hover:text-amber-100 transition-colors duration-500">
            {car.name}
          </div>
          <div className="text-xs text-white/40 mt-1 font-serif italic">{car.model}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-base font-light text-amber-200/90">${formatPrice(car.pricePerDay)}</div>
          <div className="text-[9px] uppercase tracking-[0.2em] text-white/30 mt-1">/ day</div>
        </div>
      </div>

      {/* Key specs — only when the car actually carries them */}
      {specs && (
        <div className="mt-5 pt-4 border-t border-white/[0.07] grid grid-cols-3 gap-3">
          {specs.map((s) => (
            <div key={s.label} className="min-w-0">
              <div className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1.5 truncate">
                {s.label}
              </div>
              <div className="text-xs sm:text-sm font-light text-white/75 truncate">{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Extended rates */}
      <div className="mt-4 pt-4 border-t border-white/[0.07] flex items-center gap-4 text-[10px] tracking-wide text-white/35">
        <span>
          ${formatPrice(car.pricePerWeek)}
          <span className="text-white/20"> / wk</span>
        </span>
        <span className="w-px h-3 bg-white/10" />
        <span>
          ${formatPrice(car.pricePerMonth)}
          <span className="text-white/20"> / mo</span>
        </span>
        <span className="ml-auto inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.22em] text-white/45 group-hover:text-amber-300 transition-colors duration-500">
          View
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

export default CarCard;
