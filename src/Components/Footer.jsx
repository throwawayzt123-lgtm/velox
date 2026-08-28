import React from 'react';
import { Link } from 'react-router-dom';
import carsData from '../carsData';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const ArrowRight = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

const ArrowUp = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/our-fleet', label: 'Our Fleet' },
  { to: '/about-us', label: 'About Us' },
  { to: '/contact-us', label: 'Contact' },
];

const SOCIALS = [
  { icon: 'ri-instagram-fill', label: 'Instagram', href: '#' },
  { icon: 'ri-facebook-fill', label: 'Facebook', href: '#' },
  { icon: 'ri-twitter-x-fill', label: 'X', href: '#' },
  { icon: 'ri-linkedin-fill', label: 'LinkedIn', href: '#' },
];

/* Route slugs mirror the alias map in BrandPage */
const BRAND_SLUGS = {
  'Mercedes-Benz': 'mercedes-benz',
  'Rolls-Royce': 'rolls-royce',
  'Range Rover': 'range-rover',
};

const brandSlug = (brand) => BRAND_SLUGS[brand] || brand.toLowerCase().replace(/\s+/g, '-');

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  /* Marque index, derived from the fleet so it can't go stale */
  const brands = [...new Set(carsData.map((car) => car.brand))].sort();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  };

  return (
    <footer className="relative bg-[#0a0a0b] text-white border-t border-white/[0.07] overflow-hidden">
      {/* Warm ambient bloom */}
      <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.07),transparent_70%)] pointer-events-none" />

      {/* ============================================================ */}
      {/*  CTA BAND                                                    */}
      {/* ============================================================ */}
      <div className="relative border-b border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            <div className="max-w-2xl">
              <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/70 mb-6">
                START YOUR JOURNEY
              </div>
              <h2 className="text-[clamp(1.75rem,5vw,3.5rem)] leading-[0.98] font-light tracking-[-0.03em]">
                Your next drive is{' '}
                <span className="font-serif italic text-amber-200/90">waiting</span>.
              </h2>
            </div>

            <Link
              to="/contact-us#form"
              className="group relative shrink-0 overflow-hidden bg-amber-400 text-black px-12 py-5 text-xs uppercase tracking-[0.28em] font-medium self-start lg:self-auto"
            >
              <span className="relative z-10 inline-flex items-center gap-3">
                Book your ride
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              </span>
              <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  COLUMNS                                                     */}
      {/* ============================================================ */}
      <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-14">
          {/* Identity */}
          <div className="col-span-2 lg:col-span-4">
            <Link to="/" className="inline-block">
              <img
                src="/Logo.png"
                alt="Velox Elite"
                className="w-32 h-auto opacity-90 hover:opacity-100 transition-opacity duration-500"
              />
            </Link>
            <p className="mt-6 text-sm text-white/40 leading-relaxed max-w-xs">
              Luxury car rental. A curated collection of the world&apos;s finest machines,
              delivered to your door and prepared to concours standard.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 flex items-center justify-center border border-white/12 text-white/50 hover:text-black hover:bg-amber-400 hover:border-amber-400 transition-colors duration-500"
                >
                  <i className={`${s.icon} text-base`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div className="lg:col-span-2 lg:col-start-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/35 mb-6">Navigate</div>
            <ul className="space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="group inline-flex items-center gap-2 text-sm font-light text-white/60 hover:text-amber-200 transition-colors duration-500"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-amber-400/70 transition-all duration-500" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marques — derived from the fleet */}
          <div className="lg:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/35 mb-6">Marques</div>
            <ul className="space-y-3">
              {brands.map((brand) => (
                <li key={brand}>
                  <Link
                    to={`/brand/${brandSlug(brand)}`}
                    className="group inline-flex items-center gap-2 text-sm font-light text-white/60 hover:text-amber-200 transition-colors duration-500"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-amber-400/70 transition-all duration-500" />
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Enquiries */}
          <div className="col-span-2 lg:col-span-3">
            <div className="text-[10px] uppercase tracking-[0.3em] text-white/35 mb-6">Enquiries</div>
            <ul className="space-y-5">
              <li>
                <div className="text-[9px] uppercase tracking-[0.22em] text-white/25 mb-1.5">
                  Studio
                </div>
                <div className="text-sm font-light text-white/60">California, USA</div>
              </li>
              <li>
                <div className="text-[9px] uppercase tracking-[0.22em] text-white/25 mb-1.5">
                  Telephone
                </div>
                <a
                  href="tel:+1234567890"
                  className="text-sm font-light text-white/60 hover:text-amber-200 transition-colors duration-500"
                >
                  +971 1234 567890
                </a>
              </li>
              <li>
                <div className="text-[9px] uppercase tracking-[0.22em] text-white/25 mb-1.5">
                  Email
                </div>
                <a
                  href="mailto:info@veloxelite.com"
                  className="text-sm font-light text-white/60 hover:text-amber-200 transition-colors duration-500 break-all"
                >
                  info@veloxelite.com
                </a>
              </li>
              <li className="pt-1">
                <div className="text-[9px] uppercase tracking-[0.22em] text-white/25 mb-1.5">
                  Concierge
                </div>
                <div className="text-sm font-light text-amber-200/70">24 / 7</div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  GIANT WORDMARK                                              */}
      {/* ============================================================ */}
      <div
        className="relative container mx-auto px-6 sm:px-10 lg:px-16 select-none pointer-events-none"
        aria-hidden="true"
      >
        <div className="text-[15vw] leading-[0.8] font-black tracking-tighter text-white/[0.035] whitespace-nowrap uppercase text-center">
          Velox Elite
        </div>
      </div>

      {/* ============================================================ */}
      {/*  BASELINE                                                    */}
      {/* ============================================================ */}
      <div className="relative border-t border-white/[0.07] mt-10">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-7">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <p className="font-mono text-[10px] tracking-[0.18em] text-white/30 text-center sm:text-left">
              © {currentYear} VELOX ELITE — ALL RIGHTS RESERVED
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-white/40 hover:text-amber-300 transition-colors duration-500"
            >
              Back to top
              <span className="w-8 h-8 flex items-center justify-center border border-white/12 group-hover:border-amber-400/60 transition-colors duration-500">
                <ArrowUp className="w-3.5 h-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
