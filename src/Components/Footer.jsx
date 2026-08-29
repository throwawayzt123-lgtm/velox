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

/* Inline SVG rather than an icon font — the Remix Icon stylesheet was a
   render-blocking CDN request costing ~1s for these four glyphs. */
const SOCIALS = [
  {
    label: 'Instagram',
    href: '#',
    path: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.39C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.39 2.12.66.67 1.33 1.09 2.12 1.39.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.39.67-.66 1.09-1.33 1.39-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.39-2.12C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm7.85-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z',
  },
  {
    label: 'Facebook',
    href: '#',
    path: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z',
  },
  {
    label: 'X',
    href: '#',
    path: 'M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z',
  },
  {
    label: 'LinkedIn',
    href: '#',
    path: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  },
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
                src="/Logo.webp"
                width="480"
                height="261"
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
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d={s.path} />
                  </svg>
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
