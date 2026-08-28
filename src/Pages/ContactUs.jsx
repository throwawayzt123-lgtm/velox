import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
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

const ArrowLeft = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const Check = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Field primitives — hairline underline, no boxes                    */
/* ------------------------------------------------------------------ */

const FIELD =
  'w-full bg-transparent border-0 border-b border-white/15 px-0 py-3.5 text-white ' +
  'placeholder-white/20 font-light focus:outline-none focus:border-amber-400/70 ' +
  'transition-colors duration-500';

const Label = ({ children, required }) => (
  <span className="block text-[10px] uppercase tracking-[0.26em] text-white/40 mb-1">
    {children}
    {required && <span className="text-amber-400/70 ml-1">*</span>}
  </span>
);

/* Native date/select controls render a light popup unless told otherwise */
const DARK = { colorScheme: 'dark' };

const CONTACT_DETAILS = [
  { label: 'Studio', value: 'California, USA', href: null },
  { label: 'Telephone', value: '+1 234567890', href: 'tel:+1234567890' },
  { label: 'Email', value: 'info@veloxelite.com', href: 'mailto:info@veloxelite.com' },
  { label: 'Concierge', value: '24 / 7', href: null },
];

const STEPS = [
  { n: 1, label: 'Your details' },
  { n: 2, label: 'The booking' },
];

const ContactUs = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitOk, setSubmitOk] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carType: '',
    pickupDate: '',
    returnDate: '',
    passengers: '',
    specialRequests: '',
  });

  /* Offer the real fleet rather than invented categories */
  const carOptions = useMemo(
    () =>
      carsData.map((c) => ({
        value: `${c.name} (${c.model})`,
        label: `${c.name} — ${c.model}`,
      })),
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const step1Valid = formData.name.trim() && formData.email.trim();

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 2));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const isDemoMode =
        serviceId === 'service_123456789' ||
        templateId === 'template_demo_contact' ||
        publicKey === 'demo_public_key_12345';

      if (isDemoMode) {
        // Demo mode — logged for the developer, never surfaced to visitors.
        console.log('Car rental inquiry (demo mode — no email sent):', {
          customer: { name: formData.name, email: formData.email, phone: formData.phone },
          rental: {
            carType: formData.carType,
            pickupDate: formData.pickupDate,
            returnDate: formData.returnDate,
            passengers: formData.passengers,
            specialRequests: formData.specialRequests,
          },
          timestamp: new Date().toLocaleString(),
          note: 'Configure real EmailJS credentials in .env to send actual emails.',
        });

        await new Promise((resolve) => setTimeout(resolve, 900));

        setSubmitOk(true);
        setSubmitMessage(
          'Thank you — your enquiry has been received. A specialist will be in touch shortly.'
        );
        setFormData({
          name: '',
          email: '',
          phone: '',
          carType: '',
          pickupDate: '',
          returnDate: '',
          passengers: '',
          specialRequests: '',
        });
        setCurrentStep(1);
        setIsSubmitting(false);
        return;
      }

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('The enquiry service is not configured.');
      }

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        car_type: formData.carType,
        pickup_date: formData.pickupDate,
        return_date: formData.returnDate,
        passengers: formData.passengers,
        special_requests: formData.specialRequests,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSubmitOk(true);
      setSubmitMessage(
        'Thank you — your enquiry has been sent. A specialist will be in touch shortly.'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        carType: '',
        pickupDate: '',
        returnDate: '',
        passengers: '',
        specialRequests: '',
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitOk(false);
      setSubmitMessage(
        'Something went wrong sending your enquiry. Please try again, or email us directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0a0a0b] text-white selection:bg-amber-400/25 overflow-x-clip">
      {/* ============================================================ */}
      {/*  MASTHEAD                                                    */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden border-b border-white/[0.07] bg-[#0a0a0b]">
        <div className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-[120%] h-full bg-[radial-gradient(ellipse_at_center,rgb(var(--primary-500)_/_0.11),transparent_65%)] pointer-events-none" />

        <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none select-none" aria-hidden="true">
          <span className="text-[17vw] leading-none font-black tracking-tighter text-white/[0.04] whitespace-nowrap uppercase translate-y-[20%]">
            Enquire
          </span>
        </div>

        <div className="relative container mx-auto px-6 sm:px-10 lg:px-16 pt-36 sm:pt-44 pb-20 sm:pb-28">
          <div className="max-w-3xl">
            <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/80 mb-8">
              GET IN TOUCH
            </div>
            <h1 className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.9] font-light tracking-[-0.03em]">
              Let&apos;s arrange
              <br />
              your <span className="font-serif italic text-amber-200/90">drive</span>
            </h1>
            <p className="mt-10 text-base sm:text-xl font-light text-white/45 max-w-xl leading-relaxed">
              Tell us what you have in mind and a specialist will handle the rest — delivery,
              insurance and a full handover before you take the keys.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  DETAILS RAIL                                                */}
      {/* ============================================================ */}
      <section className="relative border-b border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-white/[0.09]">
            {CONTACT_DETAILS.map((d, i) => (
              <Reveal key={d.label} delay={i * 90} className="h-full">
                <div className="h-full border-r border-b border-white/[0.09] px-6 sm:px-8 py-10 sm:py-12">
                  <div className="text-[9px] uppercase tracking-[0.26em] text-white/30 mb-4">
                    {d.label}
                  </div>
                  {d.href ? (
                    <a
                      href={d.href}
                      className="text-base sm:text-lg font-light text-white/75 hover:text-amber-200 transition-colors duration-500 break-all"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <div className="text-base sm:text-lg font-light text-white/75">{d.value}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FORM — the #form anchor every CTA on the site points at     */}
      {/* ============================================================ */}
      <section id="form" className="relative scroll-mt-24">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left rail — step tracker */}
            <div className="lg:col-span-4">
              <Reveal>
                <SectionLabel index="01" className="mb-10">
                  Your enquiry
                </SectionLabel>

                <ol className="border-t border-white/[0.09]">
                  {STEPS.map((s) => {
                    const done = currentStep > s.n;
                    const active = currentStep === s.n;
                    return (
                      <li
                        key={s.n}
                        className={`flex items-center gap-5 py-6 border-b border-white/[0.09] transition-colors duration-500 ${
                          active ? 'border-b-amber-400/40' : ''
                        }`}
                      >
                        <span
                          className={`w-8 h-8 shrink-0 flex items-center justify-center border text-[10px] font-mono transition-colors duration-500 ${
                            done
                              ? 'border-amber-400/60 bg-amber-400/15 text-amber-300'
                              : active
                              ? 'border-amber-400/70 text-amber-300'
                              : 'border-white/15 text-white/30'
                          }`}
                        >
                          {done ? <Check className="w-3.5 h-3.5" /> : String(s.n).padStart(2, '0')}
                        </span>
                        <span
                          className={`text-sm tracking-tight transition-colors duration-500 ${
                            active ? 'text-white' : 'text-white/40'
                          }`}
                        >
                          {s.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>

                <p className="mt-8 text-sm text-white/35 leading-relaxed max-w-xs">
                  Prefer to talk? Call{' '}
                  <a
                    href="tel:+1234567890"
                    className="text-amber-200/80 hover:text-amber-200 transition-colors duration-500"
                  >
                    +1 234567890
                  </a>{' '}
                  — a specialist is available around the clock.
                </p>
              </Reveal>
            </div>

            {/* Right — the form */}
            <div className="lg:col-span-8">
              <Reveal delay={120}>
                <form onSubmit={handleSubmit} noValidate>
                  {/* ---------------- STEP 1 ---------------- */}
                  {currentStep === 1 && (
                    <div className="space-y-10">
                      <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
                        Tell us who you <span className="font-serif italic text-amber-200/90">are</span>.
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                        <label className="block">
                          <Label required>Full name</Label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            autoComplete="name"
                            className={FIELD}
                            placeholder="Your name"
                          />
                        </label>

                        <label className="block">
                          <Label required>Email address</Label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            autoComplete="email"
                            className={FIELD}
                            placeholder="you@example.com"
                          />
                        </label>

                        <label className="block sm:col-span-2">
                          <Label>Phone number</Label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            autoComplete="tel"
                            className={FIELD}
                            placeholder="Optional, but faster"
                          />
                        </label>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={!step1Valid}
                          className="group relative overflow-hidden bg-amber-400 text-black px-10 py-4 text-[10px] uppercase tracking-[0.28em] font-medium disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed transition-colors duration-300"
                        >
                          <span className="relative z-10 inline-flex items-center gap-3">
                            Continue
                            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                          </span>
                          {step1Valid && (
                            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ---------------- STEP 2 ---------------- */}
                  {currentStep === 2 && (
                    <div className="space-y-10">
                      <h2 className="text-2xl sm:text-3xl font-light tracking-tight">
                        And what you&apos;d like to{' '}
                        <span className="font-serif italic text-amber-200/90">drive</span>.
                      </h2>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                        <label className="block sm:col-span-2">
                          <Label>Preferred vehicle</Label>
                          <select
                            name="carType"
                            value={formData.carType}
                            onChange={handleInputChange}
                            style={DARK}
                            className={`${FIELD} cursor-pointer`}
                          >
                            <option value="">No preference — advise me</option>
                            {carOptions.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block">
                          <Label>Pickup date</Label>
                          <input
                            type="date"
                            name="pickupDate"
                            value={formData.pickupDate}
                            onChange={handleInputChange}
                            style={DARK}
                            className={`${FIELD} cursor-pointer`}
                          />
                        </label>

                        <label className="block">
                          <Label>Return date</Label>
                          <input
                            type="date"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleInputChange}
                            min={formData.pickupDate || undefined}
                            style={DARK}
                            className={`${FIELD} cursor-pointer`}
                          />
                        </label>

                        <label className="block sm:col-span-2">
                          <Label>Passengers</Label>
                          <select
                            name="passengers"
                            value={formData.passengers}
                            onChange={handleInputChange}
                            style={DARK}
                            className={`${FIELD} cursor-pointer`}
                          >
                            <option value="">Select</option>
                            <option value="1-2">1–2 passengers</option>
                            <option value="3-4">3–4 passengers</option>
                            <option value="5-7">5–7 passengers</option>
                            <option value="8+">8+ passengers</option>
                          </select>
                        </label>

                        <label className="block sm:col-span-2">
                          <Label>Special requests</Label>
                          <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleInputChange}
                            rows="4"
                            className={`${FIELD} resize-none`}
                            placeholder="Delivery address, occasion, anything we should know…"
                          />
                        </label>
                      </div>

                      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="group inline-flex items-center justify-center gap-3 border border-white/15 hover:border-white/40 px-8 py-4 text-[10px] uppercase tracking-[0.28em] text-white/60 hover:text-white transition-colors duration-500"
                        >
                          <ArrowLeft className="w-4 h-4 transition-transform duration-500 group-hover:-translate-x-1" />
                          Back
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative overflow-hidden bg-amber-400 text-black px-10 py-4 text-[10px] uppercase tracking-[0.28em] font-medium disabled:opacity-60 disabled:cursor-wait"
                        >
                          <span className="relative z-10 inline-flex items-center gap-3">
                            {isSubmitting ? 'Sending…' : 'Send enquiry'}
                            {!isSubmitting && (
                              <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
                            )}
                          </span>
                          {!isSubmitting && (
                            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>

                {/* Result */}
                {submitMessage && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mt-10 flex items-start gap-4 border-l-2 pl-5 py-4 ${
                      submitOk
                        ? 'border-amber-400 bg-amber-400/[0.05]'
                        : 'border-red-500 bg-red-500/[0.05]'
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] tracking-[0.24em] shrink-0 mt-0.5 ${
                        submitOk ? 'text-amber-400/90' : 'text-red-400/90'
                      }`}
                    >
                      {submitOk ? 'SENT' : 'ERROR'}
                    </span>
                    <p className="text-sm font-light text-white/70 leading-relaxed">
                      {submitMessage}
                    </p>
                  </div>
                )}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CLOSING                                                     */}
      {/* ============================================================ */}
      <section className="relative border-t border-white/[0.07]">
        <div className="container mx-auto px-6 sm:px-10 lg:px-16 py-20 sm:py-24">
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
              <div className="max-w-xl">
                <div className="font-mono text-[10px] tracking-[0.35em] text-amber-400/70 mb-6">
                  NOT SURE YET
                </div>
                <h2 className="text-[clamp(1.75rem,4.5vw,3rem)] leading-[1.02] font-light tracking-[-0.03em]">
                  Browse the collection{' '}
                  <span className="font-serif italic text-amber-200/90">first</span>.
                </h2>
              </div>

              <Link
                to="/our-fleet"
                className="group inline-flex items-center gap-3 border border-white/20 hover:border-amber-400/60 px-10 py-5 text-[10px] uppercase tracking-[0.28em] text-white/80 hover:text-amber-200 transition-colors duration-500 self-start"
              >
                View the fleet
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
