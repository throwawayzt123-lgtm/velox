import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

const navItems = [
    { to: '/', label: 'Home' },
    { to: '/our-fleet', label: 'Our Fleet' },
    { to: '/about-us', label: 'About Us' },
    { to: '/contact-us', label: 'Contact' }
]

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        // If scrolling down and passed the header height, hide it
        setIsVisible(false);
      } else {
        // If scrolling up, show it
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // Cleanup
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

    return (
        <nav 
      className={`fixed top-0 w-full py-3 z-50 bg-black/60 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3">
                            <img src="/Logo.png" alt="Logo" className="w-40 h-20 rounded-md shadow-md" />
                            {/* <span className="text-white font-extrabold text-lg tracking-tight">LuxuryRentals</span> */}
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                className={({ isActive }) =>
                                    item.isSpecial
                                        ? `text-sm font-bold transition px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-black shadow-md`
                                        : `text-sm font-medium transition px-2 py-1 ${isActive ? 'text-white underline underline-offset-8 decoration-amber-400' : 'text-gray-300 hover:text-white hover:decoration-amber-400'}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <Link to="/our-fleet" className="ml-2 inline-flex items-center px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-lg font-semibold shadow">
                            Explore Cars
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setOpen((o) => !o)}
                            aria-label="Toggle menu"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/5 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {open ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            {open && (
                <div className="md:hidden bg-black/95 border-t border-amber-400/10">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) => 
                                    item.isSpecial
                                        ? 'block px-3 py-2 rounded-md text-base font-bold bg-amber-400 text-black'
                                        : `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white bg-white/5' : 'text-gray-300 hover:text-white'}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))} 
                        <div className="pt-3">
                            <Link to="/our-fleet" onClick={() => setOpen(false)} className="block w-full text-center px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-lg font-semibold">
                                Explore Cars
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar 