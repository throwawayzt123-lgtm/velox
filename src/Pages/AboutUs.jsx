import React from 'react';
import { Link } from 'react-router-dom';
import carsData from '../carsData';
import { Reveal, SectionLabel } from '../Components/CarCard';

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

const ArrowRight = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Content                                                            */
/* ------------------------------------------------------------------ */

const FOUNDED = 2009;

const VALUES = [
  {
    title: 'Safety first',
    description:
      'Every vehicle passes a rigorous multi-point inspection before it reaches you, and returns to the workshop between each hire.',
  },
  {
    title: 'Premium quality',
    description:
      'We keep only current-generation models, specified with the options that matter and maintained to manufacturer standard.',
  },
  {
    title: 'Customer focus',
    description:
      'A specialist is assigned to every booking — reachable around the clock, before, during and after your hire.',
  },
  {
    title: 'Global network',
    description:
      'Flexible collection and delivery, with the same standard of preparation wherever you take the keys.',
  },
];

const REASONS = [
  { title: 'Wide selection', description: 'From grand tourers to track-bred supercars.' },
  { title: 'Competitive pricing', description: 'Transparent rates with nothing withheld.' },
  { title: '24/7 support', description: 'Round-the-clock assistance whenever you need it.' },
  { title: 'Easy booking', description: 'A simple, secure process with flexible terms.' },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const AboutUs = () => {
  const years = new Date().getFullYear() - FOUNDED;
  const marques = new Set(carsData.map((c) => c.brand)).size;

  /* Two figures are derived from the fleet so they can never contradict it;
     the customer/satisfaction claims stay as authored marketing copy. */
  const stats = [
    { number: `${years}+`, label: 'Years of service' },
    { number: '50K+', label: 'Clients served' },
    { number: `${marques}`, label: 'Marques represented' },
    { number: '99%', label: 'Satisfaction rate' },
  ];

  const heroImage = carsData.find((c) => c.previewImage || c.image);
  const heroSrc = heroImage?.previewImage || heroImage?.image;

  return (
    <div className="bg-[#0a0a0b] text-white selection:bg-amber-400/25 overflow-x-clip">
      {/* ============================================================ */}
      {/*  MASTHEAD                                                    */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#0a0a0b]">
        {heroSrc && (
          <div className="absolute inset-0">
            <img src={heroSrc} alt="" className="w-full h-full object-cover opacity-[0.18]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/80 to-[#0a0a0b]" />
          </div>
        )}
        <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.12),transparent_65%)] pointer-events-none" />

        {/* Giant ghost wordmark */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none">
          <span className="text-[17vw] leading-none font-black tracking-tighter text-white/[0.04] whitespace-nowrap uppercase translate-y-[18%]">
            Since {FOUNDED}
          </span>
        </div>

        <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 pt-36 sm:pt-48 pb-24 sm:pb-32">
          <div className="max-w-4xl">
            <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/80 mb-8">
              ESTABLISHED {FOUNDED}
            </div>
            <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] font-light tracking-[-0.03em]">
              About our{' '}
              <span className="font-serif italic text-amber-200/90">legacy</span>
            </h1>
            <p className="mt-10 text-lg sm:text-2xl font-light text-white/50 max-w-2xl leading-[1.5]">
              For over {years} years we have delivered premium motoring experiences built on
              uncompromising standards — and on the belief that every journey deserves to be
              memorable.
            </p>

            <div className="mt-14 flex flex-col sm:flex-row gap-4">
              <Link
                to="/our-fleet"
                className="group relative overflow-hidden bg-amber-400 text-black px-12 py-5 text-xs uppercase tracking-[0.28em] font-medium text-center"
              >
                <span className="relative z-10 inline-flex items-center gap-3">
                  Explore our fleet
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </Link>
              <Link
                to="/contact-us#form"
                className="border border-white/20 hover:border-white/50 px-12 py-5 text-xs uppercase tracking-[0.28em] text-white/80 hover:text-white transition-colors duration-500 text-center"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FIGURES                                                     */}
      {/* ============================================================ */}
      <section className="relative border-b border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-white/[0.09]">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100} className="h-full">
                <div className="group h-full border-r border-b border-white/[0.09] px-6 sm:px-8 py-12 sm:py-16 hover:bg-white/[0.02] transition-colors duration-700">
                  <div className="font-mono text-[10px] tracking-[0.25em] text-amber-500/50 mb-6">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="text-4xl sm:text-6xl font-light tracking-tighter text-white group-hover:text-amber-100 transition-colors duration-700">
                    {stat.number}
                  </div>
                  <div className="mt-4 text-[10px] uppercase tracking-[0.24em] text-white/35">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  OUR STORY                                                   */}
      {/* ============================================================ */}
      <section className="relative border-b border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="01" className="mb-8 sm:mb-12">
                  Our story
                </SectionLabel>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <Reveal delay={100}>
                <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.05] font-light tracking-[-0.03em] mb-12">
                  Built on trust and{' '}
                  <span className="font-serif italic text-amber-200/90">excellence</span>.
                </h2>
              </Reveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                {[
                  `What began in ${FOUNDED} as a single car and a stubborn idea has grown into a name trusted across the luxury rental industry. We believe every journey deserves to be special, and every client deserves service without compromise.`,
                  'That commitment made us one of the fastest-growing premium rental companies in the region. We invest heavily in the fleet and in the people who look after it, so that every interaction exceeds what you expected.',
                  'Today we serve tens of thousands of clients each year, across a collection curated rather than accumulated — every vehicle chosen because it is worth driving, not because it filled a gap.',
                  'What has not changed is the standard. Each car is prepared, inspected and delivered as though it were going out for the first time, because to you it is.',
                ].map((para, i) => (
                  <Reveal key={i} delay={200 + i * 90}>
                    <p className="text-sm sm:text-base text-white/50 leading-[1.8]">{para}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  VALUES                                                      */}
      {/* ============================================================ */}
      <section className="relative border-b border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <Reveal>
            <SectionLabel index="02" className="mb-12 sm:mb-16">
              Core values
            </SectionLabel>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/[0.09]">
            {VALUES.map((value, i) => (
              <Reveal key={value.title} delay={i * 110} className="h-full">
                <div className="group h-full border-r border-b border-white/[0.09] p-8 sm:p-12 hover:bg-white/[0.02] transition-colors duration-700">
                  <div className="flex items-baseline gap-5 mb-6">
                    <span className="font-mono text-[10px] text-amber-500/50 group-hover:text-amber-400 transition-colors duration-500">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white group-hover:text-amber-100 transition-colors duration-500">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/45 leading-[1.8] max-w-md">{value.description}</p>
                  <span className="mt-8 block w-0 group-hover:w-16 h-px bg-amber-400/60 transition-all duration-700" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  WHY CHOOSE US                                               */}
      {/* ============================================================ */}
      <section className="relative border-b border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="03" className="mb-8">
                  Why choose us
                </SectionLabel>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                  The details that separate a rental from an occasion.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <div className="border-t border-white/[0.09]">
                {REASONS.map((reason, i) => (
                  <Reveal key={reason.title} delay={i * 80}>
                    <div className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-10 py-7 border-b border-white/[0.09] hover:border-amber-400/30 transition-colors duration-500">
                      <span className="font-mono text-[10px] text-amber-500/50 group-hover:text-amber-400 transition-colors duration-500 sm:w-8 shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-lg sm:text-xl font-light tracking-tight text-white sm:w-56 shrink-0">
                        {reason.title}
                      </h3>
                      <p className="text-sm text-white/45 leading-relaxed">{reason.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA                                                         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden">
        {heroSrc && (
          <div className="absolute inset-0">
            <img src={heroSrc} alt="" className="w-full h-full object-cover opacity-[0.13]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b] via-[#0a0a0b]/85 to-[#0a0a0b]" />
          </div>
        )}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.11),transparent_70%)] pointer-events-none" />

        <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-36 text-center">
          <Reveal>
            <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/70 mb-8">
              THE INVITATION
            </div>
            <h2 className="text-[clamp(2rem,6.5vw,5rem)] leading-[0.95] font-light tracking-[-0.03em] max-w-4xl mx-auto">
              Ready to drive{' '}
              <span className="font-serif italic text-amber-200/90">premium</span>?
            </h2>
            <p className="mt-8 text-sm sm:text-base text-white/45 max-w-lg mx-auto leading-relaxed">
              Experience the collection for yourself. A specialist will handle everything from
              delivery to handover.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contact-us#form"
                className="group relative w-full sm:w-auto overflow-hidden bg-amber-400 text-black px-12 py-5 text-xs uppercase tracking-[0.28em] font-medium"
              >
                <span className="relative z-10 inline-flex items-center gap-3">
                  Book now
                  <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                </span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
              </Link>

              <Link
                to="/our-fleet"
                className="w-full sm:w-auto border border-white/20 hover:border-white/50 px-12 py-5 text-xs uppercase tracking-[0.28em] text-white/80 hover:text-white transition-colors duration-500"
              >
                View fleet
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
