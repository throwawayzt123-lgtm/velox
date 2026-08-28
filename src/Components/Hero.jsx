import React, { useState, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import audiLogo from "/brandlogos/audi.png";
import bmwLogo from "/brandlogos/bmw.png";
import mercedesLogo from "/brandlogos/mercedes.png";
import nissanLogo from "/brandlogos/nissan.png";
import lamboLogo from "/brandlogos/lamborghini.png";
import ferrariLogo from "/brandlogos/ferrari.png";
import rollsroyceLogo from "/brandlogos/rollsroyce.png";
import landroverLogo from "/brandlogos/landrover.png";
import heroBg from '../Images/Herobg.jpg';

import carsData from '../carsData';

const Hero = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return carsData.filter(car => {
      return (
        car.name.toLowerCase().includes(q) ||
        car.brand.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q)
      );
    }).slice(0, 5);
  }, [query]);

  const handleSelect = (car) => {
    setQuery(`${car.brand} ${car.model}`);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (car.model3D) {
      navigate(`/car-3d/${car.id}`);
    } else {
      navigate(`/car/${car.id}`);
    }
  };

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    const results = carsData.filter(car => (
      car.name.toLowerCase().includes(q) ||
      car.brand.toLowerCase().includes(q) ||
      car.model.toLowerCase().includes(q)
    ));
    if (results.length > 0) {
      const car = results[0];
      if (car.model3D) {
        navigate(`/car-3d/${car.id}`);
      } else {
        navigate(`/car/${car.id}`);
      }
    }
    setShowSuggestions(false);
  };

  const onKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const brands = [
    { name: "Audi", slug: "audi", logo: audiLogo },
    { name: "BMW", slug: "bmw", logo: bmwLogo },
    { name: "Mercedes", slug: "mercedes", logo: mercedesLogo },
    { name: "Nissan", slug: "nissan", logo: nissanLogo },
    { name: "Lamborghini", slug: "lamborghini", logo: lamboLogo },
    { name: "Ferrari", slug: "ferrari", logo: ferrariLogo },
    { name: "Rolls-Royce", slug: "rolls-royce", logo: rollsroyceLogo },
    { name: "Land Rover", slug: "range-rover", logo: landroverLogo },
  ];

  return (
    <section className="relative overflow-hidden bg-black min-h-screen">
      {/* Background Image & Immersive Dark/Red Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-80"
          loading="eager"
          fetchPriority="high"
        />
        {/* Deep, rich lighting overlay that transitions into the dark theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#111]/80 to-[#050505]/95"></div>
        
        {/* Dynamic Glow Accents - restricted width on mobile to prevent overflow */}
        <div className="absolute top-0 right-1/4 w-[120%] sm:w-[800px] h-[400px] sm:h-[800px] bg-amber-400/10 blur-[100px] sm:blur-[180px] rounded-full pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-1/4 w-[120%] sm:w-[600px] h-[300px] sm:h-[600px] bg-amber-500/10 blur-[100px] sm:blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
      </div>

      {/* Content Container - removed excessive hidden horizontal overflow from components */}
      <div className="relative pt-[120px] sm:pt-[160px] pb-16 sm:pb-24 z-10 w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        
        {/* Main Typography Suite */}
        <div className="text-center w-full max-w-6xl mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-amber-400/20 bg-amber-400/5 backdrop-blur-md mb-6 sm:mb-8">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgb(var(--primary-400)_/_0.8)] animate-pulse"></span>
            <span className="text-amber-400 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase">Premium Car Rental</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-bold mb-4 sm:mb-6 tracking-tight text-white drop-shadow-2xl leading-[1.1]">
            Book a Luxury Car in <br className="hidden sm:block" />
            <span className="relative inline-block mt-1 sm:mt-0">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-400 pr-1 sm:pr-2 italic">Dubai</span>
              <div className="absolute bottom-1 sm:bottom-2 left-0 w-full h-[0.1em] sm:h-[0.15em] bg-gradient-to-r from-amber-400 to-transparent rounded-full shadow-[0_0_20px_rgb(var(--primary-400)_/_0.6)]"></div>
            </span> in Minutes
          </h1>
          
          <p className="text-base sm:text-xl lg:text-2xl font-medium text-gray-400 max-w-3xl mx-auto tracking-wide mt-4 sm:mt-8 px-2">
            Experience absolute prestige with our exclusive collection of high-end vehicles. Elevate your journey today.
          </p>
        </div>

        {/* Next-Gen Search Component */}
        <div className="relative group w-full max-w-3xl mx-auto z-40 mb-12 sm:mb-20 px-2 sm:px-0">
          {/* Ambient Glow behind search */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 to-amber-500/10 rounded-[2rem] sm:rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-700 pointer-events-none hidden sm:block"></div>
          
          <div className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-[#111111]/90 backdrop-blur-2xl border border-white/10 group-hover:border-amber-400/40 rounded-2xl sm:rounded-[2.5rem] p-2 sm:p-3 transition-colors duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="hidden sm:flex pl-6 text-amber-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
            
            <div className="flex w-full items-center sm:hidden px-4 pt-2">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>

            <input
              type="text"
              placeholder="Search brand, model, or exotic..."
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setSelectedIndex(-1); }}
              onKeyDown={onKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm sm:text-xl font-medium tracking-wide text-center sm:text-left"
            />
            <button 
              onClick={handleSearch} 
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-black px-8 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-[2rem] font-bold tracking-widest uppercase text-xs sm:text-sm transition-all duration-300 shadow-[0_0_20px_rgb(var(--primary-400)_/_0.4)] hover:shadow-[0_0_30px_rgb(var(--primary-400)_/_0.8)]"
            >
              Discover
            </button>
          </div>

          {/* Holographic Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-4 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/5 rounded-2xl sm:rounded-3xl max-h-64 overflow-y-auto z-50 shadow-[0_30px_60px_rgba(0,0,0,0.8)] custom-scrollbar">
              {suggestions.map((car, idx) => (
                <li
                  key={car.id}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(car); }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 cursor-pointer flex items-center gap-3 sm:gap-5 transition-colors duration-200 border-b border-white/5 last:border-none ${
                    selectedIndex === idx ? 'bg-amber-400/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="w-12 h-8 sm:w-20 sm:h-12 flex-shrink-0 overflow-hidden rounded-lg sm:rounded-xl bg-black border border-white/10">
                    <img src={car.image} alt={car.name} loading="lazy" className="w-full h-full object-cover opacity-90" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-xs sm:text-base tracking-wide flex items-center gap-2">
                      {car.brand} {car.model}
                      {car.model3D && <span className="text-[8px] sm:text-[10px] bg-amber-400/20 text-amber-400 px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider">3D</span>}
                    </span>
                    <span className="text-gray-400 text-[10px] sm:text-sm font-medium">{car.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Revolutionary Brand Component Array */}
        <div className="w-full max-w-7xl mx-auto z-30 mb-8 mt-6 sm:mt-12">
          
          <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 mb-8 sm:mb-16 opacity-70 px-4">
            <div className="flex-1 max-w-[2rem] sm:max-w-none h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-amber-400/50"></div>
            <span className="text-white text-center uppercase tracking-[0.2em] sm:tracking-[0.3em] font-extrabold text-[10px] sm:text-sm drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] whitespace-nowrap">Our Prestige Partners</span>
            <div className="flex-1 max-w-[2rem] sm:max-w-none h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-amber-400/50"></div>
          </div>

          <div className="grid grid-cols-3 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-6 lg:gap-8 px-2">
            {brands.map((brand, index) => (
              <button
                key={index}
                onClick={() => navigate(`/brand/${brand.slug}`)}
                className="group relative w-full aspect-square sm:aspect-auto sm:w-36 sm:h-36 lg:w-44 lg:h-44"
              >
                {/* External Glowing Ring */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-400/50 via-transparent to-black rounded-2xl sm:rounded-[2.5rem] blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden sm:block"></div>
                
                {/* Main Glass Panel */}
                <div className="relative w-full h-full bg-[#111111]/40 backdrop-blur-xl border border-white/5 group-hover:border-amber-400/50 rounded-2xl sm:rounded-[2.5rem] transition-all duration-500 transform group-hover:sm:-translate-y-3 flex flex-col items-center justify-center shadow-lg sm:shadow-xl group-hover:shadow-[0_20px_40px_rgb(var(--primary-400)_/_0.2)] overflow-hidden">
                  
                  {/* Internal top glare */}
                  <div className="absolute top-0 left-0 right-0 h-10 sm:h-16 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
                  
                  {/* Diagonal shimmer sweep */}
                  <div className="absolute w-[200%] h-8 sm:h-12 bg-white/10 -rotate-45 translate-y-[300%] group-hover:translate-y-[-300%] duration-1000 ease-in-out pointer-events-none"></div>

                  {/* Logo Container */}
                  <div className="relative z-10 w-8 h-8 sm:w-16 sm:h-16 lg:w-20 lg:h-20 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1 sm:group-hover:-translate-y-2">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="max-w-full max-h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"
                      loading="lazy"
                    />
                  </div>

                  {/* Brand Label */}
                  <span className="hidden sm:block absolute bottom-5 sm:bottom-6 text-[10px] sm:text-xs text-gray-300 font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500 z-10">
                    {brand.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Explore All CTA for impact */}
        <div className="mt-12 sm:mt-24 text-center z-30">
          <Link
            to="/our-fleet"
            className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 text-white font-bold tracking-[0.15em] sm:tracking-widest uppercase text-[10px] sm:text-sm"
          >
            <span className="relative z-10">Explore Entire Fleet</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Hero;