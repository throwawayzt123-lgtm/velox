import React from 'react';
import { useParams, Link } from 'react-router-dom';
import carsData from '../carsData';
import CarCard, { Reveal, SectionLabel } from './CarCard';

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

const BrandPage = () => {
  const { brandName } = useParams();

  const brandAliasMap = {
    audi: 'Audi',
    bmw: 'BMW',
    ferrari: 'Ferrari',
    lamborghini: 'Lamborghini',
    'rolls-royce': 'Rolls-Royce',
    'range-rover': 'Range Rover',
    mercedes: 'Mercedes-Benz',
    'mercedes-benz': 'Mercedes-Benz',
    'land-rover': 'Range Rover',
    nissan: 'Nissan',
    mclaren: 'McLaren',
  };

  const selectedBrand = brandAliasMap[brandName?.toLowerCase()] || brandName?.replace(/-/g, ' ');
  const filteredCars = carsData.filter(
    (car) => car.brand.toLowerCase() === selectedBrand?.toLowerCase()
  );

  const displayName = filteredCars[0]?.brand || selectedBrand;
  const heroImage = filteredCars[0]?.previewImage || filteredCars[0]?.image;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-amber-400/25 overflow-x-clip">
      {/* ============================================================ */}
      {/*  MASTHEAD                                                    */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-b border-white/[0.07]">
        {heroImage && (
          <div className="absolute inset-0">
            <img src={heroImage} alt="" className="w-full h-full object-cover opacity-[0.16]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/80 to-[#0a0a0b]" />
          </div>
        )}
        <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[120%] h-[100%] bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.12),transparent_65%)] pointer-events-none" />

        {/* Giant ghost wordmark */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none">
          <span className="text-[17vw] leading-none font-black tracking-tighter text-white/[0.04] whitespace-nowrap uppercase translate-y-[18%]">
            {displayName}
          </span>
        </div>

        <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 pt-36 sm:pt-44 pb-20 sm:pb-28">
          <Link
            to="/our-fleet"
            className="group inline-flex items-center gap-3 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 hover:text-amber-300 transition-colors duration-500 mb-14"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1.5" />
            The Collection
          </Link>

          <div className="max-w-3xl">
            <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/80 mb-6">
              MARQUE / {String(filteredCars.length).padStart(2, '0')}{' '}
              {filteredCars.length === 1 ? 'VEHICLE' : 'VEHICLES'}
            </div>
            <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] font-light tracking-[-0.03em]">
              {displayName}
            </h1>
            <p className="mt-8 text-sm sm:text-base text-white/45 max-w-lg leading-relaxed">
              Discover the ultimate driving experience with our exclusive {displayName} collection —
              each vehicle presented in factory specification and delivered to your door.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  GRID                                                        */}
      {/* ============================================================ */}
      <section className="relative">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          {filteredCars.length === 0 ? (
            <div className="text-center max-w-md mx-auto py-16">
              <div className="font-mono text-xs tracking-[0.3em] text-amber-500/70 mb-6">
                NO RESULTS
              </div>
              <h2 className="text-3xl sm:text-5xl font-light tracking-tight mb-6">
                Nothing in this <span className="font-serif italic text-amber-200/90">marque</span>
              </h2>
              <p className="text-white/45 text-sm mb-10 leading-relaxed">
                We couldn&apos;t find any {displayName} vehicles in the collection right now.
              </p>
              <Link
                to="/our-fleet"
                className="group inline-flex items-center gap-3 border border-white/20 hover:border-amber-400/60 px-8 py-4 text-xs uppercase tracking-[0.25em] transition-colors duration-500"
              >
                <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1" />
                View the full fleet
              </Link>
            </div>
          ) : (
            <>
              <Reveal>
                <SectionLabel index="01" className="mb-12 sm:mb-16">
                  Available now
                </SectionLabel>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
                {filteredCars.map((car, i) => (
                  <Reveal key={car.id} delay={i * 110}>
                    <CarCard car={car} priority={i === 0} />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                         */}
      {/* ============================================================ */}
      {filteredCars.length > 0 && (
        <section className="relative border-t border-white/[0.07] overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.1),transparent_70%)] pointer-events-none" />
          <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32 text-center">
            <Reveal>
              <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/70 mb-8">
                ENQUIRY
              </div>
              <h2 className="text-[clamp(1.75rem,5.5vw,4rem)] leading-[0.98] font-light tracking-[-0.03em] max-w-3xl mx-auto">
                Ready to drive your dream{' '}
                <span className="font-serif italic text-amber-200/90">{displayName}</span>?
              </h2>
              <p className="mt-8 text-sm sm:text-base text-white/45 max-w-lg mx-auto leading-relaxed">
                Our specialists arrange everything — delivery, insurance and a full handover before
                you take the wheel.
              </p>
              <div className="mt-12">
                <Link
                  to="/contact-us#form"
                  className="group relative inline-block overflow-hidden bg-amber-400 text-black px-12 py-5 text-xs uppercase tracking-[0.28em] font-medium"
                >
                  <span className="relative z-10 inline-flex items-center gap-3">
                    Contact a specialist
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </span>
                  <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}
    </div>
  );
};

export default BrandPage;
