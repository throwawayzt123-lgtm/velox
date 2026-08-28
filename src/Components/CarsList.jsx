import React from 'react';
import { Link } from 'react-router-dom';
import carsData from '../carsData';
import CarCard, { Reveal, SectionLabel } from './CarCard';

const CarsList = () => {
  // Separate cars with 3D models from regular cars
  const carsWithModels = carsData.filter((car) => car.model3D);
  const regularCars = carsData.filter((car) => !car.model3D);

  return (
    <section className="relative bg-[#0a0a0b] text-white">
      {/* Warm ambient bloom */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] sm:w-[900px] h-[340px] bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.09),transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
        {/* Masthead */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/70 mb-6">
              THE COLLECTION
            </div>
            <h2 className="text-[clamp(2rem,5.5vw,4rem)] leading-[0.95] font-light tracking-[-0.03em]">
              Our luxury <span className="font-serif italic text-amber-200/90">fleet</span>
            </h2>
            <p className="mt-6 text-sm sm:text-base text-white/45 max-w-xl leading-relaxed">
              An exclusive collection of premium vehicles, offering uncompromising comfort,
              performance and prestige for your next journey.
            </p>
          </Reveal>
        </div>

        {/* 3D Car Models Section */}
        {carsWithModels.length > 0 && (
          <div className="mb-20 sm:mb-28">
            <Reveal>
              <SectionLabel index="01" className="mb-3">
                Immersive 3D experience
              </SectionLabel>
              <p className="text-sm text-white/35 mb-10 sm:mb-12 ml-10">
                Explore our premium selection in full 360-degree interactive 3D.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {carsWithModels.map((car, i) => (
                <Reveal key={`3d-${car.id}`} delay={i * 120}>
                  <div className="flex flex-col h-full">
                    <CarCard car={car} priority={i === 0} />
                    <Link
                      to={`/car-3d/${car.id}`}
                      className="group/btn mt-5 inline-flex items-center justify-center gap-3 border border-white/15 hover:border-amber-400/60 py-4 text-[10px] uppercase tracking-[0.28em] text-white/70 hover:text-amber-200 transition-colors duration-500"
                    >
                      Explore in 3D
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* Regular Cars Section */}
        {regularCars.length > 0 && (
          <div>
            {carsWithModels.length > 0 && (
              <Reveal>
                <SectionLabel index="02" className="mb-3">
                  Premium collection
                </SectionLabel>
                <p className="text-sm text-white/35 mb-10 sm:mb-12 ml-10">
                  More exceptional vehicles from our distinguished fleet.
                </p>
              </Reveal>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {regularCars.map((car, i) => (
                <Reveal key={car.id} delay={i * 100}>
                  <CarCard car={car} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CarsList;
