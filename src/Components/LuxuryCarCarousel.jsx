import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import carsData from '../carsData';

const LuxuryCarCarousel = () => {
  return (
    <div className="relative py-16 sm:py-24 bg-[#050505]">
      {/* Background glow for atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl max-h-[800px] bg-amber-500/5 blur-[150px] pointer-events-none z-0"></div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-amber-400 rounded-full shadow-[0_0_15px_rgb(var(--primary-500)_/_0.8)] animate-pulse"></div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-500 tracking-tight leading-tight">
                Exotic Spotlight
              </h2>
            </div>
            <p className="text-gray-400 mt-3 sm:text-lg max-w-xl font-medium tracking-wide">
              A curated selection of the world's most breathtaking performance, luxury, and exotic masterpieces.
            </p>
          </div>
          <div className="hidden md:block">
            <Link to="/our-fleet" className="group flex items-center gap-2 text-amber-400 font-bold tracking-widest uppercase text-sm hover:text-amber-300 transition-colors">
              <span>View Full Gallery</span>
              <div className="w-8 h-[2px] bg-amber-400 group-hover:w-12 transition-all duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Carousel Framework */}
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1500}
          spaceBetween={0}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + '"></span>';
            },
          }}
          navigation={{
            enabled: true,
          }}
          className="masterpiece-swiper rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,1)] border border-white/5"
        >
          {carsData.slice(0, 8).map((car, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-[500px] md:h-[600px] lg:h-[750px] bg-black group overflow-hidden">
                
                {/* Image with extreme smooth cinematic scale parallax via CSS */}
                <img
                  src={car.image}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 cinematic-scale filter brightness-90 group-hover:brightness-100 transition-all duration-1000"
                  alt={car.name}
                  /* Only the first slide is visible on arrival; the rest are
                     multi-hundred-KB external images, so defer them. */
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  width="1600"
                  height="900"
                />
                
                {/* Advanced Light & Shadow Gradients for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/30 to-transparent z-10 pointer-events-none"></div>

                {/* Main Slide Content Grid */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 lg:p-20 z-20">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 lg:gap-8">
                    
                    {/* Typography: Title & Brand */}
                    <div className="max-w-3xl slide-text-content">
                      <div className="flex items-center gap-4 mb-4 sm:mb-6">
                        <span className="h-[2px] w-12 bg-amber-400 shadow-[0_0_10px_rgb(var(--primary-500)_/_1)]"></span>
                        <span className="text-amber-400 font-extrabold tracking-[0.4em] uppercase text-xs sm:text-sm drop-shadow-md">
                          {car.brand || "Luxury Edition"}
                        </span>
                      </div>
                      <h3 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white mb-2 leading-[1.05] drop-shadow-2xl tracking-tighter">
                        {car.name}
                      </h3>
                      <p className="text-xl lg:text-3xl font-light text-gray-300 italic tracking-wider drop-shadow-xl">
                        {car.model}
                      </p>
                    </div>

                    {/* Booking/Price Card (Glassmorphism) */}
                    <div className="slide-card-content w-full lg:w-auto flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-[#111111]/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden group/card">
                       {/* Subtle hover gleam on the card */}
                       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[200%] group-hover/card:translate-x-[200%] transition-transform duration-[1500ms] ease-in-out"></div>
                       
                       <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
                         <span className="text-gray-400 text-xs font-bold tracking-[0.2em] uppercase mb-1">Daily Rate</span>
                         <div className="flex items-baseline gap-1.5">
                           <span className="text-4xl lg:text-5xl text-white font-extrabold">${car.pricePerDay}</span>
                           <span className="text-amber-400 text-xs sm:text-sm font-bold tracking-widest uppercase">/ Day</span>
                         </div>
                       </div>
                       
                       <div className="hidden sm:block w-[1px] h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                       
                       <Link to={`/car/${car.id}`} className="w-full sm:w-auto z-10">
                         <button className="w-full sm:w-auto relative overflow-hidden rounded-xl bg-amber-400 px-8 sm:px-10 py-4 flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-[0_0_20px_rgb(var(--primary-500)_/_0.35)] hover:shadow-[0_0_30px_rgb(var(--primary-500)_/_0.6)] group/btn">
                           <span className="relative z-10 text-black font-black tracking-widest uppercase text-xs sm:text-sm">Reserve</span>
                           <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black relative z-10 transform group-hover/btn:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                         </button>
                       </Link>
                    </div>

                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Advanced Custom Swiper Styling Injection */}
      <style>{`
        /* Overriding Swiper Navigation with Hyper-car Aesthetic Controls */
        .masterpiece-swiper .swiper-button-next,
        .masterpiece-swiper .swiper-button-prev {
          color: white !important;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          width: 64px !important;
          height: 64px !important;
          border-radius: 50%;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          margin: 0 10px;
        }
        
        .masterpiece-swiper .swiper-button-next:hover,
        .masterpiece-swiper .swiper-button-prev:hover {
          background: rgb(var(--primary-400));
          border-color: rgb(var(--primary-400));
          color: #0a0a0b !important;
          transform: scale(1.1);
          box-shadow: 0 0 30px rgb(var(--primary-500) / 0.5);
        }

        .masterpiece-swiper .swiper-button-next:after,
        .masterpiece-swiper .swiper-button-prev:after {
          font-size: 24px !important;
          font-weight: 900;
        }

        /* Modern Progress Pagination Bar Setup */
        .masterpiece-swiper .swiper-pagination {
          bottom: 30px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .masterpiece-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3) !important;
          width: 30px !important;
          height: 4px !important;
          border-radius: 4px !important;
          transition: all 0.5s ease !important;
          opacity: 1 !important;
          margin: 0 4px !important;
        }

        .masterpiece-swiper .swiper-pagination-bullet-active {
          background: rgb(var(--primary-400)) !important;
          width: 60px !important;
          box-shadow: 0 0 10px rgb(var(--primary-500) / 0.8) !important;
        }

        /* Continuous Cinematic Scale for Active Slide Image */
        .swiper-slide .cinematic-scale {
          transform: scale(1);
          transition: transform 9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .swiper-slide-active .cinematic-scale {
          transform: scale(1.12);
        }

        /* Entry Animations for Text Content */
        .swiper-slide .slide-text-content {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s;
        }
        .swiper-slide-active .slide-text-content {
          opacity: 1;
          transform: translateY(0);
        }

        .swiper-slide .slide-card-content {
          opacity: 0;
          transform: translateX(30px);
          transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s;
        }
        .swiper-slide-active .slide-card-content {
          opacity: 1;
          transform: translateX(0);
        }

        /* Mobile specific adjustments */
        @media (max-width: 768px) {
          .masterpiece-swiper .swiper-button-next,
          .masterpiece-swiper .swiper-button-prev {
            display: none !important;
          }
          .masterpiece-swiper .swiper-pagination-bullet {
            width: 15px !important;
          }
          .masterpiece-swiper .swiper-pagination-bullet-active {
            width: 30px !important;
          }
          .swiper-slide .slide-card-content {
            transform: translateY(30px); /* Bottom entry for mobile layout */
          }
          .swiper-slide-active .slide-card-content {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LuxuryCarCarousel;